'use client';

import { useState } from 'react';

import { inr } from '@/lib/store/types';

import { useCart } from './CartContext';

/**
 * Coupon entry.
 *
 * Two states: an input with an Apply action, or the applied chip with what it
 * saved and a way to drop it. Suggested codes sit underneath so nobody has to
 * go hunting for one — a promo the customer can't find is a promo that doesn't
 * work; they come from the store's own coupons, so what is offered here is
 * whatever the team is currently running.
 *
 * The API validates and prices the code. Nothing here decides a discount.
 */
export default function CouponField() {
  const { coupon, discount, couponNotice, applyCoupon, removeCoupon } = useCart();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);

  async function apply(raw: string) {
    setError('');
    setBusy(true);
    const result = await applyCoupon(raw);
    setBusy(false);
    if (!result.ok) return setError(result.message ?? 'That code didn’t work.');
    setCode('');
    setOpen(false);
  }

  /* ------------------------------------------------------------- applied */
  if (coupon) {
    return (
      <div className="flex items-center gap-3 border border-accent bg-accent/[0.07] px-4 py-3.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-accent text-ink">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12.5 10 17.5 19 7" />
          </svg>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-quantico text-body-sm font-bold uppercase tracking-wide text-fg">
            {coupon.code}
          </span>
          <span className="mt-0.5 block font-pt text-caption text-fg-muted">
            {inr(discount)} off{coupon.label ? ` · ${coupon.label}` : ''}
          </span>
        </span>
        <button
          type="button"
          onClick={removeCoupon}
          aria-label={`Remove coupon ${coupon.code}`}
          className="shrink-0 cursor-pointer font-quantico text-[10px] font-bold uppercase tracking-[0.12em] text-fg-muted underline decoration-paper-300 underline-offset-4 transition-colors hover:text-danger"
        >
          Remove
        </button>
      </div>
    );
  }

  /* -------------------------------------------------------------- closed */
  if (!open) {
    return (
      <>
      {couponNotice && (
        <p role="status" className="mb-2 font-pt text-caption font-bold text-danger">
          {couponNotice}
        </p>
      )}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full cursor-pointer items-center gap-3 border border-dashed border-paper-300 px-4 py-3.5 text-left transition-colors hover:border-accent"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center text-accent">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M20 12a2 2 0 0 1 2-2V7a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v3a2 2 0 0 1 0 4v3a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-3a2 2 0 0 1-2-2Z" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </span>
        <span className="flex-1 font-quantico text-body-sm font-bold uppercase tracking-wide text-fg">
          Have a coupon?
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0 text-fg-muted">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
      </>
    );
  }

  /* ---------------------------------------------------------------- open */
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          apply(code);
        }}
        className="flex gap-2"
      >
        <input
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            setError('');
          }}
          autoFocus
          placeholder="Enter code"
          aria-label="Coupon code"
          aria-invalid={error ? true : undefined}
          className={`min-w-0 flex-1 border bg-white px-4 py-3.5 font-quantico text-body-sm font-bold uppercase tracking-[0.1em] text-fg outline-none transition-colors placeholder:font-pt placeholder:font-normal placeholder:normal-case placeholder:tracking-normal placeholder:text-fg-subtle focus:border-accent dark:bg-paper ${
            error ? 'border-danger' : 'border-paper-300'
          }`}
        />
        <button
          type="submit"
          disabled={!code.trim() || busy}
          className="shrink-0 cursor-pointer bg-fg px-6 font-quantico text-[11px] font-bold uppercase tracking-[0.14em] text-paper transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {busy ? 'Checking…' : 'Apply'}
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-2 font-pt text-caption font-bold text-danger">
          {error}
        </p>
      )}

      {/* Codes are typed, never suggested — a coupon travels by campaign, not
          by being printed on the cart for everyone. */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setError('');
            setCode('');
          }}
          className="ml-auto cursor-pointer font-pt text-caption text-fg-subtle underline underline-offset-4 transition-colors hover:text-fg"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
