'use client';

import { useRef, useState } from 'react';

import { Field, IconPhone, IconUser, labelCls } from '@/components/ui/Field';
import { ACCEPTED_TYPES } from '@/lib/store/avatar';

import Avatar from './Avatar';
import { useAuth } from './AuthContext';

/**
 * Profile.
 *
 * Three separate concerns, three separate panels, three separate submits.
 * Bundling them would mean a stray keystroke in one changing another — and
 * "save" on a form that also holds your email and password is a scary button.
 */
export default function ProfileView() {
  const { customer } = useAuth();
  if (!customer) return null;

  return (
    <div className="space-y-8">
      <AvatarPanel />
      <DetailsPanel />
      <EmailPanel />
      <SecurityPanel />
    </div>
  );
}

/* ------------------------------------------------------------------ shell */

function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-2 border-paper-200">
      <div className="border-b-2 border-paper-200 px-5 py-4 sm:px-7 sm:py-5">
        <h3 className="font-condensed text-lg font-black uppercase italic tracking-tight text-fg sm:text-xl">
          {title}
        </h3>
        {description && (
          <p className="mt-1.5 font-pt text-body-sm text-fg-muted">{description}</p>
        )}
      </div>
      <div className="px-5 py-5 sm:px-7 sm:py-6">{children}</div>
    </section>
  );
}

function Saved({ label = 'Saved' }: { label?: string }) {
  return (
    <p
      role="status"
      className="flex items-center gap-2 font-quantico text-caption font-bold uppercase tracking-[0.12em] text-accent-pressed dark:text-accent"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M5 12.5 10 17.5 19 7" />
      </svg>
      {label}
    </p>
  );
}

function ErrorNote({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="bg-danger/10 px-4 py-3 font-pt text-body-sm font-bold text-danger">
      {children}
    </p>
  );
}

const primaryBtn =
  'cursor-pointer bg-accent px-6 py-3.5 font-quantico text-caption font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50';
const ghostBtn =
  'cursor-pointer border-2 border-paper-200 px-6 py-3.5 font-quantico text-caption font-bold uppercase tracking-[0.14em] text-fg transition-colors hover:border-accent disabled:cursor-not-allowed disabled:opacity-50';

/* ----------------------------------------------------------------- avatar */

function AvatarPanel() {
  const { customer, setAvatar } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // Clear immediately so picking the same file twice still fires onChange.
    e.target.value = '';
    if (!file) return;

    setError('');
    setBusy(true);
    const result = await setAvatar(file);
    setBusy(false);
    if (!result.ok) return setError(result.message);
  }

  return (
    <Panel title="Photo" description="Shown on your account. Only you can see it.">
      <div className="flex flex-wrap items-center gap-5 sm:gap-6">
        <Avatar name={customer?.name ?? ''} src={customer?.avatarUrl} size="lg" className="!h-20 !w-20 sm:!h-24 sm:!w-24" />

        <div className="min-w-0">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={busy}
              className={primaryBtn}
            >
              {busy ? 'Processing…' : customer?.avatarUrl ? 'Change photo' : 'Upload photo'}
            </button>
            {customer?.avatarUrl && (
              <button
                type="button"
                onClick={() => void setAvatar(null)}
                className="cursor-pointer border-2 border-paper-200 px-6 py-3.5 font-quantico text-caption font-bold uppercase tracking-[0.14em] text-fg-muted transition-colors hover:border-danger hover:text-danger"
              >
                Remove
              </button>
            )}
          </div>
          <p className="mt-3 font-pt text-caption text-fg-subtle">
            JPG, PNG or WebP · up to 5MB
          </p>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          onChange={onPick}
          className="sr-only"
          aria-label="Upload a profile photo"
        />
      </div>

      {error && <div className="mt-5"><ErrorNote>{error}</ErrorNote></div>}
    </Panel>
  );
}

/* ---------------------------------------------------------------- details */

function DetailsPanel() {
  const { customer, updateProfile } = useAuth();
  const [name, setName] = useState(customer?.name ?? '');
  const [phone, setPhone] = useState(customer?.phone ?? '');
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  const dirty = name !== (customer?.name ?? '') || phone !== (customer?.phone ?? '');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (name.trim().length < 2) next.name = 'Enter your full name.';
    if (phone && !/^(\+?91[\s-]?)?[6-9]\d{9}$/.test(phone.replace(/[\s-]/g, '')))
      next.phone = 'Enter a valid 10-digit mobile number.';
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    const result = await updateProfile({ name: name.trim(), phone: phone.trim() });
    setBusy(false);
    if (!result.ok) {
      setErrors({ name: result.message });
      return;
    }
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2400);
  }

  return (
    <Panel title="Details" description="These appear on your orders and delivery updates.">
      <form onSubmit={submit} className="max-w-md space-y-5" noValidate>
        <Field
          id="pf-name"
          label="Full Name"
          icon={IconUser}
          value={name}
          autoComplete="name"
          error={errors.name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors((x) => ({ ...x, name: undefined }));
          }}
        />
        <Field
          id="pf-phone"
          label="Mobile Number"
          icon={IconPhone}
          type="tel"
          value={phone}
          autoComplete="tel"
          placeholder="98765 43210"
          error={errors.phone}
          onChange={(e) => {
            setPhone(e.target.value);
            setErrors((x) => ({ ...x, phone: undefined }));
          }}
        />
        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" disabled={busy || !dirty} className={primaryBtn}>
            {busy ? 'Saving…' : 'Save Changes'}
          </button>
          {saved && <Saved />}
        </div>
      </form>
    </Panel>
  );
}

/* ------------------------------------------------------------------ email */

function EmailPanel() {
  const { customer, requestEmailChange, confirmEmailChange } = useAuth();
  const [step, setStep] = useState<'idle' | 'enter' | 'verify' | 'done'>('idle');
  const [newEmail, setNewEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function reset() {
    setStep('idle');
    setNewEmail('');
    setCode('');
    setError('');
  }

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    const result = await requestEmailChange(newEmail);
    setBusy(false);
    if (!result.ok) return setError(result.message);
    setStep('verify');
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    const result = await confirmEmailChange(newEmail, code);
    setBusy(false);
    if (!result.ok) return setError(result.message);
    setStep('done');
    window.setTimeout(reset, 2600);
  }

  return (
    <Panel
      title="Email"
      description="Your sign-in address. Changing it needs a code sent to the new inbox."
    >
      <div className="max-w-md">
        <p className="font-quantico text-[10px] font-bold uppercase tracking-[0.16em] text-fg-subtle">
          Current
        </p>
        <p className="mt-1.5 break-all font-pt text-body text-fg">{customer?.email}</p>

        {step === 'idle' && (
          <button type="button" onClick={() => setStep('enter')} className={`${ghostBtn} mt-5`}>
            Change email
          </button>
        )}

        {step === 'done' && <div className="mt-5"><Saved label="Email updated" /></div>}

        {step === 'enter' && (
          <form onSubmit={sendCode} className="mt-6 space-y-5" noValidate>
            <Field
              id="pf-new-email"
              label="New Email"
              type="email"
              autoFocus
              value={newEmail}
              autoComplete="email"
              placeholder="you@email.com"
              error={error}
              hint="We'll send a 6-digit code there to confirm it's yours."
              onChange={(e) => {
                setNewEmail(e.target.value);
                setError('');
              }}
            />
            <div className="flex flex-wrap gap-3">
              <button type="submit" disabled={busy || !newEmail.trim()} className={primaryBtn}>
                {busy ? 'Sending…' : 'Send Code'}
              </button>
              <button type="button" onClick={reset} className={ghostBtn}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {step === 'verify' && (
          <form onSubmit={verify} className="mt-6 space-y-5" noValidate>
            <p className="font-pt text-body-sm text-fg-muted">
              Code sent to <span className="font-bold text-fg">{newEmail.trim()}</span>.
            </p>
            <div>
              <label htmlFor="pf-email-code" className={labelCls}>
                6-Digit Code
              </label>
              <input
                id="pf-email-code"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                  setError('');
                }}
                inputMode="numeric"
                autoComplete="one-time-code"
                autoFocus
                maxLength={6}
                placeholder="000000"
                aria-invalid={error ? true : undefined}
                className={`w-full border-2 bg-white px-4 py-4 text-center font-quantico text-2xl font-bold tracking-[0.5em] text-fg outline-none transition-colors placeholder:text-fg-subtle focus:border-accent dark:bg-paper ${
                  error ? 'border-danger' : 'border-paper-200'
                }`}
              />
            </div>

            {error && <ErrorNote>{error}</ErrorNote>}

            <div className="flex flex-wrap gap-3">
              <button type="submit" disabled={busy || code.length < 6} className={primaryBtn}>
                {busy ? 'Verifying…' : 'Verify & Update'}
              </button>
              <button type="button" onClick={reset} className={ghostBtn}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </Panel>
  );
}

/* --------------------------------------------------------------- security */

function SecurityPanel() {
  const { customer, requestPasswordReset } = useAuth();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function send() {
    if (!customer) return;
    setError('');
    setBusy(true);
    const result = await requestPasswordReset(customer.email);
    setBusy(false);
    if (!result.ok) return setError(result.message);
    setSent(true);
  }

  return (
    <Panel
      title="Password"
      description="We'll email you a link to set a new one — no need to remember the old."
    >
      <div className="max-w-md">
        {sent ? (
          <div className="border-l-2 border-accent bg-paper-50 px-5 py-4 dark:bg-paper-200">
            <p className="font-quantico text-caption font-bold uppercase tracking-[0.12em] text-fg">
              Check your inbox
            </p>
            <p className="mt-2 font-pt text-body-sm text-fg-muted">
              We sent a reset link to{' '}
              <span className="font-bold text-fg">{customer?.email}</span>. It
              expires in 30 minutes.
            </p>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="mt-3 cursor-pointer font-pt text-caption text-fg-muted underline decoration-paper-300 underline-offset-4 transition-colors hover:text-fg"
            >
              Send it again
            </button>
          </div>
        ) : (
          <>
            <button type="button" onClick={send} disabled={busy} className={primaryBtn}>
              {busy ? 'Sending…' : 'Send Reset Link'}
            </button>
            {error && <div className="mt-4"><ErrorNote>{error}</ErrorNote></div>}
          </>
        )}
      </div>
    </Panel>
  );
}
