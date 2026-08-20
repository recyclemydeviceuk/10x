'use client';

import Link from 'next/link';
import { useState } from 'react';

import { API_URL } from '@/lib/api/storefront';
import { inr, STAGE_LABEL } from '@/lib/store/types';

import { useAccountData } from './AccountDataContext';
import OrderHelpChat from './OrderHelpChat';
import OrderStatusPill from './OrderStatusPill';
import ReturnRequestSection from './ReturnRequestSection';

function longDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function timeOf(iso: string) {
  return new Date(iso).toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * A single order, with its tracking timeline.
 *
 * This replaces the old public /track page. Tracking now lives behind the
 * account, so an order is only ever visible to the person who placed it —
 * references alone are sequential and guessable.
 */
export default function OrderDetail({ orderId }: { orderId: string }) {
  const { orders, loading, cancelOrder } = useAccountData();
  const [cancelError, setCancelError] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  if (loading) {
    return <div className="h-96 w-full animate-pulse bg-paper-200" />;
  }

  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="border-2 border-dashed border-paper-300 px-6 py-14 text-center">
        <h2 className="font-condensed text-xl font-black uppercase italic tracking-tight text-fg">
          Order Not Found
        </h2>
        <p className="mx-auto mt-3 max-w-sm font-pt text-body text-fg-muted">
          We couldn&rsquo;t find that order on your account.
        </p>
        <Link
          href="/account/orders"
          className="mt-7 inline-flex cursor-pointer items-center gap-2 border-2 border-paper-200 px-6 py-3 font-quantico text-caption font-bold uppercase tracking-[0.14em] text-fg transition-colors hover:border-accent"
        >
          Back to orders
        </Link>
      </div>
    );
  }

  function copyTracking() {
    if (!order?.trackingNumber) return;
    navigator.clipboard?.writeText(order.trackingNumber).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      },
      () => {},
    );
  }

  const cancellable = order.status === 'placed' || order.status === 'confirmed';

  return (
    <div>
      {/* Back */}
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-2 font-quantico text-caption font-bold uppercase tracking-[0.12em] text-fg-muted transition-colors hover:text-fg"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polyline points="15 18 9 12 15 6" />
        </svg>
        All orders
      </Link>

      {/* Heading */}
      <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-condensed text-2xl font-black uppercase italic tracking-tight text-fg">
            {order.reference}
          </h2>
          <p className="mt-1.5 font-pt text-body-sm text-fg-muted">
            Placed {longDate(order.placedAt)}
          </p>
        </div>
        <OrderStatusPill status={order.status} />
      </div>

      {/* Courier */}
      {order.trackingNumber && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-2 border-paper-200 p-5">
          <div className="min-w-0">
            <p className="font-quantico text-[10px] font-bold uppercase tracking-[0.16em] text-fg-subtle">
              {order.courier}
            </p>
            <p className="mt-1.5 font-quantico text-body font-bold tracking-[0.06em] text-fg">
              {order.trackingNumber}
            </p>
            {order.courierStatus ? (
              <p className="mt-1 font-pt text-caption text-fg-muted">
                Courier update: <span className="font-bold text-fg">{order.courierStatus}</span>
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={copyTracking}
            className="inline-flex shrink-0 cursor-pointer items-center gap-2 border-2 border-paper-200 px-4 py-2.5 font-quantico text-caption font-bold uppercase tracking-[0.12em] text-fg transition-colors hover:border-accent"
          >
            {copied ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12.5 10 17.5 19 7" />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      )}

      {/* ========================= TRACKING TIMELINE ========================= */}
      <section aria-labelledby="od-track" className="mt-8">
        <h3
          id="od-track"
          className="font-quantico text-body-sm font-bold uppercase tracking-[0.14em] text-fg"
        >
          Tracking
        </h3>

        {order.estimatedDelivery && order.status !== 'delivered' && (
          <p className="mt-3 border-l-2 border-accent bg-paper-50 px-4 py-3 font-pt text-body-sm text-fg-muted dark:bg-paper-200">
            Estimated delivery{' '}
            <span className="font-bold text-fg">{longDate(order.estimatedDelivery)}</span>
          </p>
        )}

        <ol className="mt-6">
          {order.timeline.map((event, i) => {
            const done = event.at !== null;
            // The most recent completed stage is the one to highlight.
            const isCurrent =
              done && (i === order.timeline.length - 1 || order.timeline[i + 1]?.at === null);
            const isLast = i === order.timeline.length - 1;

            return (
              <li key={event.stage} className="relative flex gap-4 pb-7 last:pb-0">
                {/* Rail */}
                {!isLast && (
                  <span
                    aria-hidden
                    className={`absolute left-[11px] top-6 h-full w-0.5 ${
                      done ? 'bg-accent' : 'bg-paper-200'
                    }`}
                  />
                )}

                {/* Node */}
                <span
                  aria-hidden
                  className={`relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                    done
                      ? 'border-accent bg-accent text-ink'
                      : 'border-paper-300 bg-paper text-transparent'
                  }`}
                >
                  {done && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12.5 10 17.5 19 7" />
                    </svg>
                  )}
                </span>

                <div className="min-w-0 flex-1 pt-0.5">
                  <p
                    className={`font-quantico text-body-sm font-bold uppercase tracking-wide ${
                      done ? 'text-fg' : 'text-fg-subtle'
                    }`}
                  >
                    {STAGE_LABEL[event.stage]}
                    {isCurrent && (
                      <span className="ml-2.5 bg-accent px-2 py-0.5 font-quantico text-[9px] tracking-[0.1em] text-ink">
                        Now
                      </span>
                    )}
                  </p>
                  <p className="mt-1 font-pt text-caption text-fg-muted">
                    {event.at ? `${longDate(event.at)} · ${timeOf(event.at)}` : 'Pending'}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* ============================== ITEMS ============================== */}
      <section aria-labelledby="od-items" className="mt-10">
        <h3
          id="od-items"
          className="font-quantico text-body-sm font-bold uppercase tracking-[0.14em] text-fg"
        >
          Items
        </h3>
        <ul className="mt-4 space-y-3">
          {order.items.map((item) => (
            <li key={item.sku} className="flex justify-between gap-4 font-pt text-body-sm">
              <span className="min-w-0">
                <span className="block text-fg">{item.name}</span>
                <span className="mt-0.5 block text-caption text-fg-subtle">
                  {item.packets} · {inr(item.price)} each × {item.quantity}
                </span>
              </span>
              <span className="shrink-0 font-quantico font-bold text-fg">
                {inr(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <dl className="mt-5 space-y-3 border-t border-paper-200 pt-5 font-pt text-body-sm">
          <div className="flex justify-between">
            <dt className="text-fg-muted">Subtotal</dt>
            <dd className="font-quantico font-bold text-fg">{inr(order.subtotal)}</dd>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between">
              <dt className="text-fg-muted">
                Coupon
                {order.couponCode && (
                  <span className="font-bold text-fg"> {order.couponCode}</span>
                )}
              </dt>
              <dd className="font-quantico font-bold text-accent-pressed dark:text-accent">
                −{inr(order.discount)}
              </dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-fg-muted">Delivery</dt>
            <dd
              className={`font-quantico font-bold uppercase tracking-wide ${
                order.shipping === 0 ? 'text-accent-pressed dark:text-accent' : 'text-fg'
              }`}
            >
              {order.shipping === 0 ? 'Free Express' : inr(order.shipping)}
            </dd>
          </div>
          <div className="flex items-baseline justify-between border-t border-paper-200 pt-3">
            <dt className="font-quantico text-caption font-bold uppercase tracking-[0.12em] text-fg-muted">
              Total
            </dt>
            <dd className="font-condensed text-2xl font-black tracking-tight text-fg">
              {inr(order.total)}
            </dd>
          </div>
        </dl>

        <p className="mt-3 font-pt text-caption text-fg-subtle">
          {order.paymentMethod === 'cod' ? 'Cash on delivery' : 'Paid online'}
          {order.paymentStatus === 'pending' && ' · payment pending'}
          {order.paymentStatus === 'refunded' && ' · refunded'}
        </p>
      </section>

      {/* ============================= ADDRESS ============================= */}
      <section aria-labelledby="od-address" className="mt-10">
        <h3
          id="od-address"
          className="font-quantico text-body-sm font-bold uppercase tracking-[0.14em] text-fg"
        >
          Delivery Address
        </h3>
        <p className="mt-4 font-pt text-body-sm font-bold text-fg">
          {order.address.fullName}
        </p>
        <p className="mt-1 font-pt text-body-sm leading-relaxed text-fg-muted">
          {order.address.house}, {order.address.street}
          {order.address.landmark ? `, ${order.address.landmark}` : ''}
          <br />
          {order.address.city}, {order.address.state} {order.address.pincode}
        </p>
        <p className="mt-1.5 font-pt text-caption text-fg-subtle">{order.address.phone}</p>
      </section>

      {/* ======================= RETURN & REFUND ========================== */}
      {order.status === 'delivered' && (
        <ReturnRequestSection
          orderReference={order.reference}
          orderTotal={order.total}
          paymentMethod={order.paymentMethod}
        />
      )}

      {/* ============================= ACTIONS ============================= */}
      <div className="mt-10 flex flex-wrap gap-3">
        <OrderHelpChat order={order} />
        {(order.paymentStatus === 'paid' || order.paymentStatus === 'refunded') && (
          // Top-level navigation to the API sends the session cookie, so the
          // invoice opens without any token juggling.
          <a
            href={`${API_URL}/api/v1/me/orders/${encodeURIComponent(order.reference)}/invoice`}
            target="_blank"
            rel="noreferrer"
            className="cursor-pointer border-2 border-paper-200 px-6 py-3.5 font-quantico text-caption font-bold uppercase tracking-[0.14em] text-fg transition-colors hover:border-accent"
          >
            Invoice
          </a>
        )}
        {cancellable && !confirmCancel && (
          <button
            type="button"
            onClick={() => setConfirmCancel(true)}
            className="cursor-pointer border-2 border-paper-200 px-6 py-3.5 font-quantico text-caption font-bold uppercase tracking-[0.14em] text-fg-muted transition-colors hover:border-danger hover:text-danger"
          >
            Cancel order
          </button>
        )}
      </div>

      {/* Cancelling is irreversible, so it takes a second, deliberate tap. */}
      {confirmCancel && (
        <div className="mt-4 border-2 border-danger/40 bg-danger/[0.06] p-5">
          <p className="font-quantico text-body-sm font-bold uppercase tracking-wide text-fg">
            Cancel this order?
          </p>
          <p className="mt-2 font-pt text-body-sm text-fg-muted">
            {order.paymentMethod === 'online' && order.paymentStatus === 'paid'
              ? `We'll return ${inr(order.total)} to your original payment method — refunds are processed within 5–7 working days.`
              : 'Nothing has been charged, so there is nothing to refund.'}{' '}
            This can&rsquo;t be undone.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={cancelling}
              onClick={async () => {
                setCancelError('');
                setCancelling(true);
                const result = await cancelOrder(order.id);
                setCancelling(false);
                if (!result.ok) return setCancelError(result.message ?? 'We couldn’t cancel that order.');
                setConfirmCancel(false);
              }}
              className="cursor-pointer bg-danger px-5 py-3 font-quantico text-caption font-bold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {cancelling ? 'Cancelling…' : 'Yes, cancel it'}
            </button>
            <button
              type="button"
              onClick={() => setConfirmCancel(false)}
              className="cursor-pointer border-2 border-paper-200 px-5 py-3 font-quantico text-caption font-bold uppercase tracking-[0.12em] text-fg transition-colors hover:border-fg"
            >
              Keep order
            </button>
          </div>
          {cancelError && (
            <p role="alert" className="mt-3 font-pt text-body-sm font-bold text-danger">
              {cancelError}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
