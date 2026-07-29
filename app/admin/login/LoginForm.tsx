'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { login, type LoginState } from '../actions';

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-7 flex w-full cursor-pointer items-center justify-center gap-2 bg-ink px-6 py-3.5 font-quantico text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-ink-900 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'Signing in…' : 'Sign in'}
      {!pending && (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      )}
    </button>
  );
}

const FIELD =
  'mt-2 w-full border border-paper-300 bg-white px-4 py-3 font-pt text-[15px] text-ink outline-none transition-colors placeholder:text-fg-subtle focus:border-ink';

export default function LoginForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={formAction} className="mt-9">
      {next && <input type="hidden" name="next" value={next} />}

      <div>
        <label
          htmlFor="email"
          className="font-nebula text-[10px] font-bold uppercase tracking-[0.16em] text-fg-subtle"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          placeholder="you@10xdrink.com"
          className={FIELD}
        />
      </div>

      <div className="mt-5">
        <label
          htmlFor="password"
          className="font-nebula text-[10px] font-bold uppercase tracking-[0.16em] text-fg-subtle"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className={FIELD}
        />
      </div>

      {state.error && (
        <p
          role="alert"
          className="mt-5 border-l-2 border-danger bg-paper-50 py-2 pl-3 font-pt text-[14px] text-danger"
        >
          {state.error}
        </p>
      )}

      <Submit />

      <p className="type-b2 mt-6 text-fg-subtle">
        Locked out? Ask the owner to reset your access — there is no self-serve
        password reset on the admin panel by design.
      </p>
    </form>
  );
}
