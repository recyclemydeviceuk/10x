'use client';

import Link from 'next/link';
import { useState } from 'react';

import { IconArrow } from '@/components/ui/Field';
import { inr } from '@/lib/store/types';

import { useAccountData } from './AccountDataContext';
import OrderStatusPill from './OrderStatusPill';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'In progress' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
  { id: 'returned', label: 'Returned' },
] as const;

type FilterId = (typeof FILTERS)[number]['id'];

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** All orders on the account, newest first, with a lightweight status filter. */
export default function OrdersList() {
  const { orders, loading, error } = useAccountData();
  const [filter, setFilter] = useState<FilterId>('all');

  if (loading) {
    return <div className="h-72 w-full animate-pulse bg-paper-200" />;
  }

  const visible = orders.filter((o) => {
    if (filter === 'delivered') return o.status === 'delivered';
    if (filter === 'cancelled') return o.status === 'cancelled';
    if (filter === 'returned') return o.status === 'returned';
    if (filter === 'active') return o.status !== 'delivered' && o.status !== 'cancelled' && o.status !== 'returned';
    return true;
  });

  /** How many sit behind each filter — shown on the chip so empty ones explain themselves. */
  const countFor = (id: FilterId) =>
    id === 'all'
      ? orders.length
      : orders.filter((o) =>
          id === 'active'
            ? o.status !== 'delivered' && o.status !== 'cancelled' && o.status !== 'returned'
            : o.status === id,
        ).length;

  return (
    <div>
      <h2 className="font-condensed text-2xl font-black uppercase italic tracking-tight text-fg">
        Orders
      </h2>

      {orders.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const active = filter === f.id;
            const count = countFor(f.id);
            // A filter with nothing behind it isn't worth a chip.
            if (count === 0 && f.id !== 'all') return null;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                aria-pressed={active}
                className={`cursor-pointer rounded-full border px-3.5 py-2 font-quantico text-[11px] font-bold uppercase tracking-[0.1em] transition-colors ${
                  active
                    ? 'border-accent bg-accent text-ink'
                    : 'border-paper-200 text-fg-muted hover:border-fg hover:text-fg'
                }`}
              >
                {f.label}
                <span className={`ml-1.5 ${active ? 'text-ink/60' : 'text-fg-subtle'}`}>{count}</span>
              </button>
            );
          })}
        </div>
      )}

      {error && (
        <p role="alert" className="mt-6 border-2 border-danger/40 bg-danger/[0.06] px-4 py-3 font-pt text-body-sm font-bold text-danger">
          {error}
        </p>
      )}

      {/* Empty — no orders at all */}
      {!error && orders.length === 0 && (
        <div className="mt-7 border-2 border-dashed border-paper-300 px-6 py-14 text-center">
          <h3 className="font-condensed text-xl font-black uppercase italic tracking-tight text-fg">
            No Orders Yet
          </h3>
          <p className="mx-auto mt-3 max-w-sm font-pt text-body text-fg-muted">
            Your orders will appear here with full tracking once you place one.
          </p>
          <Link
            href="/products/10x-daytime"
            className="mt-7 inline-flex cursor-pointer items-center gap-2 bg-accent px-7 py-3.5 font-quantico text-body-sm font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-accent-hover"
          >
            Shop 10X Daytime
            {IconArrow}
          </Link>
        </div>
      )}

      {orders.length > 0 && visible.length === 0 && (
        <p className="mt-7 border-2 border-dashed border-paper-300 px-6 py-10 text-center font-pt text-body text-fg-muted">
          No orders in this view.
        </p>
      )}

      {/* One compact row per order: everything a list needs — reference, date,
          items summary, payment, status, total — without repeating the whole
          receipt. The receipt lives on the detail page. */}
      <ul className="mt-5 space-y-2.5">
        {visible.map((order) => {
          const units = order.items.reduce((n, i) => n + i.quantity, 0);
          const itemsLabel =
            order.items.length === 1
              ? `${order.items[0].name} × ${order.items[0].quantity}`
              : `${units} items`;
          return (
            <li key={order.id}>
              <Link
                href={`/account/orders/${order.id}`}
                className="group flex items-center gap-4 border border-paper-200 px-4 py-3.5 transition-colors hover:border-accent sm:px-5"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                    <span className="font-quantico text-body-sm font-bold uppercase tracking-wide text-fg">
                      {order.reference}
                    </span>
                    <OrderStatusPill status={order.status} />
                  </div>
                  <p className="mt-1 truncate font-pt text-caption text-fg-muted">
                    {shortDate(order.placedAt)} · {itemsLabel}
                    {order.subscriptionId ? ' · subscription' : ''}
                    {order.paymentStatus === 'pending' && order.paymentMethod === 'cod' ? ' · pay on delivery' : ''}
                    {order.paymentStatus === 'refunded' ? ' · refunded' : ''}
                  </p>
                </div>
                <span className="shrink-0 text-right font-condensed text-lg font-black tracking-tight text-fg">
                  {inr(order.total)}
                </span>
                <span aria-hidden className="shrink-0 text-fg-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-fg">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
