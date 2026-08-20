'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { api } from '@/lib/api/storefront';
import type { StoreSettings } from '@/lib/catalog';
import { shippingFor, type CartLine } from '@/lib/store/types';

import { useStoreSettings } from '../StoreSettingsContext';
import { useAuth } from '../account/AuthContext';

/**
 * The cart.
 *
 * 10X sells one product in one pack size, so the cart holds a single
 * configured line rather than a list. Choosing a different pack or switching
 * between one-time and subscription replaces that line — it does not stack a
 * second one, which is what a customer means when they change their mind on
 * the product page.
 *
 * It survives refreshes through the backend cart collection. The browser holds
 * only an HttpOnly cart-session cookie.
 *
 * WHAT IS AND ISN'T TRUSTED: the line carries a price so the cart can render
 * without a round trip, but the checkout sends only `productId`, `tierId` and
 * a quantity — the server prices the order from the catalogue. The coupon
 * works the same way: the discount shown here comes from the API's own
 * calculation, and the API runs it again when the order is placed.
 */

/** A subscription always ships one pack per cycle. */
const MAX_QUANTITY = 9;

export type AppliedCoupon = { code: string; label: string };

export type FeaturedCoupon = { code: string; label: string; minOrder: number };

type CartContextValue = {
  line: CartLine | null;
  /** True until storage has been read — stops an empty-cart flash on load. */
  loading: boolean;
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  /** Savings versus buying the same thing one-time. Zero for one-time carts. */
  savings: number;
  /** Live store rules — the shipping threshold the server will actually apply. */
  settings: StoreSettings;
  /** The applied coupon, or null. */
  coupon: AppliedCoupon | null;
  /** What the applied coupon takes off, in rupees. 0 when none applies. */
  discount: number;
  /** Set when a stored coupon stopped qualifying after a cart change. */
  couponNotice: string | null;
  /** Codes the store is promoting, from the admin panel. */
  featuredCoupons: FeaturedCoupon[];
  /** The most units this line can go to, given stock. */
  maxQuantity: number;
  addLine: (line: CartLine) => void;
  setQuantity: (quantity: number) => void;
  applyCoupon: (code: string) => Promise<{ ok: boolean; message?: string }>;
  removeCoupon: () => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [line, setLine] = useState<CartLine | null>(null);
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
  const [discount, setDiscount] = useState(0);
  const [couponNotice, setCouponNotice] = useState<string | null>(null);
  // The store's rules arrive with the page, server-side, so the first total
  // the customer sees is already the real one.
  const settings = useStoreSettings();
  const { customer, loading: authLoading } = useAuth();
  const [featuredCoupons, setFeaturedCoupons] = useState<FeaturedCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  /** The code we last asked the API about, so re-checks don't loop. */
  const pendingCode = useRef<string | null>(null);

  const subtotal = line ? line.price * line.quantity : 0;

  /* ------------------------------------------------------------ database */

  useEffect(() => {
    // Wait for the auth cookie to be resolved. Re-run when the customer signs
    // in so a cart saved on another device is pulled from MongoDB immediately.
    if (authLoading) return;
    let alive = true;
    setLoading(true);
    api<{ cart: { line: CartLine | null; couponCode: string } }>('/api/v1/cart', { auth: false })
      .then((result) => {
        if (!alive || !result.ok) return;
        setLine(result.data.cart.line);
        setCoupon(result.data.cart.couponCode ? { code: result.data.cart.couponCode, label: '' } : null);
      })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [authLoading, customer?.id]);

  /* --------------------------------------------------------------- promos */

  useEffect(() => {
    let alive = true;
    api<{ coupons: FeaturedCoupon[] }>('/api/v1/coupons/featured', { auth: false }).then((result) => {
      if (alive && result.ok) setFeaturedCoupons(result.data.coupons);
    });
    return () => {
      alive = false;
    };
  }, []);

  const persist = useCallback((next: CartLine | null, couponCode = coupon?.code ?? '') => {
    setLine(next);
    void api('/api/v1/cart', { method: 'PUT', auth: false, body: { line: next, couponCode } });
  }, [coupon]);

  /* ------------------------------------------------------------- coupons */

  const removeCoupon = useCallback(() => {
    setCoupon(null);
    setDiscount(0);
    setCouponNotice(null);
    pendingCode.current = null;
    void api('/api/v1/cart', { method: 'PUT', auth: false, body: { line, couponCode: '' } });
  }, [line]);

  const applyCoupon = useCallback(
    async (raw: string): Promise<{ ok: boolean; message?: string }> => {
      const code = raw.trim().toUpperCase();
      if (!code) return { ok: false, message: 'Enter a coupon code.' };
      if (!subtotal) return { ok: false, message: 'Add something to the cart first.' };

      // The server decides. It re-runs the same check when the order is
      // placed, so this can never be the only gate.
      const result = await api<{ coupon: { code: string; description?: string }; discount: number }>(
        '/api/v1/coupons/validate',
        { method: 'POST', auth: false, body: { code, subtotal } },
      );

      if (!result.ok) return { ok: false, message: result.message };

      setCoupon({ code: result.data.coupon.code, label: result.data.coupon.description ?? '' });
      setDiscount(result.data.discount);
      setCouponNotice(null);
      pendingCode.current = `${result.data.coupon.code}:${subtotal}`;
      void api('/api/v1/cart', { method: 'PUT', auth: false, body: { line, couponCode: result.data.coupon.code } });
      return { ok: true };
    },
    [subtotal, line],
  );

  /**
   * A stored coupon is re-checked whenever the cart's subtotal changes:
   * changing the quantity or switching to a subscription can put the cart
   * below a minimum, and a discount that silently stops qualifying is worse
   * than one that visibly drops off.
   */
  useEffect(() => {
    if (!coupon) return;
    const signature = `${coupon.code}:${subtotal}`;
    if (pendingCode.current === signature) return;
    pendingCode.current = signature;

    if (!subtotal) {
      setDiscount(0);
      return;
    }

    let alive = true;
    api<{ coupon: { code: string; description?: string }; discount: number }>(
      '/api/v1/coupons/validate',
      { method: 'POST', auth: false, body: { code: coupon.code, subtotal } },
    ).then((result) => {
      if (!alive) return;
      if (result.ok) {
        setDiscount(result.data.discount);
        setCoupon({ code: result.data.coupon.code, label: result.data.coupon.description ?? '' });
        setCouponNotice(null);
      } else {
        // Say why it came off, and where. Dropping it in silence is how a
        // customer reaches the payment step expecting a different total.
        setDiscount(0);
        setCoupon(null);
        setCouponNotice(`${coupon.code} came off: ${result.message}`);
        void api('/api/v1/cart', { method: 'PUT', auth: false, body: { line, couponCode: '' } });
      }
    });

    return () => {
      alive = false;
    };
  }, [coupon, subtotal, line]);

  /* ---------------------------------------------------------------- line */

  const maxQuantity = Math.max(1, Math.min(MAX_QUANTITY, line?.stock ?? MAX_QUANTITY));

  const addLine = useCallback(
    (next: CartLine) => {
      const ceiling = Math.max(1, Math.min(MAX_QUANTITY, next.stock ?? MAX_QUANTITY));
      // A subscription is always one pack per cycle; clamp anything else.
      persist({
        ...next,
        quantity: next.isSubscription ? 1 : Math.min(ceiling, Math.max(1, next.quantity)),
      });
    },
    [persist],
  );

  const setQuantity = useCallback((quantity: number) => {
    setLine((current) => {
      if (!current || current.isSubscription) return current;
      const ceiling = Math.max(1, Math.min(MAX_QUANTITY, current.stock ?? MAX_QUANTITY));
      const next = { ...current, quantity: Math.min(ceiling, Math.max(1, quantity)) };
      void api('/api/v1/cart', { method: 'PUT', auth: false, body: { line: next, couponCode: coupon?.code ?? '' } });
      return next;
    });
  }, [coupon]);

  const clear = useCallback(() => {
    setLine(null);
    setCoupon(null);
    setDiscount(0);
    setCouponNotice(null);
    pendingCode.current = null;
    void api('/api/v1/cart', { method: 'DELETE', auth: false });
  }, []);

  const value = useMemo(() => {
    const itemCount = line ? line.quantity : 0;
    const shipping = line
      ? shippingFor(Math.max(0, subtotal - discount), settings.freeShippingOver, settings.flatShipping, settings.deliveryMode)
      : 0;
    const savings = line ? Math.max(0, (line.oneTimePrice - line.price) * line.quantity) : 0;

    return {
      line,
      loading,
      itemCount,
      subtotal,
      shipping,
      total: Math.max(0, subtotal - discount) + shipping,
      savings,
      settings,
      coupon,
      discount,
      couponNotice,
      featuredCoupons,
      maxQuantity,
      addLine,
      setQuantity,
      applyCoupon,
      removeCoupon,
      clear,
    };
  }, [
    line, subtotal, discount, coupon, couponNotice, featuredCoupons, settings,
    maxQuantity, loading, addLine, setQuantity, applyCoupon, removeCoupon, clear,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
