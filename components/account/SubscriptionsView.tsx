'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { IconArrow } from '@/components/ui/Field';
import { inr, type Subscription } from '@/lib/store/types';

import { useAccountData } from './AccountDataContext';

function longDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const STATUS_STYLE: Record<Subscription['status'], string> = {
  active: 'bg-accent text-ink',
  paused: 'bg-paper-200 text-fg-muted dark:bg-paper-300',
  cancelled: 'bg-paper-200 text-fg-muted dark:bg-paper-300',
};

/**
 * Subscription management.
 *
 * An active plan can be paused (nothing ships, the plan survives) or
 * cancelled; a paused or cancelled one can be started again, with the next box
 * on the way rather than a full cycle later.
 */
export default function SubscriptionsView() {
  const {
    subscriptions,
    loading,
    cancelSubscription,
    pauseSubscription,
    restartSubscription,
    enableAutopay,
    refreshAutopay,
    declineAutopay,
  } = useAccountData();
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Deep links:
  //   ?autopay=<ref>          back from the bank's authorisation page — re-check the mandate
  //   ?autopay-setup=<ref>    the reminder email's "Set up auto-pay" button — open the mandate window
  //   ?autopay-decline=<ref>  the reminder email's "pay on delivery" link — stop the reminders
  // Each is consumed once and scrubbed from the URL so a refresh doesn't repeat it.
  useEffect(() => {
    if (loading) return;
    const params = new URLSearchParams(window.location.search);
    const refresh = params.get('autopay');
    const setup = params.get('autopay-setup');
    const decline = params.get('autopay-decline');
    if (!refresh && !setup && !decline) return;
    params.delete('autopay');
    params.delete('autopay-setup');
    params.delete('autopay-decline');
    const query = params.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${query ? `?${query}` : ''}`);
    if (refresh) void refreshAutopay(refresh);
    else if (decline) void run(decline, () => declineAutopay(decline));
    else if (setup) void run(setup, () => enableAutopay(setup));
    // `run` is stable for the component's life; the deep link should fire once data is in.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, refreshAutopay, declineAutopay, enableAutopay]);

  /** Run a plan action and surface anything the API refuses. */
  async function run(id: string, action: () => Promise<{ ok: boolean; message?: string }>) {
    setError(null);
    setBusy(id);
    const result = await action();
    setBusy(null);
    if (!result.ok) setError(result.message ?? 'That didn’t go through — try again.');
    return result.ok;
  }

  if (loading) {
    return <div className="h-72 w-full animate-pulse bg-paper-200" />;
  }

  return (
    <div>
      <h2 className="font-condensed text-2xl font-black uppercase italic tracking-tight text-fg">
        Subscription
      </h2>

      {error && (
        <p role="alert" className="mt-4 border-2 border-danger/40 bg-danger/[0.06] px-4 py-3 font-pt text-body-sm font-bold text-danger">
          {error}
        </p>
      )}

      {subscriptions.length === 0 ? (
        <div className="mt-7 border-2 border-dashed border-paper-300 px-6 py-14 text-center">
          <h3 className="font-condensed text-xl font-black uppercase italic tracking-tight text-fg">
            No Active Plan
          </h3>
          <p className="mx-auto mt-3 max-w-sm font-pt text-body text-fg-muted">
            Subscribe on the product page — cancel here any time.
          </p>
          <Link
            href="/products/10x-daytime"
            className="mt-7 inline-flex cursor-pointer items-center gap-2 bg-accent px-7 py-3.5 font-quantico text-body-sm font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-accent-hover"
          >
            Start a subscription
            {IconArrow}
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-5">
          {subscriptions.map((sub) => {
            const active = sub.status === 'active';

            return (
              <li key={sub.id} className="border-2 border-paper-200 p-6">
                {/* Head */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-quantico text-body font-bold uppercase tracking-wide text-fg">
                      {sub.productName}
                    </p>
                    <p className="mt-1 font-pt text-body-sm text-fg-muted">
                      {sub.packets} · {sub.cadence}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 px-3 py-1 font-quantico text-[10px] font-bold uppercase tracking-[0.12em] ${STATUS_STYLE[sub.status]}`}
                  >
                    {sub.status}
                  </span>
                </div>

                {/* Facts */}
                <dl className="mt-5 grid grid-cols-2 gap-px border-2 border-paper-200 bg-paper-200 sm:grid-cols-4">
                  <Fact label="Per cycle" value={inr(sub.price)} />
                  <Fact label="You save" value={`${inr(sub.savingsPerCycle)} / cycle`} />
                  <Fact label="Delivered" value={`${sub.cyclesDelivered} cycles`} />
                  <Fact
                    label="Next box"
                    value={sub.nextDelivery ? longDate(sub.nextDelivery) : '—'}
                  />
                </dl>

                {/* Shipping to */}
                <div className="mt-5 border-t border-paper-200 pt-5">
                  <p className="font-quantico text-[10px] font-bold uppercase tracking-[0.16em] text-fg-subtle">
                    Shipping To
                  </p>
                  <p className="mt-2 font-pt text-body-sm text-fg-muted">
                    <span className="font-bold text-fg">{sub.address.label}</span> ·{' '}
                    {sub.address.house}, {sub.address.street}, {sub.address.city}{' '}
                    {sub.address.pincode}
                  </p>
                </div>

                {/* Auto-pay — the mandate state comes from Cashfree. */}
                {active && (
                  <div className="mt-5 border-t border-paper-200 pt-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-quantico text-[10px] font-bold uppercase tracking-[0.16em] text-fg-subtle">
                          Auto-Pay
                        </p>
                        <p className="mt-2 font-pt text-body-sm text-fg-muted">
                          {sub.autopayStatus === 'active'
                            ? 'On — each box is charged automatically.'
                            : sub.autopayStatus === 'initialized'
                              ? 'Waiting for your bank to confirm.'
                              : sub.autopayStatus === 'failed'
                                ? 'The last set-up attempt didn’t go through.'
                                : sub.autopayDeclined
                                  ? 'Off — you pay on delivery for each box. Switch any time.'
                                  : 'Approve once (UPI Autopay, card or bank) and skip paying on every delivery. Until then each box is pay-on-delivery.'}
                        </p>
                      </div>
                      {sub.autopayStatus === 'active' ? (
                        <span className="shrink-0 bg-accent px-3 py-1 font-quantico text-[10px] font-bold uppercase tracking-[0.12em] text-ink">
                          On
                        </span>
                      ) : sub.autopayStatus === 'initialized' ? (
                        <button
                          type="button"
                          disabled={busy === sub.id}
                          onClick={() => run(sub.id, () => refreshAutopay(sub.id))}
                          className="shrink-0 cursor-pointer border-2 border-paper-200 px-5 py-2.5 font-quantico text-caption font-bold uppercase tracking-[0.12em] text-fg transition-colors hover:border-accent disabled:opacity-50"
                        >
                          {busy === sub.id ? 'Checking…' : 'Check status'}
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={busy === sub.id}
                          onClick={() => run(sub.id, () => enableAutopay(sub.id))}
                          className="shrink-0 cursor-pointer bg-accent px-5 py-2.5 font-quantico text-caption font-bold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-accent-hover disabled:opacity-50"
                        >
                          {busy === sub.id
                            ? 'Opening…'
                            : sub.autopayStatus === 'failed'
                              ? 'Try again'
                              : 'Enable auto-pay'}
                        </button>
                      )}
                    </div>
                    {sub.autopayStatus !== 'active' && sub.autopayStatus !== 'initialized' && (
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-pt text-caption text-fg-subtle">
                        {sub.autopayDeclined ? (
                          <button
                            type="button"
                            disabled={busy === sub.id}
                            onClick={() => run(sub.id, () => declineAutopay(sub.id, true))}
                            className="cursor-pointer underline underline-offset-2 hover:text-fg disabled:opacity-50"
                          >
                            Remind me about auto-pay again
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={busy === sub.id}
                            onClick={() => run(sub.id, () => declineAutopay(sub.id))}
                            className="cursor-pointer underline underline-offset-2 hover:text-fg disabled:opacity-50"
                          >
                            No thanks — I’ll pay on delivery
                          </button>
                        )}
                        <Link href="/queries" className="underline underline-offset-2 hover:text-fg">
                          Need help? Raise a ticket
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions — they flip with the status. */}
                <div className="mt-6 border-t border-paper-200 pt-5">
                  {active ? (
                    confirmCancel !== sub.id && (
                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          disabled={busy === sub.id}
                          onClick={() => run(sub.id, () => pauseSubscription(sub.id))}
                          className="cursor-pointer border-2 border-paper-200 px-6 py-3.5 font-quantico text-caption font-bold uppercase tracking-[0.12em] text-fg transition-colors hover:border-accent disabled:opacity-50"
                        >
                          {busy === sub.id ? 'Working…' : 'Pause'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmCancel(sub.id)}
                          className="cursor-pointer border-2 border-paper-200 px-6 py-3.5 font-quantico text-caption font-bold uppercase tracking-[0.12em] text-fg-muted transition-colors hover:border-danger hover:text-danger"
                        >
                          Cancel Subscription
                        </button>
                      </div>
                    )
                  ) : (
                    <>
                      <button
                        type="button"
                        disabled={busy === sub.id}
                        onClick={() => run(sub.id, () => restartSubscription(sub.id))}
                        className="cursor-pointer bg-accent px-6 py-3.5 font-quantico text-caption font-bold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-accent-hover disabled:opacity-50"
                      >
                        {busy === sub.id
                          ? 'Working…'
                          : sub.status === 'paused'
                            ? 'Resume Subscription'
                            : 'Restart Subscription'}
                      </button>
                      <p className="mt-3 font-pt text-caption text-fg-subtle">
                        Next box ships within a few days.
                      </p>
                    </>
                  )}

                  {/* Cancelling stops money moving, so it takes a second tap. */}
                  {confirmCancel === sub.id && (
                    <div className="border-2 border-danger/40 bg-danger/[0.06] p-5">
                      <p className="font-quantico text-body-sm font-bold uppercase tracking-wide text-fg">
                        Cancel this subscription?
                      </p>
                      <p className="mt-2 font-pt text-body-sm text-fg-muted">
                        Nothing further ships or is charged. Restart any time.
                      </p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          type="button"
                          disabled={busy === sub.id}
                          onClick={async () => {
                            const ok = await run(sub.id, () => cancelSubscription(sub.id));
                            if (ok) setConfirmCancel(null);
                          }}
                          className="cursor-pointer bg-danger px-5 py-3 font-quantico text-caption font-bold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                        >
                          {busy === sub.id ? 'Cancelling…' : 'Yes, cancel it'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmCancel(null)}
                          className="cursor-pointer border-2 border-paper-200 px-5 py-3 font-quantico text-caption font-bold uppercase tracking-[0.12em] text-fg transition-colors hover:border-fg"
                        >
                          Keep it
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-paper p-4">
      <p className="font-quantico text-[10px] font-bold uppercase tracking-[0.14em] text-fg-subtle">
        {label}
      </p>
      <p className="mt-1.5 font-quantico text-body-sm font-bold text-fg">{value}</p>
    </div>
  );
}
