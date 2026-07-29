'use client';

import { useState, useTransition } from 'react';

import { updateSubscription } from '@/app/admin/actions';
import type { SubscriptionStatus } from '@/lib/admin/types';

/**
 * Skip / pause / resume / cancel. Cancel asks once — it revokes the customer's
 * Razorpay mandate, which can't be undone from here.
 */
export default function SubscriptionActions({
  subscriptionId,
  status,
}: {
  subscriptionId: string;
  status: SubscriptionStatus;
}) {
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function run(action: 'skip' | 'pause' | 'resume' | 'cancel') {
    startTransition(async () => {
      await updateSubscription(subscriptionId, action);
      setConfirming(false);
      setDone(action);
    });
  }

  if (status === 'cancelled') {
    return <span className="type-b2 text-fg-subtle">—</span>;
  }

  if (done) {
    return (
      <span className="type-b2 capitalize text-[#4EA310]" role="status">
        {done === 'skip' ? 'Cycle skipped' : `${done}d`}
      </span>
    );
  }

  const action =
    'cursor-pointer font-quantico text-[10px] font-bold uppercase tracking-[0.12em] transition-colors disabled:opacity-40';

  if (confirming) {
    return (
      <span className="flex items-center justify-end gap-3">
        <span className="type-b2 whitespace-nowrap text-fg-muted">Cancel it?</span>
        <button
          type="button"
          onClick={() => run('cancel')}
          disabled={pending}
          className={`${action} text-danger hover:opacity-70`}
        >
          {pending ? 'Cancelling…' : 'Yes'}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className={`${action} text-fg-muted hover:text-ink`}
        >
          No
        </button>
      </span>
    );
  }

  return (
    <span className="flex items-center justify-end gap-3">
      {status === 'active' ? (
        <>
          <button type="button" onClick={() => run('skip')} disabled={pending} className={`${action} text-ink hover:opacity-60`}>
            Skip
          </button>
          <button type="button" onClick={() => run('pause')} disabled={pending} className={`${action} text-ink hover:opacity-60`}>
            Pause
          </button>
        </>
      ) : (
        <button type="button" onClick={() => run('resume')} disabled={pending} className={`${action} text-ink hover:opacity-60`}>
          Resume
        </button>
      )}
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className={`${action} text-fg-muted hover:text-danger`}
      >
        Cancel
      </button>
    </span>
  );
}
