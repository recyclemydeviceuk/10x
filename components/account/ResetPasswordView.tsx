'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { PasswordField } from '@/components/ui/Field';

import { MIN_PASSWORD, useAuth } from './AuthContext';

/**
 * Where the emailed reset link lands.
 *
 * The token comes in on the query string and is handed straight back to the
 * API — nothing here inspects or trusts it. A missing token is treated as an
 * expired link rather than rendering a form that cannot possibly work.
 */
export default function ResetPasswordView() {
  const params = useSearchParams();
  const token = params.get('token') ?? '';
  const { resetPassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password !== confirm) return setError('The two passwords don’t match.');

    setBusy(true);
    const result = await resetPassword(token, password);
    setBusy(false);
    if (!result.ok) return setError(result.message);
    setDone(true);
  }

  return (
    <main id="main" className="min-h-[70vh] bg-paper">
      <div className="mx-auto max-w-sm px-6 pb-24 pt-32 sm:px-10 md:pt-40">
        {done ? (
          <div className="text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center bg-accent text-ink">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12.5 10 17.5 19 7" />
              </svg>
            </span>
            <h1 className="mt-6 font-condensed text-2xl font-black uppercase italic leading-none tracking-tight text-fg">
              Password Updated
            </h1>
            <p className="mt-3 font-pt text-body text-fg-muted">
              You can sign in with your new password now.
            </p>
            <Link
              href="/account"
              className="mt-7 inline-flex w-full cursor-pointer items-center justify-center bg-accent px-6 py-4 font-quantico text-body-sm font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-accent-hover"
            >
              Go to Sign In
            </Link>
          </div>
        ) : !token ? (
          <div className="text-center">
            <h1 className="font-condensed text-2xl font-black uppercase italic leading-none tracking-tight text-fg">
              Link Expired
            </h1>
            <p className="mt-3 font-pt text-body text-fg-muted">
              This reset link is invalid or has already been used. Request a new
              one from the sign-in screen.
            </p>
            <Link
              href="/account"
              className="mt-7 inline-flex w-full cursor-pointer items-center justify-center border-2 border-paper-200 px-6 py-4 font-quantico text-body-sm font-bold uppercase tracking-[0.16em] text-fg transition-colors hover:border-accent"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <h1 className="font-condensed text-2xl font-black uppercase italic leading-none tracking-tight text-fg">
              Set A New Password
            </h1>

            <form onSubmit={submit} className="mt-7 space-y-4" noValidate>
              <PasswordField
                id="rp-password"
                label="New Password"
                autoFocus
                value={password}
                autoComplete="new-password"
                placeholder={`${MIN_PASSWORD}+ characters`}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
              />
              <PasswordField
                id="rp-confirm"
                label="Confirm Password"
                value={confirm}
                autoComplete="new-password"
                onChange={(e) => {
                  setConfirm(e.target.value);
                  setError('');
                }}
              />

              {error && (
                <p role="alert" className="bg-danger/10 px-4 py-3 font-pt text-body-sm font-bold text-danger">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={busy || !password || !confirm}
                className="flex min-h-[52px] w-full cursor-pointer items-center justify-center gap-2 bg-accent px-6 py-4 font-quantico text-body-sm font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy ? 'Updating…' : 'Update Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
