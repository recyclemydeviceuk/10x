'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { useAccountData } from '@/components/account/AccountDataContext';
import { api } from '@/lib/api/storefront';
import { IconArrow } from '@/components/ui/Field';
import { inr } from '@/lib/store/types';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Order confirmation.
 *
 * Reads the reference from the query string and looks the order up in account
 * data, so a refresh or a shared link still renders the real thing rather than
 * state held over from the checkout page.
 *
 * It is also where a redirected payment lands (UPI intent, for instance,
 * leaves the modal and comes back here).
 *
 * For an online checkout THE ORDER DOES NOT EXIST YET when this page opens.
 * It is created by whichever gets there first — Cashfree's webhook or the
 * confirm call below — so the page asks, and keeps asking for a short while
 * if the bank is still settling. It never claims an order it can't see.
 */

/** How long to keep asking before telling the customer we'll email them. */
const CONFIRM_ATTEMPTS = 8;
const CONFIRM_INTERVAL_MS = 2500;

export default function OrderSuccess() {
  const params = useSearchParams();
  const reference = params.get('ref') ?? '';
  const { orders, loading, refresh } = useAccountData();
  const started = useRef('');
  const [settling, setSettling] = useState(false);
  const [failed, setFailed] = useState<string | null>(null);

  const order = orders.find((o) => o.reference === reference) ?? null;

  useEffect(() => {
    if (!reference || started.current === reference) return;
    // A paid order that's already on the account needs no confirming.
    if (order && order.paymentStatus !== 'pending') return;
    started.current = reference;

    let alive = true;
    let attempts = 0;

    const ask = async () => {
      if (!alive) return;
      attempts += 1;

      const result = await api<{ state?: string; message?: string }>(
        `/api/v1/me/orders/${encodeURIComponent(reference)}/confirm-payment`,
        { method: 'POST' },
      );
      if (!alive) return;

      if (result.ok) {
        setSettling(false);
        await refresh();
        return;
      }

      // 202 — the gateway hasn't settled. Keep asking for a little while.
      if (result.status === 202) {
        const body = result as unknown as { data?: { state?: string; message?: string } };
        const state = body.data?.state;
        if (state === 'failed') {
          setSettling(false);
          setFailed(body.data?.message ?? 'That payment didn’t go through, so no order was created.');
          return;
        }
        if (attempts < CONFIRM_ATTEMPTS) {
          setSettling(true);
          window.setTimeout(ask, CONFIRM_INTERVAL_MS);
          return;
        }
        setSettling(true);
        return;
      }

      setSettling(false);
    };

    void ask();
    return () => {
      alive = false;
    };
  }, [order, reference, refresh]);

  if (loading) {
    return (
      <main id="main" className="min-h-[70vh] bg-paper">
        <div className="mx-auto max-w-2xl px-6 pt-32">
          <div className="h-40 w-full animate-pulse bg-paper-200" />
        </div>
      </main>
    );
  }

  // The payment did not go through — no order was created, and nothing was
  // charged. Say exactly that rather than showing a confirmation screen.
  if (failed) {
    return (
      <main id="main" className="bg-paper">
        <div className="mx-auto max-w-2xl px-6 pb-24 pt-28 text-center sm:px-10 md:pt-36">
          <span className="mx-auto flex h-20 w-20 items-center justify-center border-2 border-paper-300 text-fg-muted">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </span>
          <h1 className="mt-7 font-condensed text-[clamp(2rem,6vw,3rem)] font-black uppercase italic leading-[0.9] tracking-tight text-fg">
            Payment not completed
          </h1>
          <p className="mx-auto mt-5 max-w-md font-pt text-body-lg text-fg-muted">{failed}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/cart" className="flex cursor-pointer items-center justify-center gap-2 bg-accent px-7 py-4 font-quantico text-body-sm font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-accent-hover">
              Back to cart
              {IconArrow}
            </Link>
            <Link href="/queries" className="flex cursor-pointer items-center justify-center border-2 border-paper-200 px-7 py-4 font-quantico text-body-sm font-bold uppercase tracking-[0.14em] text-fg transition-colors hover:border-fg">
              Get help
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Money is in flight but the bank hasn't settled. No order exists yet, so
  // there is nothing to show — keep the customer informed instead.
  if (!order && settling) {
    return (
      <main id="main" className="bg-paper">
        <div className="mx-auto max-w-2xl px-6 pb-24 pt-28 text-center sm:px-10 md:pt-36">
          <span className="mx-auto flex h-14 w-14 animate-spin items-center justify-center rounded-full border-4 border-paper-200 border-t-accent" />
          <h1 className="mt-7 font-condensed text-[clamp(2rem,6vw,3rem)] font-black uppercase italic leading-[0.9] tracking-tight text-fg">
            Confirming your payment
          </h1>
          <p className="mx-auto mt-5 max-w-md font-pt text-body-lg text-fg-muted">
            Your bank is still settling this one. Keep this page open — it updates on its own, and
            we’ll email you the moment it clears. Reference{' '}
            <span className="font-bold text-fg">{reference}</span>.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main id="main" className="bg-paper">
      <div className="mx-auto max-w-2xl px-6 pb-24 pt-28 sm:px-10 md:pt-36">
        {/* Confirmation mark */}
        <div className="text-center">
          <span className="mx-auto flex h-20 w-20 items-center justify-center bg-accent text-ink shadow-glow">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12.5 10 17.5 19 7" />
            </svg>
          </span>
          <h1 className="mt-7 font-condensed text-[clamp(2.25rem,7vw,3.5rem)] font-black uppercase italic leading-[0.9] tracking-tight text-fg">
            Order
            <br />
            Confirmed
          </h1>
          <p className="mx-auto mt-5 max-w-md font-pt text-body-lg text-fg-muted">
            {order?.paymentMethod === 'cod'
              ? 'Your order is placed. Keep the cash ready — you’ll pay the courier on delivery.'
              : order?.paymentStatus === 'pending'
                ? 'Your order is saved. We’re still confirming the payment with the bank — this page updates on its own, and we’ll email you either way.'
                : 'Payment received. Your order is registered for express dispatch.'}
          </p>
        </div>

        {/* Reference */}
        <div className="mt-9 border-2 border-paper-200 p-6 text-center">
          <p className="font-quantico text-[10px] font-bold uppercase tracking-[0.18em] text-fg-subtle">
            Order Reference
          </p>
          <p className="mt-2 font-quantico text-2xl font-bold tracking-[0.08em] text-fg">
            {reference || '—'}
          </p>
          <p className="mt-3 font-pt text-caption text-fg-muted">
            We&rsquo;ve emailed this to you. Quote it in any message to support.
          </p>
        </div>

        {order && (
          <>
            {/* Details */}
            <dl className="mt-5 divide-y divide-paper-200 border-2 border-paper-200 px-6 font-pt text-body-sm">
              <div className="flex items-center justify-between py-4">
                <dt className="text-fg-muted">Status</dt>
                <dd className="bg-accent/20 px-3 py-1 font-quantico text-[10px] font-bold uppercase tracking-wide text-accent-pressed dark:text-accent">
                  {order.paymentMethod === 'online' && order.paymentStatus === 'pending'
                    ? 'Confirming payment'
                    : 'Preparing for dispatch'}
                </dd>
              </div>
              {order.estimatedDelivery && (
                <div className="flex items-center justify-between py-4">
                  <dt className="text-fg-muted">Estimated delivery</dt>
                  <dd className="font-quantico font-bold text-fg">
                    {formatDate(order.estimatedDelivery)}
                  </dd>
                </div>
              )}
              <div className="flex items-center justify-between py-4">
                <dt className="text-fg-muted">Payment</dt>
                <dd className="font-quantico font-bold text-fg">
                  {order.paymentMethod === 'cod'
                    ? 'Cash on delivery'
                    : order.paymentStatus === 'paid'
                      ? 'Paid online'
                      : 'Online — awaiting confirmation'}
                </dd>
              </div>
              <div className="flex items-center justify-between py-4">
                <dt className="text-fg-muted">
                  {order.subscriptionId ? 'Charged per cycle' : 'Total'}
                </dt>
                <dd className="font-condensed text-xl font-black tracking-tight text-fg">
                  {inr(order.total)}
                </dd>
              </div>
            </dl>

            {/* Delivering to */}
            <div className="mt-5 border-2 border-paper-200 p-6">
              <p className="font-quantico text-[10px] font-bold uppercase tracking-[0.18em] text-fg-subtle">
                Delivering To
              </p>
              <p className="mt-2.5 font-pt text-body-sm font-bold text-fg">
                {order.address.fullName}
              </p>
              <p className="mt-1 font-pt text-body-sm leading-relaxed text-fg-muted">
                {order.address.house}, {order.address.street}
                {order.address.landmark ? `, ${order.address.landmark}` : ''}
                <br />
                {order.address.city}, {order.address.state} {order.address.pincode}
              </p>
            </div>
          </>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href={order ? `/account/orders/${order.id}` : '/account/orders'}
            className="flex flex-1 cursor-pointer items-center justify-center gap-2 bg-accent px-6 py-4 font-quantico text-body-sm font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-accent-hover"
          >
            Track This Order
            {IconArrow}
          </Link>
          <Link
            href="/account"
            className="flex flex-1 cursor-pointer items-center justify-center border-2 border-paper-200 px-6 py-4 font-quantico text-body-sm font-bold uppercase tracking-[0.14em] text-fg transition-colors hover:border-fg"
          >
            Go to My Account
          </Link>
        </div>
      </div>
    </main>
  );
}
