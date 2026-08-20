'use client';

import { useState, type ReactNode } from 'react';

/**
 * The one field style used across cart, checkout, auth and account.
 *
 * Squared corners, hairline border, ink on focus — matching the brand's 0px
 * radius rule. Defined once here so no screen drifts into its own look.
 */

export const labelCls =
  'mb-2 block font-quantico text-[11px] font-bold uppercase tracking-[0.14em] text-fg-muted';

export const inputBase =
  'w-full border-2 border-paper-200 bg-white dark:bg-paper py-3.5 font-pt text-body text-fg outline-none transition-colors placeholder:text-fg-subtle focus:border-accent disabled:cursor-not-allowed disabled:opacity-60 read-only:cursor-default read-only:bg-paper-50 dark:read-only:bg-paper-200 read-only:text-fg-muted read-only:focus:border-paper-200';

type FieldProps = {
  id: string;
  label: string;
  icon?: ReactNode;
  /** Rendered below the input in danger red; also sets aria-invalid. */
  error?: string;
  /** Rendered below the input in muted grey when there's no error. */
  hint?: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function Field({
  id,
  label,
  icon,
  error,
  hint,
  className = '',
  ...props
}: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className={labelCls}>
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fg-subtle">
            {icon}
          </span>
        )}
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? `${id}-msg` : undefined}
          className={`${inputBase} ${icon ? 'pl-12 pr-4' : 'px-4'} ${
            error ? 'border-danger focus:border-danger' : ''
          }`}
          {...props}
        />
      </div>
      {(error || hint) && (
        <p
          id={`${id}-msg`}
          className={`mt-1.5 font-pt text-caption ${
            error ? 'font-bold text-danger' : 'text-fg-subtle'
          }`}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}

/**
 * Password input with a reveal toggle.
 *
 * The toggle matters more than it looks: without it people either pick a
 * password short enough to type blind, or fail the form twice and leave.
 */
export function PasswordField({
  id,
  label,
  error,
  hint,
  className = '',
  ...props
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  className?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>) {
  const [shown, setShown] = useState(false);

  return (
    <div className={className}>
      <label htmlFor={id} className={labelCls}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={shown ? 'text' : 'password'}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? `${id}-msg` : undefined}
          className={`${inputBase} px-4 pr-12 ${
            error ? 'border-danger focus:border-danger' : ''
          }`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShown((v) => !v)}
          aria-label={shown ? 'Hide password' : 'Show password'}
          aria-pressed={shown}
          className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center text-fg-subtle transition-colors hover:text-fg"
        >
          {shown ? (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
      {(error || hint) && (
        <p
          id={`${id}-msg`}
          className={`mt-1.5 font-pt text-caption ${
            error ? 'font-bold text-danger' : 'text-fg-subtle'
          }`}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}

/** Same shell as Field, for a native select. */
export function SelectFieldNative({
  id,
  label,
  error,
  className = '',
  children,
  ...props
}: {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className={className}>
      <label htmlFor={id} className={labelCls}>
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          aria-invalid={error ? true : undefined}
          className={`${inputBase} appearance-none px-4 pr-11 ${
            error ? 'border-danger focus:border-danger' : ''
          }`}
          {...props}
        >
          {children}
        </select>
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-fg-subtle">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>
      {error && (
        <p className="mt-1.5 font-pt text-caption font-bold text-danger">{error}</p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------- icons */

export const IconUser = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const IconMail = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 6L2 7" />
  </svg>
);

export const IconPhone = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

export const IconPin = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const IconArrow = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export const IconCheck = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 12.5 10 17.5 19 7" />
  </svg>
);
