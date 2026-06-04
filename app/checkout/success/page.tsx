'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

type OrderItem = { name: string; pack: string; qty: number; price: number };
type Order = {
  id: string;
  date: string;
  items: OrderItem[];
  totals: { subtotal: number; shipping: number; gst: number; grandTotal: number };
  address: { name: string; line1: string; line2?: string; city: string; state?: string; pincode: string };
  payment: string;
};

function fmt(n: number) {
  return `₹${Math.floor(n).toLocaleString('en-IN')}`;
}

const PAYMENT_LABELS: Record<string, string> = {
  cod: 'Cash on Delivery',
  upi: 'UPI',
  card: 'Card',
};

function SuccessInner() {
  const params = useSearchParams();
  const id = params.get('id');
  const [order, setOrder] = useState<Order | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const key = id ? `10x:order:${id}` : null;
      const raw = key ? window.localStorage.getItem(key) : null;
      if (raw) setOrder(JSON.parse(raw) as Order);
    } catch {
      // ignore
    }
    setLoaded(true);
  }, [id]);

  return (
    <main id="main" className="bg-paper-100 pt-16 md:pt-20">
      <div className="mx-auto max-w-2xl px-6 py-16 sm:px-10 md:py-24">
        {/* Confirmation header */}
        <div className="text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent text-ink">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12.5 10 17.5 19 7" />
            </svg>
          </span>
          <p className="mt-6 font-quantico text-caption font-bold uppercase tracking-[0.2em] text-brand-blue">
            Order Confirmed
          </p>
          <h1 className="mt-3 font-condensed text-[clamp(2rem,5vw,3.25rem)] font-black uppercase italic leading-[0.95] tracking-tight text-fg">
            You&rsquo;re All Set
          </h1>
          <p className="mx-auto mt-4 max-w-md font-pt text-body-lg text-fg-muted">
            Thanks for fuelling your mind with 10X. Your order is being prepared and
            will reach you soon.
          </p>
          {(order?.id || id) && (
            <p className="mt-4 inline-block bg-white px-4 py-2 font-quantico text-body-sm font-bold uppercase tracking-wider text-fg shadow-card">
              Order #{order?.id ?? id}
            </p>
          )}
        </div>

        {/* Order details */}
        {loaded && order && (
          <div className="mt-10 border border-paper-200 bg-white p-6 shadow-card md:p-8">
            <ul className="space-y-4 border-b border-paper-200 pb-5">
              {order.items.map((item, i) => (
                <li key={i} className="flex items-start justify-between gap-3 font-pt text-body-sm">
                  <span className="text-fg">
                    {item.name} <span className="text-fg-muted">· {item.pack} · Qty {item.qty}</span>
                  </span>
                  <span className="whitespace-nowrap font-quantico font-bold text-fg">{fmt(item.price * item.qty)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-5 space-y-2 font-pt text-body-sm">
              <div className="flex justify-between"><dt className="text-fg-muted">Subtotal</dt><dd className="font-quantico font-bold text-fg">{fmt(order.totals.subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-fg-muted">Shipping</dt><dd className="font-quantico font-bold text-fg">{order.totals.shipping === 0 ? 'FREE' : fmt(order.totals.shipping)}</dd></div>
              <div className="flex justify-between"><dt className="text-fg-muted">GST (18%)</dt><dd className="font-quantico font-bold text-fg">{fmt(order.totals.gst)}</dd></div>
            </dl>
            <div className="mt-4 flex items-baseline justify-between border-t border-paper-200 pt-4">
              <span className="font-quantico text-caption font-bold uppercase tracking-wider text-fg-muted">Total Paid</span>
              <span className="font-quantico text-[1.375rem] font-bold text-fg">{fmt(order.totals.grandTotal)}</span>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 border-t border-paper-200 pt-6 sm:grid-cols-2">
              <div>
                <p className="font-quantico text-caption font-bold uppercase tracking-wider text-fg-muted">Delivering to</p>
                <p className="mt-1.5 font-pt text-body-sm text-fg">{order.address.name}</p>
                <p className="font-pt text-body-sm text-fg-muted">
                  {order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ''}
                </p>
                <p className="font-pt text-body-sm text-fg-muted">
                  {order.address.city}{order.address.state ? `, ${order.address.state}` : ''} — {order.address.pincode}
                </p>
              </div>
              <div>
                <p className="font-quantico text-caption font-bold uppercase tracking-wider text-fg-muted">Payment</p>
                <p className="mt-1.5 font-pt text-body-sm text-fg">{PAYMENT_LABELS[order.payment] ?? order.payment}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/"
            className="inline-flex cursor-pointer items-center gap-2 bg-accent px-9 py-4 font-quantico text-body-sm font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-accent-hover"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<main className="min-h-[60vh] pt-20" />}>
      <SuccessInner />
    </Suspense>
  );
}
