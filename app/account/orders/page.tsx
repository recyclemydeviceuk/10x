'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { getOrders, type Order } from '../../../components/account/accountData';

function fmt(n: number) {
  return `₹${Math.floor(n).toLocaleString('en-IN')}`;
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

const STATUS_STYLE: Record<string, string> = {
  Processing: 'bg-warning/15 text-warning',
  Shipped: 'bg-brand-blue/10 text-brand-blue',
  Delivered: 'bg-success/15 text-success',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    setOrders(getOrders());
  }, []);

  return (
    <div>
      <header className="mb-6">
        <h2 className="font-quantico text-display-md font-bold uppercase tracking-tight text-ink">Orders</h2>
        <p className="mt-1 font-pt text-body text-fg-muted">Track and review your 10X orders.</p>
      </header>

      {orders === null ? (
        <p className="font-pt text-body text-fg-muted">Loading…</p>
      ) : orders.length === 0 ? (
        <div className="border border-paper-200 bg-white p-10 text-center shadow-card">
          <p className="font-quantico text-body-lg font-bold uppercase tracking-wide text-ink">No orders yet</p>
          <p className="mx-auto mt-2 max-w-sm font-pt text-body text-fg-muted">When you place an order it will show up here for easy tracking.</p>
          <Link href="/products/10x-daytime" className="mt-6 inline-flex cursor-pointer items-center bg-accent px-7 py-3 font-quantico text-body-sm font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-accent-hover">
            Shop 10X Daytime
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="border border-paper-200 bg-white p-5 shadow-card md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-paper-200 pb-4">
                <div>
                  <p className="font-quantico text-body font-bold uppercase tracking-wide text-ink">Order {order.id}</p>
                  <p className="mt-0.5 font-pt text-caption text-fg-muted">Placed {formatDate(order.date)}</p>
                </div>
                <span className={`px-2.5 py-1 font-quantico text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLE[order.status ?? 'Processing'] ?? STATUS_STYLE.Processing}`}>
                  {order.status ?? 'Processing'}
                </span>
              </div>
              <ul className="space-y-2 py-4">
                {order.items.map((item, i) => (
                  <li key={i} className="flex justify-between gap-4 font-pt text-body-sm">
                    <span className="text-fg">{item.name} <span className="text-fg-muted">× {item.qty}</span></span>
                    <span className="whitespace-nowrap text-fg">{fmt(item.price * item.qty)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between border-t border-paper-200 pt-4 font-quantico text-body font-bold uppercase tracking-wide text-ink">
                <span>Total</span><span>{fmt(order.totals.grandTotal)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
