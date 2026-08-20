'use client';

import { useState } from 'react';

import AuthModal from '@/components/account/AuthModal';
import SelectField from '@/components/SelectField';
import { useAuth } from '@/components/account/AuthContext';
import { api, firstMessage } from '@/lib/api/storefront';
import { QUERY_TOPICS } from '@/lib/queries/types';

/**
 * Queries come from signed-in customers only — the account already knows who
 * is asking and how to reach them, so the form is just the topic and the
 * question itself.
 */
export default function QueryForm() {
  const { customer, loading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState<{ reference: string; firstName: string } | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    setError('');
    const data = new FormData(event.currentTarget);
    setSending(true);
    const result = await api<{ reference: string; firstName: string }>('/api/v1/me/queries', {
      method: 'POST',
      body: {
        topic: String(data.get('topic') ?? ''),
        message: String(data.get('message') ?? ''),
      },
    });
    setSending(false);
    if (!result.ok) {
      setError(firstMessage(result));
      return;
    }
    setSent(result.data);
  }

  if (sent) {
    return (
      <div className="border border-paper-200 bg-white p-8 dark:bg-paper md:p-10">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-ink">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12.5 10 17.5 19 7" />
          </svg>
        </span>

        <h2 className="type-d2 mt-6 text-ink dark:text-white">
          Got it{sent.firstName ? `, ${sent.firstName}` : ''}.
        </h2>
        <p className="type-b1 mt-4 max-w-md text-ink dark:text-white">
          A real person reads these. You&rsquo;ll hear back within one working day —
          two at the outside.
        </p>

        <dl className="mt-7 border-t border-paper-200 pt-5">
          <dt className="font-nebula text-[10px] font-bold uppercase tracking-[0.16em] text-fg-subtle">
            Your reference
          </dt>
          <dd className="mt-1.5 font-quantico text-xl font-bold text-ink dark:text-white">{sent.reference}</dd>
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="/"
            className="type-k inline-flex cursor-pointer items-center border border-paper-300 px-6 py-3 text-ink transition-colors hover:border-ink dark:text-white dark:hover:border-white"
          >
            Back to the site
          </a>
          <a
            href="/#before-you-ask"
            className="type-k inline-flex cursor-pointer items-center border border-paper-300 px-6 py-3 text-ink transition-colors hover:border-ink dark:text-white dark:hover:border-white"
          >
            Read the FAQ
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="h-72 w-full animate-pulse bg-paper-200" />;
  }

  if (!customer) {
    return (
      <div className="border border-paper-200 bg-white p-8 dark:bg-paper md:p-10">
        <h2 className="type-d2 text-ink dark:text-white">Sign in to ask.</h2>
        <p className="type-b1 mt-4 max-w-md text-ink dark:text-white">
          Your account tells us who you are and where to reply — so the form is
          just your question.
        </p>
        <button
          type="button"
          onClick={() => setAuthOpen(true)}
          className="type-k mt-8 inline-flex cursor-pointer items-center gap-2 bg-accent px-8 py-4 text-ink transition-colors hover:bg-accent-hover"
        >
          Sign in
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onDone={() => setAuthOpen(false)} />
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="border border-paper-200 bg-white p-6 dark:bg-paper sm:p-8 md:p-10">
      <p className="type-b2 mb-6 text-fg-muted">
        Asking as <span className="font-bold text-ink dark:text-white">{customer.name}</span> · {customer.email}
      </p>

      <SelectField
        name="topic"
        label="What's it about"
        options={QUERY_TOPICS}
        placeholder="Pick the closest one"
        required
      />

      <div className="mt-6">
        <label
          htmlFor="q-message"
          className="mb-2 block font-nebula text-[10px] font-bold uppercase tracking-[0.16em] text-fg-muted"
        >
          Your question
          <span className="ml-1 text-accent-pressed">*</span>
        </label>
        <textarea
          id="q-message"
          name="message"
          rows={6}
          required
          minLength={15}
          placeholder="Tell us what the issue is — the more specific, the better we can answer."
          className="w-full resize-y border border-paper-300 bg-white px-4 py-3.5 font-pt text-[15px] text-ink outline-none transition-colors placeholder:text-fg-subtle hover:border-fg-muted focus:border-ink dark:bg-paper dark:text-white dark:focus:border-accent"
        />
      </div>

      {error && (
        <p role="alert" className="mt-5 font-pt text-[13px] text-danger">
          {error}
        </p>
      )}

      <div className="mt-8 flex justify-end border-t border-paper-200 pt-8">
        <button
          type="submit"
          disabled={sending}
          className="type-k inline-flex w-full cursor-pointer items-center justify-center gap-2 bg-accent px-10 py-4 text-ink transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {sending ? 'Sending…' : 'Send'}
          {!sending && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          )}
        </button>
      </div>
    </form>
  );
}
