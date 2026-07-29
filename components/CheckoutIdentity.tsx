'use client';

import { useEffect, useRef, useState } from 'react';

import { sendLoginCode, verifyLoginCode, type SavedProfile } from '@/lib/checkout/actions';
import { CODE_LENGTH } from '@/lib/checkout/otp';

/**
 * The first thing checkout asks: have you bought from us before?
 *
 * Returning customers verify an email with a one-time code and skip straight
 * to a pre-filled review — no retyping an address they've already given us.
 * Everyone else goes through the normal flow.
 *
 * Sized for a thumb first: full-width targets, 56px minimum tap height, the
 * code boxes big enough to hit without zooming, and a numeric keypad on mobile.
 */

/* ------------------------------------------------------------------ gate */

export function IdentityGate({
  onNew,
  onReturning,
}: {
  onNew: () => void;
  onReturning: () => void;
}) {
  return (
    <div>
      <h2 className="font-condensed text-[2rem] font-black uppercase italic leading-none tracking-tight text-ink sm:text-4xl">
        Have you ordered
        <br />
        before?
      </h2>
      <p className="mt-3 font-pt text-body text-fg-muted">
        If you have, we&rsquo;ll fetch your details so there&rsquo;s nothing to type.
      </p>

      <div className="mt-8 space-y-3">
        <button
          type="button"
          onClick={onReturning}
          className="group flex w-full cursor-pointer items-center gap-4 border-2 border-paper-200 bg-white p-5 text-left transition-colors hover:border-ink"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-ink">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M20 21a8 8 0 0 0-16 0" />
              <circle cx="12" cy="8" r="4" />
            </svg>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-quantico text-body-sm font-bold uppercase tracking-[0.1em] text-ink">
              Yes, I&rsquo;ve ordered before
            </span>
            <span className="mt-1 block font-pt text-body-sm text-fg-muted">
              Verify your email — name and address fill themselves
            </span>
          </span>
          <Chevron />
        </button>

        <button
          type="button"
          onClick={onNew}
          className="group flex w-full cursor-pointer items-center gap-4 border-2 border-paper-200 bg-white p-5 text-left transition-colors hover:border-ink"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paper-100 text-ink">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-quantico text-body-sm font-bold uppercase tracking-[0.1em] text-ink">
              I&rsquo;m new here
            </span>
            <span className="mt-1 block font-pt text-body-sm text-fg-muted">
              Takes about a minute
            </span>
          </span>
          <Chevron />
        </button>
      </div>

      <p className="mt-6 font-pt text-caption text-fg-subtle">
        No account, no password. The code is just so nobody else can pull up
        your address.
      </p>
    </div>
  );
}

function Chevron() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="shrink-0 text-fg-subtle transition-transform group-hover:translate-x-0.5"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

/* --------------------------------------------------------------- sign-in */

export function ReturningSignIn({
  onVerified,
  onUseNewInstead,
}: {
  /** Profile is null when the email verified but we hold nothing for it. */
  onVerified: (email: string, profile: SavedProfile | null) => void;
  onUseNewInstead: () => void;
}) {
  const [stage, setStage] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [devCode, setDevCode] = useState<string | undefined>();
  const [cooldown, setCooldown] = useState(0);

  const boxes = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  useEffect(() => {
    if (stage === 'code') boxes.current[0]?.focus();
  }, [stage]);

  async function send() {
    setBusy(true);
    setError('');
    const result = await sendLoginCode(email);
    setBusy(false);

    if (!result.ok) {
      setError(result.message ?? 'Couldn’t send that code.');
      if (result.retryInSeconds) setCooldown(result.retryInSeconds);
      return;
    }
    setDevCode(result.devCode);
    setDigits(Array(CODE_LENGTH).fill(''));
    setStage('code');
    setCooldown(30);
  }

  async function verify(code: string) {
    setBusy(true);
    setError('');
    const result = await verifyLoginCode(email, code);
    setBusy(false);

    if (!result.ok) {
      setError(result.message);
      setDigits(Array(CODE_LENGTH).fill(''));
      boxes.current[0]?.focus();
      return;
    }
    onVerified(email, result.profile);
  }

  function setDigit(index: number, value: string) {
    const clean = value.replace(/\D/g, '');
    if (!clean) {
      const next = [...digits];
      next[index] = '';
      setDigits(next);
      return;
    }

    const next = [...digits];
    // A paste lands entirely in one box — spread it across the rest.
    for (let i = 0; i < clean.length && index + i < CODE_LENGTH; i += 1) {
      next[index + i] = clean[i];
    }
    setDigits(next);

    const landed = Math.min(index + clean.length, CODE_LENGTH - 1);
    boxes.current[landed]?.focus();

    // `every`, not `join().includes('')` — "".includes("") is true for every
    // string, so that test can never pass and the code would never submit.
    if (next.every((d) => d !== '')) void verify(next.join(''));
  }

  function onDigitKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      boxes.current[index - 1]?.focus();
    }
    if (event.key === 'ArrowLeft' && index > 0) boxes.current[index - 1]?.focus();
    if (event.key === 'ArrowRight' && index < CODE_LENGTH - 1) boxes.current[index + 1]?.focus();
  }

  if (stage === 'email') {
    return (
      <div>
        <h2 className="font-condensed text-[2rem] font-black uppercase italic leading-none tracking-tight text-ink sm:text-4xl">
          Welcome back
        </h2>
        <p className="mt-3 font-pt text-body text-fg-muted">
          Pop in the email you ordered with. We&rsquo;ll send a {CODE_LENGTH}-digit
          code to check it&rsquo;s you.
        </p>

        <form
          className="mt-7"
          onSubmit={(e) => {
            e.preventDefault();
            void send();
          }}
        >
          <label
            htmlFor="signin-email"
            className="mb-1.5 block font-quantico text-caption font-bold uppercase tracking-wider text-fg-muted"
          >
            Email address
          </label>
          <input
            id="signin-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoFocus
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="w-full border-2 border-paper-200 bg-white px-4 py-4 font-pt text-body text-ink outline-none transition-colors placeholder:text-fg-subtle focus:border-ink"
          />

          {error && (
            <p role="alert" className="mt-3 font-pt text-body-sm text-danger">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy || !email}
            className="mt-6 flex min-h-[56px] w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 font-quantico text-body-sm font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? 'Sending…' : 'Send me the code'}
          </button>
        </form>

        <button
          type="button"
          onClick={onUseNewInstead}
          className="mt-5 w-full cursor-pointer py-2 font-pt text-body-sm text-fg-muted underline decoration-paper-300 underline-offset-4 transition-colors hover:text-ink"
        >
          Actually, I&rsquo;m new — let me type it in
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-condensed text-[2rem] font-black uppercase italic leading-none tracking-tight text-ink sm:text-4xl">
        Check your inbox
      </h2>
      <p className="mt-3 font-pt text-body text-fg-muted">
        We sent a {CODE_LENGTH}-digit code to{' '}
        <span className="font-bold text-ink">{email}</span>. It&rsquo;s good for
        ten minutes.
      </p>

      {devCode && (
        <p className="mt-5 border-l-2 border-warning bg-paper-50 px-4 py-3 font-pt text-body-sm text-fg-muted">
          <span className="font-bold text-ink">Development only:</span> no mail
          provider is connected yet, so the code is <span className="font-quantico font-bold text-ink">{devCode}</span>.
          This never appears in production.
        </p>
      )}

      <div className="mt-7 flex justify-between gap-2" role="group" aria-label="Verification code">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              boxes.current[i] = el;
            }}
            type="text"
            // Numeric keypad on mobile without losing paste behaviour.
            inputMode="numeric"
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            maxLength={CODE_LENGTH}
            aria-label={`Digit ${i + 1}`}
            value={digit}
            onChange={(e) => setDigit(i, e.target.value)}
            onKeyDown={(e) => onDigitKeyDown(i, e)}
            className="h-16 w-full min-w-0 border-2 border-paper-200 bg-white text-center font-quantico text-2xl font-bold text-ink outline-none transition-colors focus:border-ink"
          />
        ))}
      </div>

      {error && (
        <p role="alert" className="mt-4 font-pt text-body-sm text-danger">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={() => void verify(digits.join(''))}
        disabled={busy || digits.some((d) => !d)}
        className="mt-6 flex min-h-[56px] w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 font-quantico text-body-sm font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? 'Checking…' : 'Verify & continue'}
      </button>

      <div className="mt-5 flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => void send()}
          disabled={cooldown > 0 || busy}
          className="cursor-pointer py-1 font-pt text-body-sm text-fg-muted underline decoration-paper-300 underline-offset-4 transition-colors hover:text-ink disabled:cursor-not-allowed disabled:no-underline disabled:opacity-60"
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : 'Send a new code'}
        </button>
        <button
          type="button"
          onClick={() => setStage('email')}
          className="cursor-pointer py-1 font-pt text-body-sm text-fg-muted underline decoration-paper-300 underline-offset-4 transition-colors hover:text-ink"
        >
          Use a different email
        </button>
      </div>
    </div>
  );
}
