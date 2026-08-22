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
import { usePathname } from 'next/navigation';

import { api, firstMessage } from '@/lib/api/storefront';
import {
  ORDER_STAGES,
  type Address,
  type AddressDraft,
  type Order,
  type OrderEvent,
  type OrderStage,
  type OrderStatus,
  type Subscription,
} from '@/lib/store/types';

import { useAuth } from './AuthContext';

/**
 * Account data — orders, subscriptions and the address book.
 *
 * Everything is read from the API for the signed-in customer. Nothing is
 * cached across accounts and nothing is invented locally: if the customer
 * signs out, the state empties, and every mutation goes to the server and
 * then re-reads, so the page can never drift from what was actually recorded.
 *
 * The address book lives on the customer record, so it is owned by
 * AuthContext; this provider re-exposes it (and the write helpers) so the
 * account pages and checkout have one place to look.
 */

type ActionResult = { ok: boolean; message?: string };

type AccountDataValue = {
  addresses: Address[];
  orders: Order[];
  subscriptions: Subscription[];
  loading: boolean;
  /** Set when the API couldn't be reached — pages show it instead of "no orders". */
  error: string | null;
  summary: AccountSummary;
  defaultAddress: Address | null;
  addAddress: (draft: AddressDraft) => Promise<Address | null>;
  updateAddress: (id: string, patch: Partial<AddressDraft>) => Promise<ActionResult>;
  removeAddress: (id: string) => Promise<ActionResult>;
  makeDefaultAddress: (id: string) => Promise<ActionResult>;
  /** Cancel an order that hasn't shipped yet. */
  cancelOrder: (id: string) => Promise<ActionResult>;
  /** Stop a plan. Nothing further ships or is charged. */
  cancelSubscription: (id: string) => Promise<ActionResult>;
  /** Pause a plan without ending it. */
  pauseSubscription: (id: string) => Promise<ActionResult>;
  /** Start a stopped plan again, with the next box on the way. */
  restartSubscription: (id: string) => Promise<ActionResult>;
  /** Set up auto-pay: opens Cashfree's mandate window, then re-syncs. */
  enableAutopay: (id: string) => Promise<ActionResult>;
  /** Ask the server to re-check the mandate with Cashfree. */
  refreshAutopay: (id: string) => Promise<ActionResult>;
  /** "I'll pay on delivery" — stops the auto-pay reminders (undo re-enables them). */
  declineAutopay: (id: string, undo?: boolean) => Promise<ActionResult>;
  /** Switch auto-pay off: cancels the mandate; later boxes are pay-on-delivery. */
  disableAutopay: (id: string) => Promise<ActionResult>;
  /** Pull orders and subscriptions again — used after checkout. */
  refresh: () => Promise<void>;
};

export type AccountSummary = {
  totalSpend: number;
  orderCount: number;
  delivered: number;
  inFlight: number;
  activeSubs: number;
  packsOrdered: number;
};

const AccountDataContext = createContext<AccountDataValue | null>(null);

/* ------------------------------------------------------------ API shapes */

type ApiOrder = {
  id: string;
  reference: string;
  items: { sku: string; name: string; packets: string; quantity: number; unitPrice: number }[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  couponCode: string;
  paymentMethod: 'online' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  status: OrderStatus;
  address: {
    fullName: string;
    line1: string;
    line2: string;
    landmark: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  timeline: { stage: string; at: string }[];
  courier: string;
  trackingNumber: string;
  courierStatus: string;
  invoiceNo: string;
  estimatedDelivery: string | null;
  subscriptionId: string | null;
  autopay?: boolean;
  placedAt: string;
};

type ApiSubscription = {
  reference: string;
  planName: string;
  sku: string;
  packets: string;
  quantity: number;
  price: number;
  intervalDays: number;
  status: 'active' | 'paused' | 'cancelled';
  nextDelivery: string | null;
  cyclesDelivered: number;
  startedAt: string;
  address: { fullName?: string; line1: string; line2: string; landmark?: string; city: string; state: string; pincode: string; phone: string };
  savingsPerCycle: number;
  autopay?: { status: string; authorizedAt: string | null; declined?: boolean };
};

/* --------------------------------------------------------------- mapping */

/**
 * The API records only the stages that actually happened. The order timeline
 * renders the whole journey with the rest still pending, so fill the gaps.
 */
function toTimeline(entries: { stage: string; at: string }[]): OrderEvent[] {
  const stamped = new Map(entries.map((e) => [e.stage, e.at]));
  return ORDER_STAGES.map((stage: OrderStage) => ({ stage, at: stamped.get(stage) ?? null }));
}

function toOrder(o: ApiOrder): Order {
  return {
    id: o.id,
    reference: o.reference,
    placedAt: o.placedAt,
    status: o.status,
    items: o.items.map((i) => ({
      sku: i.sku,
      name: i.name,
      packets: i.packets,
      quantity: i.quantity,
      price: i.unitPrice,
    })),
    subtotal: o.subtotal,
    shipping: o.shippingFee,
    discount: o.discount,
    couponCode: o.couponCode || undefined,
    total: o.total,
    paymentMethod: o.paymentMethod,
    paymentStatus: o.paymentStatus,
    address: {
      // The delivery address is a snapshot on the order, not an entry in the
      // address book — it keeps whatever it was shipped to even if the book
      // is edited later.
      id: `${o.id}-shipping`,
      label: 'Delivery address',
      fullName: o.address.fullName,
      phone: o.address.phone,
      house: o.address.line1,
      street: o.address.line2,
      landmark: o.address.landmark || undefined,
      city: o.address.city,
      state: o.address.state,
      pincode: o.address.pincode,
      isDefault: false,
    },
    timeline: toTimeline(o.timeline),
    courier: o.courier || undefined,
    trackingNumber: o.trackingNumber || undefined,
    courierStatus: o.courierStatus || undefined,
    estimatedDelivery: o.estimatedDelivery ?? undefined,
    subscriptionId: o.subscriptionId ?? undefined,
    autopay: Boolean(o.autopay),
  };
}

function cadenceLabel(days: number): string {
  if (days % 7 === 0) {
    const weeks = days / 7;
    return weeks === 1 ? 'Every week' : `Every ${weeks} weeks`;
  }
  return days === 1 ? 'Every day' : `Every ${days} days`;
}

function toSubscription(s: ApiSubscription): Subscription {
  return {
    // The reference IS the id everywhere the customer's own controls act, so
    // there is one identifier to reason about.
    id: s.reference,
    reference: s.reference,
    sku: s.sku,
    productName: s.planName,
    packets: s.packets,
    price: s.price,
    cadence: cadenceLabel(s.intervalDays),
    status: s.status,
    startedAt: s.startedAt,
    nextDelivery: s.nextDelivery,
    cyclesDelivered: s.cyclesDelivered,
    address: {
      id: `${s.reference}-shipping`,
      label: 'Delivery address',
      fullName: s.address?.fullName ?? '',
      phone: s.address?.phone ?? '',
      house: s.address?.line1 ?? '',
      street: s.address?.line2 ?? '',
      landmark: s.address?.landmark || undefined,
      city: s.address?.city ?? '',
      state: s.address?.state ?? '',
      pincode: s.address?.pincode ?? '',
      isDefault: false,
    },
    savingsPerCycle: s.savingsPerCycle,
    autopayStatus: (s.autopay?.status ?? '') as Subscription['autopayStatus'],
    autopayDeclined: Boolean(s.autopay?.declined),
  };
}

/** Everything the dashboard's stat row shows, derived from the orders. */
export function accountSummary(orders: Order[], subs: Subscription[]): AccountSummary {
  const counted = orders.filter((o) => o.status !== 'cancelled');
  return {
    totalSpend: counted.reduce((sum, o) => sum + o.total, 0),
    orderCount: counted.length,
    delivered: counted.filter((o) => o.status === 'delivered').length,
    inFlight: counted.filter((o) => o.status !== 'delivered' && o.status !== 'returned').length,
    activeSubs: subs.filter((s) => s.status === 'active').length,
    packsOrdered: counted.reduce((sum, o) => sum + o.items.reduce((n, i) => n + i.quantity, 0), 0),
  };
}

/* -------------------------------------------------------------- provider */

export function AccountDataProvider({ children }: { children: ReactNode }) {
  const { customer, addresses, saveAddresses, refresh: refreshProfile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const customerId = customer?.id ?? null;

  const load = useCallback(async () => {
    if (!customerId) {
      setOrders([]);
      setSubscriptions([]);
      setError(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const [ordersResult, subsResult] = await Promise.all([
      api<{ orders: ApiOrder[] }>('/api/v1/me/orders'),
      api<{ subscriptions: ApiSubscription[] }>('/api/v1/me/subscriptions'),
    ]);

    if (ordersResult.ok) setOrders(ordersResult.data.orders.map(toOrder));
    if (subsResult.ok) setSubscriptions(subsResult.data.subscriptions.map(toSubscription));

    // Only an unreachable API is worth surfacing: an empty list is a real,
    // renderable answer, and "couldn't load" over the top of it would be a lie.
    const failed = !ordersResult.ok ? ordersResult : !subsResult.ok ? subsResult : null;
    setError(failed && failed.status >= 500 ? failed.message : null);
    setLoading(false);
  }, [customerId]);

  useEffect(() => {
    void load();
  }, [load]);

  // Orders move without the customer doing anything (packed, shipped,
  // delivered). Re-read whenever they come back to the tab or move between
  // account pages, so what they see is what the warehouse sees.
  const pathname = usePathname();
  const lastLoad = useRef(0);
  useEffect(() => {
    if (!customerId) return;
    const now = Date.now();
    if (now - lastLoad.current > 5_000) {
      lastLoad.current = now;
      void load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  useEffect(() => {
    if (!customerId) return;
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        lastLoad.current = Date.now();
        void load();
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onVisible);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onVisible);
    };
  }, [customerId, load]);

  /* ------------------------------------------------------------ addresses */

  const withBook = useCallback(
    async (next: Address[]): Promise<ActionResult> => {
      const result = await saveAddresses(next);
      return result.ok ? { ok: true } : { ok: false, message: result.message };
    },
    [saveAddresses],
  );

  const addAddress = useCallback(
    async (draft: AddressDraft): Promise<Address | null> => {
      // The first address a customer saves is their default, whatever the
      // form said.
      const isDefault = draft.isDefault || addresses.length === 0;
      const created: Address = { ...draft, id: 'pending', isDefault };
      const next = isDefault
        ? [...addresses.map((a) => ({ ...a, isDefault: false })), created]
        : [...addresses, created];
      const result = await saveAddresses(next);
      if (!result.ok || !result.addresses) return null;
      // The new address is the one just appended — and now it carries the id
      // the server gave it, which is what the checkout selects on.
      return result.addresses[result.addresses.length - 1] ?? null;
    },
    [addresses, saveAddresses],
  );

  const updateAddress = useCallback(
    (id: string, patch: Partial<AddressDraft>) =>
      withBook(addresses.map((a) => (a.id === id ? { ...a, ...patch } : a))),
    [addresses, withBook],
  );

  const removeAddress = useCallback(
    (id: string) => {
      const remaining = addresses.filter((a) => a.id !== id);
      // Deleting the default promotes the next address so one is always default.
      if (remaining.length && !remaining.some((a) => a.isDefault)) {
        remaining[0] = { ...remaining[0], isDefault: true };
      }
      return withBook(remaining);
    },
    [addresses, withBook],
  );

  const makeDefaultAddress = useCallback(
    (id: string) => withBook(addresses.map((a) => ({ ...a, isDefault: a.id === id }))),
    [addresses, withBook],
  );

  /* --------------------------------------------------------------- orders */

  const cancelOrder = useCallback(
    async (id: string): Promise<ActionResult> => {
      const order = orders.find((o) => o.id === id);
      if (!order) return { ok: false, message: 'That order is no longer on your account.' };
      const result = await api<{ order: ApiOrder }>(
        `/api/v1/me/orders/${encodeURIComponent(order.reference)}/cancel`,
        { method: 'POST' },
      );
      if (!result.ok) return { ok: false, message: firstMessage(result) };
      const updated = toOrder(result.data.order);
      setOrders((current) => current.map((o) => (o.id === updated.id ? updated : o)));
      return { ok: true };
    },
    [orders],
  );

  /* -------------------------------------------------------- subscriptions */

  const act = useCallback(
    async (reference: string, action: 'pause' | 'resume' | 'restart' | 'cancel'): Promise<ActionResult> => {
      const result = await api<{ subscription: ApiSubscription }>(
        `/api/v1/me/subscriptions/${encodeURIComponent(reference)}/action`,
        { method: 'POST', body: { action } },
      );
      if (!result.ok) return { ok: false, message: firstMessage(result) };
      const updated = toSubscription(result.data.subscription);
      setSubscriptions((current) => current.map((s) => (s.id === updated.id ? updated : s)));
      // Cancelling the last plan changes the profile's subscription flag.
      void refreshProfile();
      return { ok: true };
    },
    [refreshProfile],
  );

  const cancelSubscription = useCallback((id: string) => act(id, 'cancel'), [act]);
  const pauseSubscription = useCallback((id: string) => act(id, 'pause'), [act]);
  const restartSubscription = useCallback((id: string) => act(id, 'restart'), [act]);

  const refreshAutopay = useCallback(async (reference: string): Promise<ActionResult> => {
    const result = await api<{ subscription: ApiSubscription }>(
      `/api/v1/me/subscriptions/${encodeURIComponent(reference)}/autopay/refresh`,
      { method: 'POST' },
    );
    if (!result.ok) return { ok: false, message: firstMessage(result) };
    const updated = toSubscription(result.data.subscription);
    setSubscriptions((current) => current.map((s) => (s.id === updated.id ? updated : s)));
    return { ok: true };
  }, []);

  const declineAutopay = useCallback(async (reference: string, undo = false): Promise<ActionResult> => {
    const result = await api<{ subscription: ApiSubscription }>(
      `/api/v1/me/subscriptions/${encodeURIComponent(reference)}/autopay/decline`,
      { method: 'POST', body: { undo } },
    );
    if (!result.ok) return { ok: false, message: firstMessage(result) };
    const updated = toSubscription(result.data.subscription);
    setSubscriptions((current) => current.map((s) => (s.id === updated.id ? updated : s)));
    return { ok: true };
  }, []);

  const disableAutopay = useCallback(async (reference: string): Promise<ActionResult> => {
    const result = await api<{ subscription: ApiSubscription }>(
      `/api/v1/me/subscriptions/${encodeURIComponent(reference)}/autopay/disable`,
      { method: 'POST' },
    );
    if (!result.ok) return { ok: false, message: firstMessage(result) };
    const updated = toSubscription(result.data.subscription);
    setSubscriptions((current) => current.map((s) => (s.id === updated.id ? updated : s)));
    return { ok: true };
  }, []);

  const enableAutopay = useCallback(
    async (reference: string): Promise<ActionResult> => {
      const setup = await api<{
        autopay: { gateway: string; environment: 'sandbox' | 'production'; subscriptionSessionId: string };
      }>(`/api/v1/me/subscriptions/${encodeURIComponent(reference)}/autopay/setup`, { method: 'POST' });
      if (!setup.ok) return { ok: false, message: firstMessage(setup) };

      // The SDK is only pulled in when someone actually sets up a mandate.
      const { subscribeWithCashfree } = await import('@/lib/checkout/cashfree');
      const opened = await subscribeWithCashfree(
        setup.data.autopay.subscriptionSessionId,
        setup.data.autopay.environment,
      );
      if (!opened.ok) return opened;

      // Whatever the modal said, the server's word is final — banks confirm
      // some mandates minutes later, so 'initialized' here is normal.
      return refreshAutopay(reference);
    },
    [refreshAutopay],
  );

  const value = useMemo<AccountDataValue>(
    () => ({
      addresses,
      orders,
      subscriptions,
      loading,
      error,
      summary: accountSummary(orders, subscriptions),
      defaultAddress: addresses.find((a) => a.isDefault) ?? addresses[0] ?? null,
      addAddress,
      updateAddress,
      removeAddress,
      makeDefaultAddress,
      cancelOrder,
      cancelSubscription,
      pauseSubscription,
      restartSubscription,
      enableAutopay,
      refreshAutopay,
      declineAutopay,
      disableAutopay,
      refresh: load,
    }),
    [
      addresses, orders, subscriptions, loading, error, addAddress, updateAddress, removeAddress,
      makeDefaultAddress, cancelOrder, cancelSubscription, pauseSubscription, restartSubscription,
      enableAutopay, refreshAutopay, declineAutopay, disableAutopay, load,
    ],
  );

  return <AccountDataContext.Provider value={value}>{children}</AccountDataContext.Provider>;
}

export function useAccountData() {
  const ctx = useContext(AccountDataContext);
  if (!ctx) throw new Error('useAccountData must be used within AccountDataProvider');
  return ctx;
}
