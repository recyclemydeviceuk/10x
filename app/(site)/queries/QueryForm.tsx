'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';

import SelectField from '@/components/SelectField';
import { QUERY_TOPICS } from '@/lib/queries/types';

import { submitQuery, type QueryFormState } from './actions';

const FIELD =
  'w-full border bg-white px-4 py-3.5 font-pt text-[15px] text-ink outline-none transition-colors placeholder:text-fg-subtle';

function fieldClass(error?: string) {
  return `${FIELD} ${error ? 'border-danger' : 'border-paper-300 hover:border-fg-muted focus:border-ink'}`;
}

function Label({ htmlFor, children, required }: { htmlFor: string; children: string; required?: boolean }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block font-nebula text-[10px] font-bold uppercase tracking-[0.16em] text-fg-muted"
    >
      {children}
      {required && <span className="ml-1 text-accent-pressed">*</span>}
    </label>
  );
}

function FieldError({ children }: { children?: string }) {
  if (!children) return null;
  return (
    <p className="mt-2 font-pt text-[13px] text-danger" role="alert">
      {children}
    </p>
  );
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="type-k inline-flex w-full cursor-pointer items-center justify-center gap-2 bg-accent px-8 py-4 text-ink transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
    >
      {pending ? 'Sending…' : 'Send it over'}
      {!pending && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      )}
    </button>
  );
}

export default function QueryForm() {
  const [state, formAction] = useActionState<QueryFormState, FormData>(submitQuery, {
    status: 'idle',
  });
  // Drives the conditional order-number field without a round trip.
  const [topic, setTopic] = useState('');

  if (state.status === 'sent') {
    return (
      <div className="border border-paper-200 bg-white p-8 md:p-10">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-ink">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12.5 10 17.5 19 7" />
          </svg>
        </span>

        <h2 className="type-d2 mt-6 text-ink">
          Got it{state.firstName ? `, ${state.firstName}` : ''}.
        </h2>
        <p className="type-b1 mt-4 max-w-md text-ink">
          A real person reads these. You&rsquo;ll hear back within one working day —
          two at the outside.
        </p>

        <dl className="mt-7 border-t border-paper-200 pt-5">
          <dt className="font-nebula text-[10px] font-bold uppercase tracking-[0.16em] text-fg-subtle">
            Your reference
          </dt>
          <dd className="mt-1.5 font-quantico text-xl font-bold text-ink">{state.reference}</dd>
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="type-k inline-flex cursor-pointer items-center border border-paper-300 px-6 py-3 text-ink transition-colors hover:border-ink"
          >
            Back to the site
          </Link>
          <Link
            href="/#before-you-ask"
            className="type-k inline-flex cursor-pointer items-center border border-paper-300 px-6 py-3 text-ink transition-colors hover:border-ink"
          >
            Read the FAQ
          </Link>
        </div>
      </div>
    );
  }

  const errors = state.errors ?? {};
  const showOrderField = topic === 'order' || topic === 'refund';

  return (
    <form action={formAction} className="border border-paper-200 bg-white p-6 sm:p-8 md:p-10">
      {/* Honeypot — off-screen, not display:none, so bots still fill it. */}
      <div aria-hidden className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <SelectField
        name="topic"
        label="What's it about"
        options={QUERY_TOPICS}
        placeholder="Pick the closest one"
        required
        error={errors.topic}
        onValueChange={setTopic}
      />

      <div className="mt-6">
        <Label htmlFor="q-message" required>
          Your question
        </Label>
        <textarea
          id="q-message"
          name="message"
          rows={6}
          required
          placeholder="Ask us anything — the more specific, the better we can answer."
          className={`${fieldClass(errors.message)} resize-y`}
        />
        <FieldError>{errors.message}</FieldError>
      </div>

      {showOrderField && (
        <div className="mt-6">
          <Label htmlFor="q-order">Order number</Label>
          <input
            id="q-order"
            name="orderReference"
            type="text"
            placeholder="10X-2058 — optional, but it speeds things up"
            className={fieldClass()}
          />
        </div>
      )}

      <div className="mt-8 border-t border-paper-200 pt-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <Label htmlFor="q-name" required>
              Name
            </Label>
            <input
              id="q-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className={fieldClass(errors.name)}
            />
            <FieldError>{errors.name}</FieldError>
          </div>

          <div>
            <Label htmlFor="q-email" required>
              Email
            </Label>
            <input
              id="q-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={fieldClass(errors.email)}
            />
            <FieldError>{errors.email}</FieldError>
          </div>
        </div>

        <div className="mt-6 sm:max-w-[calc(50%-0.75rem)]">
          <Label htmlFor="q-phone">Phone</Label>
          <input
            id="q-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Optional"
            className={fieldClass(errors.phone)}
          />
          <FieldError>{errors.phone}</FieldError>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 border-t border-paper-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="type-b2 max-w-xs text-fg-subtle">
          We use this to answer you, and nothing else.
        </p>
        <Submit />
      </div>
    </form>
  );
}
