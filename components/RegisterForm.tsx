'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import { useAuth } from './AuthContext';
import {
  AuthField,
  AuthSuccessCard,
  authButtonStyle,
  authInputClass,
} from './authShared';

export default function RegisterForm() {
  const router = useRouter();
  const search = useSearchParams();
  const redirectTo = search?.get('next') || '/';
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const result = register({ name, email, phone, password });
    if (!result.ok) {
      setError(result.error ?? 'Something went wrong.');
      return;
    }
    setStatus('success');
    window.setTimeout(() => router.push(redirectTo), 900);
  }

  if (status === 'success') {
    return (
      <AuthSuccessCard
        title="Account created"
        subtitle={`Welcome to 10X, ${name.split(' ')[0]}.`}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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

      <AuthField label="Phone number" htmlFor="reg-phone">
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

      <AuthField
        label="Password"
        htmlFor="reg-password"
        hint="Used only for account recovery. Sign-in is via email OTP."
      >
        <input
          id="reg-password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) setError('');
          }}
          placeholder="At least 6 characters"
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
        className="mt-2 w-full cursor-pointer px-6 py-3.5 font-quantico text-body-sm font-bold uppercase tracking-[0.18em] text-white shadow-elevated transition hover:opacity-90"
        style={authButtonStyle}
      >
        Create account
      </button>
    </form>
  );
}
