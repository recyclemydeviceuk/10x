'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

// ── Types mirror the order shape written by CheckoutModal ──────────────
type StoredOrder = {
  id: string;
  date: string;
  status: string;
  product: string;
  tier: string;
  subscription: boolean;
  qty: number;
  total: number;
  payment: string;
  customer: { name: string; phone: string; email: string };
  address: {
    house: string;
    floor: string;
    street: string;
    landmark: string;
    city: string;
    pincode: string;
  };
};

const PAYMENT_LABELS: Record<string, string> = {
  upi: 'UPI',
  card: 'Card',
  netbanking: 'Net Banking',
  wallet: 'Wallet',
  cod: 'Cash on Delivery',
};

const DAY = 24 * 60 * 60 * 1000;

// Days after the order was placed that each status becomes current,
// against the 3-day express estimate.
const STAGES = [
  { key: 'confirmed', title: 'Order Confirmed', note: 'Payment received', offset: 0 },
  { key: 'packed', title: 'Packed', note: 'Boxed and ready to dispatch', offset: 1 },
  { key: 'shipped', title: 'Shipped', note: 'Handed to courier', offset: 2 },
  { key: 'out', title: 'Out for Delivery', note: 'On the way to you', offset: 3 },
  { key: 'delivered', title: 'Delivered', note: 'Enjoy your brain battery', offset: 3.4 },
] as const;

function fmt(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}

function longDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function normalizeId(raw: string) {
  return raw.trim().toUpperCase().replace(/\s+/g, '');
}

function readOrder(id: string): StoredOrder | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(`10x:order:${id}`);
    if (!raw) return null;
    return JSON.parse(raw) as StoredOrder;
  } catch {
    return null;
  }
}

const IconSearch = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IconCheck = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 12.5 10 17.5 19 7" />
  </svg>
);

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-paper-200 py-2.5 last:border-0">
      <dt className="font-pt text-body-sm text-fg-muted">{label}</dt>
      <dd className="text-right font-quantico text-body-sm font-bold text-fg">{value}</dd>
    </div>
  );
}

export default function OrderTracker({ initialId = '' }: { initialId?: string }) {
  const [input, setInput] = useState(initialId);
  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [searched, setSearched] = useState(false);
  const [now, setNow] = useState<number | null>(null);

  const runLookup = useCallback((rawId: string) => {
    const id = normalizeId(rawId);
    setSearched(true);
    if (!id) {
      setOrder(null);
      setNotFound(false);
      return;
    }
    const found = readOrder(id);
    setOrder(found);
    setNotFound(!found);
    setNow(Date.now());
  }, []);

  // Only auto-track when an id is passed explicitly via the URL (e.g. the
  // "Track your order" link from checkout). Otherwise the field starts
  // empty and nothing shows until the user searches.
  useEffect(() => {
    setNow(Date.now());
    if (initialId) {
      setInput(initialId);
      runLookup(initialId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    runLookup(input);
  }

  const placedAt = order ? new Date(order.date).getTime() : 0;
  const reachedIndex = order && now
    ? STAGES.reduce((acc, s, i) => (now >= placedAt + s.offset * DAY ? i : acc), 0)
    : 0;
  const delivered = reachedIndex >= STAGES.length - 1;
  const eta = order ? longDate(new Date(placedAt + 3 * DAY).toISOString()) : '';

  return (
    <main id="main" className="min-h-[70vh] bg-paper pt-28 sm:pt-32">
      <div className="mx-auto w-full max-w-lg px-6 py-12">
        <h1 className="font-condensed text-2xl font-black uppercase italic tracking-tight text-fg">
          Track Your Order
        </h1>
        <p className="mt-2 font-pt text-body-sm text-fg-muted">
          Enter the Order ID from your confirmation email.
        </p>

        {/* Lookup form */}
        <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fg-subtle">
              {IconSearch}
            </span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. 10X-482-7391"
              aria-label="Order ID"
              autoComplete="off"
              spellCheck={false}
              className="w-full rounded-full border-2 border-paper-200 bg-white py-3.5 pl-12 pr-4 font-quantico text-body font-bold uppercase tracking-[0.06em] text-fg outline-none ring-2 ring-transparent transition-colors placeholder:font-normal placeholder:normal-case placeholder:tracking-normal placeholder:text-fg-subtle focus:border-accent focus:ring-accent"
            />
          </div>
          <button
            type="submit"
            className="shrink-0 cursor-pointer rounded-full bg-accent px-7 py-3.5 font-quantico text-body-sm font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-accent-hover"
          >
            Track
          </button>
        </form>

        {/* Not found */}
        {searched && notFound && (
          <p className="mt-6 rounded-2xl border border-paper-200 bg-white p-5 text-center font-pt text-body-sm text-fg-muted">
            No order found for that ID on this device. Check your confirmation email, or{' '}
            <Link href="/contact" className="font-bold text-brand-blue underline">contact support</Link>.
          </p>
        )}

        {/* Found */}
        {order && (
          <div className="mt-6 rounded-2xl border border-paper-200 bg-white p-6 shadow-card">
            {/* Status */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-quantico text-lg font-bold tracking-[0.05em] text-ink">{order.id}</p>
                <p className="mt-0.5 font-pt text-caption text-fg-muted">Placed {longDate(order.date)}</p>
              </div>
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-quantico text-[11px] font-bold uppercase tracking-wide ${
                  delivered ? 'bg-success/15 text-success' : 'bg-accent/20 text-accent-pressed'
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${delivered ? 'bg-success' : 'bg-accent'}`} />
                {STAGES[reachedIndex].title}
              </span>
            </div>

            {/* Status timeline */}
            <ol className="mt-6 border-t border-paper-200 pt-5">
              {STAGES.map((stage, i) => {
                const done = i <= reachedIndex;
                const active = i === reachedIndex && !delivered;
                const last = i === STAGES.length - 1;
                return (
                  <li key={stage.key} className="relative flex gap-3.5 pb-6 last:pb-0">
                    {/* Connector */}
                    {!last && (
                      <span
                        className={`absolute left-[13px] top-7 h-[calc(100%-1.75rem)] w-0.5 ${
                          i < reachedIndex ? 'bg-accent' : 'bg-paper-200'
                        }`}
                        aria-hidden
                      />
                    )}
                    {/* Node */}
                    <span
                      className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${
                        done ? 'border-accent bg-accent text-ink' : 'border-paper-200 bg-white text-fg-subtle'
                      } ${active ? 'shadow-glow-soft' : ''}`}
                    >
                      {done ? IconCheck : <span className="h-1.5 w-1.5 rounded-full bg-paper-300" />}
                    </span>
                    {/* Label */}
                    <div className="pt-0.5">
                      <p className={`font-quantico text-body-sm font-bold uppercase tracking-wide ${done ? 'text-fg' : 'text-fg-subtle'}`}>
                        {stage.title}
                        {active && (
                          <span className="ml-2 rounded-full bg-accent/20 px-2 py-0.5 font-quantico text-[9px] font-bold uppercase tracking-wide text-accent-pressed">
                            Now
                          </span>
                        )}
                      </p>
                      <p className={`mt-0.5 font-pt text-caption ${done ? 'text-fg-muted' : 'text-fg-subtle'}`}>
                        {stage.note}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>

            {/* Details */}
            <dl className="mt-2 border-t border-paper-200 pt-4">
              <Row label={delivered ? 'Delivered' : 'Estimated arrival'} value={eta} />
              <Row label="Name" value={order.customer?.name || '—'} />
              <Row label="Phone" value={order.customer?.phone || '—'} />
              <Row label="Email" value={order.customer?.email || '—'} />
              <Row
                label="Address"
                value={[
                  order.address?.house,
                  order.address?.street,
                  [order.address?.city, order.address?.pincode].filter(Boolean).join(' — '),
                ].filter(Boolean).join(', ') || '—'}
              />
              <Row
                label="Item"
                value={[order.tier, order.product].filter(Boolean).join(' · ') || '10X Daytime'}
              />
              <Row
                label={order.subscription ? 'Plan' : 'Quantity'}
                value={order.subscription ? 'Subscription' : `× ${order.qty ?? 1}`}
              />
              <Row label="Payment" value={PAYMENT_LABELS[order.payment] || order.payment || '—'} />
              <Row label="Total" value={typeof order.total === 'number' ? fmt(order.total) : '—'} />
            </dl>
          </div>
        )}
      </div>
    </main>
  );
}
