'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useAuth } from '../../components/AuthContext';
import { getOrders, getAddresses, type Order } from '../../components/account/accountData';

function fmt(n: number) {
  return `₹${Math.floor(n).toLocaleString('en-IN')}`;
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [addressCount, setAddressCount] = useState(0);

  useEffect(() => {
    setOrders(getOrders());
    setAddressCount(getAddresses().length);
  }, []);

  const orderCount = orders?.length ?? 0;
  const recent = orders?.[0];

  const stats = [
    { label: 'Orders', value: String(orderCount), href: '/account/orders' },
    { label: 'Saved Addresses', value: String(addressCount), href: '/account/addresses' },
    { label: 'Membership', value: 'Active', href: '/account/profile' },
  ];

  return (
    <div>
      <header className="mb-6">
        <h2 className="font-quantico text-display-md font-bold uppercase tracking-tight text-ink">Dashboard</h2>
        <p className="mt-1 font-pt text-body text-fg-muted">A quick look at your 10X account.</p>
      </header>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="group border border-paper-200 bg-white p-6 transition-colors hover:border-brand-blue">
            <p className="font-condensed text-[2.5rem] font-black italic leading-none text-brand-blue">{s.value}</p>
            <p className="mt-3 flex items-center justify-between font-quantico text-caption font-bold uppercase tracking-wider text-fg-muted">
              {s.label}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="text-fg-subtle transition-transform group-hover:translate-x-0.5">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </p>
          </Link>
        ))}
      </div>

      {/* Recent order */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-quantico text-body-lg font-bold uppercase tracking-wide text-ink">Recent Order</h3>
          {orderCount > 0 && (
            <Link href="/account/orders" className="font-quantico text-caption font-bold uppercase tracking-wider text-brand-blue transition-opacity hover:opacity-70">
              View all
            </Link>
          )}
        </div>
        {orders === null ? (
          <p className="font-pt text-body text-fg-muted">Loading…</p>
        ) : recent ? (
          <div className="border border-paper-200 bg-white p-6 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-paper-200 pb-4">
              <div>
                <p className="font-quantico text-body font-bold uppercase tracking-wide text-ink">Order {recent.id}</p>
                <p className="mt-0.5 font-pt text-caption text-fg-muted">Placed {formatDate(recent.date)}</p>
              </div>
              <span className="bg-brand-blue/10 px-2.5 py-1 font-quantico text-[10px] font-bold uppercase tracking-wider text-brand-blue">
                {recent.status ?? 'Processing'}
              </span>
            </div>
            <ul className="space-y-2 py-4 font-pt text-body-sm">
              {recent.items.map((it, i) => (
                <li key={i} className="flex justify-between gap-3">
                  <span className="text-fg">{it.name} <span className="text-fg-muted">× {it.qty}</span></span>
                  <span className="whitespace-nowrap text-fg">{fmt(it.price * it.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between border-t border-paper-200 pt-4 font-quantico text-body font-bold uppercase tracking-wide text-ink">
              <span>Total</span><span>{fmt(recent.totals.grandTotal)}</span>
            </div>
          </div>
        ) : (
          <div className="border border-paper-200 bg-white p-10 text-center shadow-card">
            <p className="font-quantico text-body-lg font-bold uppercase tracking-wide text-ink">No orders yet</p>
            <p className="mx-auto mt-2 max-w-sm font-pt text-body text-fg-muted">Place your first 10X order and it&rsquo;ll show up here.</p>
            <Link href="/products/10x-daytime" className="mt-6 inline-flex cursor-pointer items-center bg-accent px-7 py-3 font-quantico text-body-sm font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-accent-hover">
              Shop 10X Daytime
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
