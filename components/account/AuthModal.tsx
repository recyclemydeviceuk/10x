'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import {
  Field,
  IconMail,
  IconPhone,
  IconUser,
  PasswordField,
} from '@/components/ui/Field';

import logo from '@/10x-Assets/10xLogo.webp';

import { MIN_PASSWORD, useAuth } from './AuthContext';

/**
 * Identity popup — email + password.
 *
 * Four screens, one panel: create an account, sign in, ask for a reset link,
 * and the confirmation after asking. Deliberately chrome-free — no headings or
 * blurb, just the fields, the action, and the way out.
 */

type Mode = 'signup' | 'login' | 'forgot' | 'sent';

type Errors = Partial<Record<'name' | 'email' | 'phone' | 'password', string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^(\+?91[\s-]?)?[6-9]\d{9}$/;

const btn =
  'flex min-h-[52px] w-full cursor-pointer items-center justify-center gap-2 bg-accent px-6 py-4 font-quantico text-body-sm font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-accent-hover disabled:opacity-60';

const linkBtn =
  'cursor-pointer font-bold text-accent underline decoration-accent/40 underline-offset-4 transition-opacity hover:opacity-70';

export default function AuthModal({
  open,
  onClose,
  onDone,
  /** Which screen to open on. Sign-in unless the caller says otherwise. */
  initialMode = 'login',
}: {
  open: boolean;
  onClose: () => void;
  onDone?: () => void;
  initialMode?: 'login' | 'signup';
}) {
  const { signup, login, requestPasswordReset } = useAuth();

  // Signing in is the common case — most people opening this already have
  // an account. Creating one is a tap away from here.
  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    setMode(initialMode);
    setName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setErrors({});
    setFormError('');
    setBusy(false);
  }, [open, initialMode]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  function go(next: Mode) {
    setMode(next);
    setErrors({});
    setFormError('');
  }

  async function submitSignup(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    const next: Errors = {};
    if (name.trim().length < 2) next.name = 'Enter your full name.';
    if (!EMAIL_RE.test(email.trim())) next.email = 'Enter a valid email address.';
    if (!PHONE_RE.test(phone.replace(/[\s-]/g, '')))
      next.phone = 'Enter a valid 10-digit mobile number.';
    if (password.length < MIN_PASSWORD)
      next.password = `At least ${MIN_PASSWORD} characters.`;
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    const result = await signup({ name, email, phone, password });
    setBusy(false);
    if (!result.ok) return setFormError(result.message);
    onDone?.();
    onClose();
  }

  async function submitLogin(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    setBusy(true);
    const result = await login(email, password);
    setBusy(false);
    if (!result.ok) return setFormError(result.message);
    onDone?.();
    onClose();
  }

  async function submitForgot(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setBusy(true);
    const result = await requestPasswordReset(email);
    setBusy(false);
    if (!result.ok) return setErrors({ email: result.message });
    setMode('sent');
  }

  return (
    <div
      className="fixed inset-0 z-[10050] flex items-stretch justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={
        mode === 'signup'
          ? 'Create your account'
          : mode === 'login'
            ? 'Sign in'
            : 'Reset your password'
      }
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-ink/70 backdrop-blur-sm"
      />

      {/* Edge-to-edge and full height on phones; a centred card from sm up.
          max-w-sm alone still left gutters on larger handsets. */}
      <div className="relative flex w-full flex-col overflow-y-auto bg-white shadow-elevated dark:bg-paper sm:h-auto sm:max-h-[90vh] sm:max-w-sm sm:border-2 sm:border-paper-200 dark:sm:border-paper-300">
        {/* Brand mark left, close right — a real header row rather than a
            floating close button over blank space. */}
        <div className="flex items-center justify-between gap-4 px-6 pt-6 sm:px-7">
          {/* The asset is a white mark, so it needs inverting on light
              backgrounds — same treatment as the site header. */}
          <Image
            src={logo}
            alt="10X"
            width={80}
            height={32}
            priority
            className="h-6 w-auto brightness-0 dark:brightness-[100]"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center border border-paper-200 text-fg-muted transition-colors hover:border-fg hover:text-fg"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="px-6 pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-7 sm:px-7 sm:pb-7">
          {/* ============================= SIGN UP ============================= */}
          {mode === 'signup' && (
            <>
              <form onSubmit={submitSignup} className="space-y-4" noValidate>
                <Field
                  id="au-name" label="Full Name" icon={IconUser} autoFocus
                  value={name} autoComplete="name" placeholder="Arjun Mehta"
                  error={errors.name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Field
                  id="au-email" label="Email" icon={IconMail} type="email"
                  value={email} autoComplete="email" placeholder="you@email.com"
                  error={errors.email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Field
                  id="au-phone" label="Mobile" icon={IconPhone} type="tel" inputMode="tel"
                  value={phone} autoComplete="tel" placeholder="98765 43210"
                  error={errors.phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <PasswordField
                  id="au-password" label="Password"
                  value={password} autoComplete="new-password"
                  placeholder={`${MIN_PASSWORD}+ characters`}
                  error={errors.password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {formError && <FormError>{formError}</FormError>}

                <button type="submit" disabled={busy} className={btn}>
                  {busy ? <Spinner label="Creating…" /> : 'Create Account'}
                </button>
              </form>

              <p className="mt-4 text-center font-pt text-body-sm text-fg-muted">
                Have an account?{' '}
                <button type="button" onClick={() => go('login')} className={linkBtn}>
                  Sign in
                </button>
              </p>
            </>
          )}

          {/* ============================== LOG IN ============================== */}
          {mode === 'login' && (
            <>
              <form onSubmit={submitLogin} className="space-y-4" noValidate>
                <Field
                  id="au-login-email" label="Email" icon={IconMail} type="email" autoFocus
                  value={email} autoComplete="email" placeholder="you@email.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <PasswordField
                  id="au-login-password" label="Password"
                  value={password} autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                />

                {formError && <FormError>{formError}</FormError>}

                <button type="submit" disabled={busy} className={btn}>
                  {busy ? <Spinner label="Signing in…" /> : 'Sign In'}
                </button>
              </form>

              <div className="mt-4 flex items-center justify-between gap-4 font-pt text-body-sm">
                <button type="button" onClick={() => go('forgot')} className="cursor-pointer text-fg-muted underline decoration-paper-300 underline-offset-4 transition-colors hover:text-fg">
                  Forgot password?
                </button>
                <button type="button" onClick={() => go('signup')} className={linkBtn}>
                  Create account
                </button>
              </div>
            </>
          )}

          {/* ============================== FORGOT ============================== */}
          {mode === 'forgot' && (
            <>
              <form onSubmit={submitForgot} className="space-y-4" noValidate>
                <Field
                  id="au-forgot-email" label="Email" icon={IconMail} type="email" autoFocus
                  value={email} autoComplete="email" placeholder="you@email.com"
                  error={errors.email}
                  hint="We'll send you a link to set a new password."
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" disabled={busy} className={btn}>
                  {busy ? <Spinner label="Sending…" /> : 'Send Reset Link'}
                </button>
              </form>

              <p className="mt-4 text-center font-pt text-body-sm">
                <button type="button" onClick={() => go('login')} className={linkBtn}>
                  Back to sign in
                </button>
              </p>
            </>
          )}

          {/* =============================== SENT =============================== */}
          {mode === 'sent' && (
            <div className="text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center bg-accent text-ink">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12.5 10 17.5 19 7" />
                </svg>
              </span>
              <p className="mt-4 font-pt text-body text-fg-muted">
                If an account exists for{' '}
                <span className="font-bold text-fg">{email.trim()}</span>, a reset
                link is on its way.
              </p>
              <button type="button" onClick={() => go('login')} className={`${btn} mt-6`}>
                Back to Sign In
              </button>
            </div>
          )}

          {/* Terms belong on the screen that creates the account, nowhere else. */}
          {mode === 'signup' && (
            <p className="mt-5 border-t border-paper-200 pt-4 text-center font-pt text-caption text-fg-subtle">
              By continuing you agree to our{' '}
              <a href="/terms" className="underline underline-offset-2 hover:text-fg">Terms</a>
              {' '}and{' '}
              <a href="/privacy" className="underline underline-offset-2 hover:text-fg">Privacy Policy</a>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function FormError({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="bg-danger/10 px-4 py-3 font-pt text-body-sm font-bold text-danger">
      {children}
    </p>
  );
}

function Spinner({ label }: { label: string }) {
  return (
    <>
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/30 border-t-ink" />
      {label}
    </>
  );
}
