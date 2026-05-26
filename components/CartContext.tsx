'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { StaticImageData } from 'next/image';

export type CartProduct = {
  id: string;
  name: string;
  pack: string;
  price: number;
  priceLabel: string;
  image: StaticImageData;
};

export type CartItem = CartProduct & { quantity: number };

type CartTotals = {
  subtotal: number;
  shipping: number;
  shippingIsFree: boolean;
  freeShippingThreshold: number;
  amountUntilFreeShipping: number;
  taxableAmount: number;
  gst: number;
  gstRate: number;
  grandTotal: number;
};

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  addItem: (product: CartProduct, quantity?: number) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  count: number;
  totals: CartTotals;
  /** @deprecated kept for back-compat; use totals.subtotal */
  subtotal: number;
};

const STORAGE_KEY = '10x:cart';
const GST_RATE = 0.18;
const FREE_SHIPPING_THRESHOLD = 499;
const FLAT_SHIPPING_FEE = 49;
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, hydrated]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const prev = document.body.style.overflow;
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = prev;
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  const addItem = useCallback(
    (product: CartProduct, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.id === product.id);
        if (existing) {
          return prev.map((i) =>
            i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i,
          );
        }
        return [...prev, { ...product, quantity }];
      });
    },
    [],
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const setQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const { count, totals } = useMemo(() => {
    let count = 0;
    let subtotal = 0;
    for (const item of items) {
      count += item.quantity;
      subtotal += item.price * item.quantity;
    }

    const hasItems = count > 0;
    const shippingIsFree = !hasItems || subtotal >= FREE_SHIPPING_THRESHOLD;
    const shipping = shippingIsFree ? 0 : FLAT_SHIPPING_FEE;
    const taxableAmount = subtotal + shipping;
    const gst = taxableAmount * GST_RATE;
    const grandTotal = taxableAmount + gst;
    const amountUntilFreeShipping = Math.max(
      0,
      FREE_SHIPPING_THRESHOLD - subtotal,
    );

    return {
      count,
      totals: {
        subtotal,
        shipping,
        shippingIsFree,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        amountUntilFreeShipping,
        taxableAmount,
        gst,
        gstRate: GST_RATE,
        grandTotal,
      },
    };
  }, [items]);

  const value: CartContextValue = {
    items,
    isOpen,
    open,
    close,
    toggle,
    addItem,
    removeItem,
    setQuantity,
    clear,
    count,
    totals,
    subtotal: totals.subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
