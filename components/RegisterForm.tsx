'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';

import { useAuth } from './AuthContext';
import {
  AuthField,
  AuthSuccessCard,
  authButtonStyle,
  authInputClass,
} from './authShared';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s()-]{7,}$/;
const RESEND_SECONDS = 30;

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

type Step = 'details' | 'otp' | 'success';

export default function RegisterForm() {
  const router = useRouter();
  const search = useSearchParams();
  const redirectTo = search?.get('next') || '/';
  const { register } = useAuth();

  const [step, setStep] = useState<Step>('details');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [otp, setOtp] = useState('');
  const [sentOtp, setSentOtp] = useState('');
  const [resendIn, setResendIn] = useState(RESEND_SECONDS);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (step !== 'otp' || resendIn <= 0) return;
    const id = window.setTimeout(() => setResendIn((v) => v - 1), 1000);
    return () => window.clearTimeout(id);
  }, [step, resendIn]);

  function sendOtp(targetEmail: string) {
    const code = generateOtp();
    setSentOtp(code);
    setResendIn(RESEND_SECONDS);
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-console
      console.info(`[10X demo] OTP for ${targetEmail}: ${code}`);
    }
  }

  function handleSendOtp(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      setError('Enter your name.');
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setError('Enter a valid email address.');
      return;
    }
    if (!PHONE_RE.test(phone.trim())) {
      setError('Enter a valid phone number.');
      return;
    }
    setSending(true);
    window.setTimeout(() => {
      sendOtp(email.trim());
      setStep('otp');
      setSending(false);
      setError('');
      setOtp('');
    }, 450);
  }

  function handleVerifyOtp(event: FormEvent) {
    event.preventDefault();
    if (otp.length !== 6) {
      setError('Enter the full 6-digit code.');
      return;
    }
    if (otp !== sentOtp) {
      setError('Incorrect code. Check your email and try again.');
      return;
    }
    setVerifying(true);
    window.setTimeout(() => {
      const result = register({ name: name.trim(), email: email.trim(), phone: phone.trim() });
      if (!result.ok) {
        setError(result.error ?? 'Something went wrong.');
        setVerifying(false);
        setStep('details');
        return;
      }
      setStep('success');
      window.setTimeout(() => router.push(redirectTo), 900);
    }, 400);
  }

  function handleResend() {
    if (resendIn > 0) return;
    sendOtp(email.trim());
    setOtp('');
    setError('');
  }

  function handleEditDetails() {
    setStep('details');
    setOtp('');
    setSentOtp('');
    setError('');
  }

  if (step === 'success') {
    return (
      <AuthSuccessCard
        title="Account created"
        subtitle={`Welcome to 10X, ${name.split(' ')[0]}.`}
      />
    );
  }

  if (step === 'otp') {
    return (
      <form onSubmit={handleVerifyOtp} className="space-y-5" noValidate>
        <div>
          <p className="font-pt text-body-sm text-fg">
            We sent a 6-digit code to <span className="font-bold">{email}</span>
          </p>
          <button
            type="button"
            onClick={handleEditDetails}
            className="mt-1 cursor-pointer font-pt text-caption text-brand-blue transition-colors hover:text-brand-blue-dark"
          >
            ← Edit details
          </button>
        </div>

        <div className="border-l-4 border-accent bg-accent/10 px-3 py-2.5">
          <p className="font-quantico text-[10px] font-bold uppercase tracking-widest text-fg-muted">
            Demo only
          </p>
          <p className="mt-1 font-pt text-caption text-fg">
            Your verification code is{' '}
            <span className="select-all font-quantico text-body font-bold tracking-[0.2em] text-fg">
              {sentOtp}
            </span>
          </p>
        </div>

        <AuthField
          label="Verification code"
          htmlFor="reg-otp"
          hint="Enter the 6-digit code we sent to your email."
        >
          <input
            id="reg-otp"
            type="text"
            inputMode="numeric"
            pattern="\d{6}"
            maxLength={6}
            required
            autoFocus
            autoComplete="one-time-code"
            value={otp}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, '').slice(0, 6);
              setOtp(digits);
              if (error) setError('');
            }}
            placeholder="••••••"
            className={`${authInputClass} text-center font-quantico text-[1.5rem] font-bold tracking-[0.5em]`}
          />
        </AuthField>

        {error && (
          <p className="font-pt text-body-sm text-danger" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={verifying || otp.length !== 6}
          className="w-full cursor-pointer px-6 py-3.5 font-quantico text-body-sm font-bold uppercase tracking-[0.18em] text-white shadow-elevated transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          style={authButtonStyle}
        >
          {verifying ? 'Verifying…' : 'Verify & create account'}
        </button>

        <button
          type="button"
          onClick={handleResend}
          disabled={resendIn > 0}
          className="block w-full cursor-pointer text-center font-pt text-caption text-fg-muted transition-colors hover:text-fg disabled:cursor-not-allowed disabled:opacity-60"
        >
          {resendIn > 0
            ? `Resend code in 0:${String(resendIn).padStart(2, '0')}`
            : 'Resend code'}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSendOtp} className="space-y-4" noValidate>
      <AuthField label="Full name" htmlFor="reg-name">
        <input
          id="reg-name"
          type="text"
          required
          autoFocus
          autoComplete="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError('');
          }}
          placeholder="Your name"
          className={authInputClass}
        />
      </AuthField>

      <AuthField label="Email" htmlFor="reg-email">
        <input
          id="reg-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError('');
          }}
          placeholder="you@example.com"
          className={authInputClass}
        />
      </AuthField>

      <AuthField
        label="Phone number"
        htmlFor="reg-phone"
        hint="We'll send a 6-digit verification code to your email."
      >
        <input
          id="reg-phone"
          type="tel"
          required
          autoComplete="tel"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            if (error) setError('');
          }}
          placeholder="+91 98765 43210"
          className={authInputClass}
        />
      </AuthField>

      {error && (
        <p className="font-pt text-body-sm text-danger" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="mt-2 w-full cursor-pointer px-6 py-3.5 font-quantico text-body-sm font-bold uppercase tracking-[0.18em] text-white shadow-elevated transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        style={authButtonStyle}
      >
        {sending ? 'Sending OTP…' : 'Send OTP'}
      </button>
    </form>
  );
}
