'use client';

import { useActionState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';

import type { QueryStatus } from '@/lib/queries/types';

import { replyToQuery, setQueryStatus, type ReplyState } from './actions';

function Save() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex cursor-pointer items-center gap-2 bg-ink px-5 py-2.5 font-quantico text-[11px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-ink-900 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? 'Saving…' : 'Save reply'}
    </button>
  );
}

export default function QueryReply({
  id,
  status,
  existingReply,
}: {
  id: string;
  status: QueryStatus;
  existingReply?: string;
}) {
  const [state, formAction] = useActionState<ReplyState, FormData>(replyToQuery, {
    status: 'idle',
  });
  const [pending, startTransition] = useTransition();

  function move(next: QueryStatus) {
    startTransition(async () => {
      await setQueryStatus(id, next);
    });
  }

  const secondary =
    'cursor-pointer border border-paper-300 bg-white px-4 py-2.5 font-quantico text-[10px] font-bold uppercase tracking-[0.12em] text-ink transition-colors hover:border-ink disabled:opacity-40';

  return (
    <div>
      <form action={formAction}>
        <input type="hidden" name="id" value={id} />
        <label
          htmlFor="reply"
          className="mb-2 block font-nebula text-[10px] font-bold uppercase tracking-[0.16em] text-fg-subtle"
        >
          Reply
        </label>
        <textarea
          id="reply"
          name="reply"
          rows={6}
          defaultValue={existingReply ?? ''}
          placeholder="Answer plainly. If we don't know, say so."
          className="w-full resize-y border border-paper-300 bg-white px-4 py-3 font-pt text-[15px] text-ink outline-none transition-colors placeholder:text-fg-subtle focus:border-ink"
        />

        {state.status === 'error' && (
          <p className="mt-2 font-pt text-[13px] text-danger" role="alert">
            {state.error}
          </p>
        )}
        {state.status === 'saved' && (
          <p className="mt-2 font-pt text-[13px] text-[#4EA310]" role="status">
            Saved and marked answered.
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Save />

          {status !== 'open' && (
            <button type="button" onClick={() => move('open')} disabled={pending} className={secondary}>
              Mark in progress
            </button>
          )}
          {status !== 'closed' && (
            <button type="button" onClick={() => move('closed')} disabled={pending} className={secondary}>
              Close
            </button>
          )}
          {status === 'closed' && (
            <button type="button" onClick={() => move('open')} disabled={pending} className={secondary}>
              Reopen
            </button>
          )}
        </div>
      </form>

      <p className="type-b2 mt-4 border-t border-paper-100 pt-4 text-fg-subtle">
        Saving records the answer here — it does not email the customer yet. Send
        that from your inbox until a mail provider is connected.
      </p>
    </div>
  );
}
