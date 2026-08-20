'use client';

import Link from 'next/link';

import { IconArrow } from '@/components/ui/Field';
import { inr } from '@/lib/store/types';

import { useAccountData } from './AccountDataContext';
import { useAuth } from './AuthContext';
import OrderStatusPill from './OrderStatusPill';

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Account dashboard.
 *
 * The numbers first — spend, orders, packs — then the two things a customer
 * actually came to check: where their latest order is, and when the next
 * subscription box ships.
 */
export default function AccountDashboard() {
  const { customer } = useAuth();
  const { orders, subscriptions, summary, loading, error } = useAccountData();

  if (loading) {
    return <div className="h-72 w-full animate-pulse bg-paper-200" />;
  }

  const latest = orders[0] ?? null;
  const activeSub = subscriptions.find((s) => s.status === 'active') ?? null;

  /* --------------------------------------------------- nothing yet */
  if (error) {
    return (
      <div>
        <p role="alert" className="border-2 border-danger/40 bg-danger/[0.06] px-4 py-3.5 font-pt text-body-sm font-bold text-danger">
          {error}
        </p>
        <p className="mt-3 font-pt text-body-sm text-fg-muted">
          Your orders are safe — we just can’t read them this second. Refresh in a moment.
        </p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div>
        <StatRow
          spend={summary.totalSpend}
          orderCount={summary.orderCount}
          packs={summary.packsOrdered}
          activeSubs={summary.activeSubs}
        />

        <div className="mt-8 border-2 border-dashed border-paper-300 px-6 py-14 text-center">
          <h2 className="font-condensed text-2xl font-black uppercase italic tracking-tight text-fg">
            No Orders Yet
          </h2>
          <p className="mx-auto mt-3 max-w-sm font-pt text-body text-fg-muted">
            When you place your first order it&rsquo;ll appear here, with live
            tracking from dispatch to your door.
          </p>
          <Link
            href="/products/10x-daytime"
            className="mt-7 inline-flex cursor-pointer items-center gap-2 bg-accent px-7 py-3.5 font-quantico text-body-sm font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-accent-hover"
          >
            Shop 10X Daytime
            {IconArrow}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <StatRow
        spend={summary.totalSpend}
        orderCount={summary.orderCount}
        packs={summary.packsOrdered}
        activeSubs={summary.activeSubs}
      />

      {/* Quick actions — the four reasons people open this page. */}
      <nav aria-label="Quick actions" className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {[
          { href: latest ? `/account/orders/${latest.id}` : '/account/orders', label: 'Track order', d: 'M1 3h15v13H1zM16 8h4l3 3v5h-7V8ZM5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm13 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z' },
          { href: '/account/subscriptions', label: 'Subscription', d: 'M21 12a9 9 0 1 1-3-6.7M21 3v6h-6' },
          { href: '/account/addresses', label: 'Addresses', d: 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z' },
          { href: '/queries', label: 'Get help', d: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6A8.38 8.38 0 0 1 12.5 3h.5a8.48 8.48 0 0 1 8 8v.5z' },
        ].map((a) => (
          <Link
            key={a.label}
            href={a.href}
            className="group flex items-center gap-2.5 border border-paper-200 px-3.5 py-3 transition-colors hover:border-accent"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-accent/15 text-accent-pressed transition-colors group-hover:bg-accent group-hover:text-ink dark:text-accent dark:group-hover:text-ink">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d={a.d} />
              </svg>
            </span>
            <span className="font-quantico text-[11px] font-bold uppercase tracking-[0.08em] text-fg">
              {a.label}
            </span>
          </Link>
        ))}
      </nav>

      {/* Latest order */}
      {latest && (
        <section aria-labelledby="dash-latest">
          <div className="mb-4 flex items-end justify-between gap-4">
            <h2
              id="dash-latest"
              className="font-condensed text-xl font-black uppercase italic tracking-tight text-fg"
            >
              Latest Order
            </h2>
            <Link
              href="/account/orders"
              className="shrink-0 font-quantico text-caption font-bold uppercase tracking-[0.12em] text-fg-muted underline decoration-paper-300 underline-offset-4 transition-colors hover:text-fg"
            >
              View all
            </Link>
          </div>

          <Link
            href={`/account/orders/${latest.id}`}
            className="block border-2 border-paper-200 p-5 transition-colors hover:border-accent"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-quantico text-body-sm font-bold uppercase tracking-wide text-fg">
                  {latest.reference}
                </p>
                <p className="mt-1 font-pt text-caption text-fg-muted">
                  Placed {shortDate(latest.placedAt)}
                </p>
              </div>
              <OrderStatusPill status={latest.status} />
            </div>

            <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-paper-200 pt-4">
              <p className="font-pt text-body-sm text-fg-muted">
                {latest.items[0]?.name}
                {latest.items[0] && latest.items[0].quantity > 1
                  ? ` · ${latest.items[0].quantity} packs`
                  : ''}
              </p>
              <p className="font-condensed text-xl font-black tracking-tight text-fg">
                {inr(latest.total)}
              </p>
            </div>

            {latest.trackingNumber && (
              <p className="mt-3 font-pt text-caption text-fg-subtle">
                {latest.courier} · {latest.trackingNumber}
                {latest.courierStatus ? (
                  <span className="text-fg-muted"> · {latest.courierStatus}</span>
                ) : null}
              </p>
            )}
          </Link>
        </section>
      )}

      {/* Subscription */}
      <section aria-labelledby="dash-sub">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2
            id="dash-sub"
            className="font-condensed text-xl font-black uppercase italic tracking-tight text-fg"
          >
            Subscription
          </h2>
          {activeSub && (
            <Link
              href="/account/subscriptions"
              className="shrink-0 font-quantico text-caption font-bold uppercase tracking-[0.12em] text-fg-muted underline decoration-paper-300 underline-offset-4 transition-colors hover:text-fg"
            >
              Manage
            </Link>
          )}
        </div>

        {activeSub ? (
          <div className="border-l-2 border-accent bg-paper-50 p-5 dark:bg-paper-200">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-quantico text-body-sm font-bold uppercase tracking-wide text-fg">
                  {activeSub.productName}
                </p>
                <p className="mt-1 font-pt text-caption text-fg-muted">
                  {activeSub.cadence} · {inr(activeSub.price)} per cycle
                </p>
              </div>
              <span className="bg-accent px-3 py-1 font-quantico text-[10px] font-bold uppercase tracking-[0.12em] text-ink">
                Active
              </span>
            </div>
            {activeSub.nextDelivery && (
              <p className="mt-4 border-t border-paper-200 pt-4 font-pt text-body-sm text-fg-muted dark:border-paper-300">
                Next box ships{' '}
                <span className="font-bold text-fg">
                  {shortDate(activeSub.nextDelivery)}
                </span>
              </p>
            )}
          </div>
        ) : (
          <div className="border-2 border-dashed border-paper-300 px-5 py-8 text-center">
            <p className="font-pt text-body text-fg-muted">
              No active subscription. Subscribe and pay less on every pack.
            </p>
            <Link
              href="/products/10x-daytime"
              className="mt-5 inline-flex cursor-pointer items-center gap-2 border-2 border-paper-200 px-6 py-3 font-quantico text-caption font-bold uppercase tracking-[0.14em] text-fg transition-colors hover:border-accent"
            >
              Start a subscription
              {IconArrow}
            </Link>
          </div>
        )}
      </section>

      {/* Account meta */}
      <section className="mt-2">
        <dl className="grid grid-cols-1 gap-4 font-pt text-body-sm sm:grid-cols-2">
          <div>
            <dt className="font-quantico text-[10px] font-bold uppercase tracking-[0.16em] text-fg-subtle">
              Email
            </dt>
            <dd className="mt-1.5 break-all text-fg">{customer?.email}</dd>
          </div>
          <div>
            <dt className="font-quantico text-[10px] font-bold uppercase tracking-[0.16em] text-fg-subtle">
              Member since
            </dt>
            <dd className="mt-1.5 text-fg">
              {customer ? shortDate(customer.joinedAt) : '—'}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}

/** The four headline numbers. */
function StatRow({
  spend,
  orderCount,
  packs,
  activeSubs,
}: {
  spend: number;
  orderCount: number;
  packs: number;
  activeSubs: number;
}) {
  const stats = [
    { label: 'Total spend', value: inr(spend) },
    { label: 'Orders', value: String(orderCount) },
    { label: 'Packs ordered', value: String(packs) },
    { label: 'Active plans', value: String(activeSubs) },
  ];

  return (
    <dl className="grid grid-cols-2 gap-px border-2 border-paper-200 bg-paper-200 sm:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-paper p-4 sm:p-5">
          <dt className="font-quantico text-[10px] font-bold uppercase tracking-[0.14em] text-fg-subtle">
            {s.label}
          </dt>
          <dd className="mt-1.5 font-condensed text-xl font-black tracking-tight text-fg sm:mt-2 sm:text-[1.75rem]">
            {s.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
