'use client';

import { useEffect, useRef, useState } from 'react';

import { api, firstMessage } from '@/lib/api/storefront';
import { inr } from '@/lib/store/types';

import { useAuth } from './AuthContext';

// =========================================================
// Return & refund — shown on delivered orders.
//
// Files against the customer's own session on the 10X API, so
// the request is bound to the account rather than to a
// guessable order reference. The team reviews it in the admin
// panel, Shiprocket collects the parcel, and the refund follows
// on the same record.
// =========================================================

const REASONS = [
  'Damaged in transit',
  'Wrong item received',
  'Quality not as expected',
  'Allergic reaction / medical',
  'Ordered by mistake',
  'Other',
];

type ApiReturn = {
  reference: string;
  orderReference: string;
  reason: string;
  status: string;
  rejectReason: string;
  amount: number;
  timeline: { stage: string; at: string }[];
  createdAt: string;
};

const STATUS_LABEL: Record<string, string> = {
  requested: 'Requested',
  approved: 'Pickup arranged',
  received: 'Received at warehouse',
  refunded: 'Refunded',
  rejected: 'Rejected',
};

const STATUS_COPY: Record<string, string> = {
  requested: 'We’ve received your request and will review it within 24 hours.',
  approved: 'Approved — our courier partner will pick the parcel up from your delivery address. Keep it packed.',
  received: 'Your parcel has reached our warehouse. The refund is being processed.',
  refunded: 'Refunded. Money returns to your original payment method within 5–7 working days.',
  rejected: 'This request was declined.',
};

export default function ReturnRequestSection({
  orderReference,
  orderTotal,
  paymentMethod,
}: {
  orderReference: string;
  orderTotal: number;
  paymentMethod: 'online' | 'cod';
}) {
  const { customer } = useAuth();
  const [existing, setExisting] = useState<ApiReturn | null>(null);
  const [checked, setChecked] = useState(false);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Does this order already have a return on it? The list is the customer's
  // own, so there is nothing to look up by reference.
  useEffect(() => {
    if (!customer) return;
    let alive = true;
    api<{ returns: ApiReturn[] }>('/api/v1/me/returns').then((result) => {
      if (!alive) return;
      if (result.ok) {
        setExisting(result.data.returns.find((r) => r.orderReference === orderReference) ?? null);
      }
      setChecked(true);
    });
    return () => {
      alive = false;
    };
  }, [customer, orderReference]);

  if (!customer) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!customer) return;
    setSubmitting(true);
    setError(null);

    const body = new FormData();
    body.append('orderReference', orderReference);
    body.append('reason', reason);
    body.append('description', description);
    for (const photo of photos) body.append('photos', photo);

    const result = await api<{ return: { reference: string; status: string } }>('/api/v1/me/returns', {
      method: 'POST',
      form: body,
    });
    setSubmitting(false);

    if (!result.ok) {
      setError(firstMessage(result));
      return;
    }
    // Re-read rather than guessing at the record we just created.
    const listed = await api<{ returns: ApiReturn[] }>('/api/v1/me/returns');
    if (listed.ok) {
      setExisting(listed.data.returns.find((r) => r.orderReference === orderReference) ?? null);
    }
    setOpen(false);
  }

  // Don't offer a return until we know whether one is already in flight —
  // showing the form and then replacing it reads as a failed submission.
  if (!checked) return null;

  /* ------------------------------------------ existing return: status card */
  if (existing) {
    return (
      <section aria-labelledby="od-return" className="mt-10">
        <h3 id="od-return" className="font-quantico text-body-sm font-bold uppercase tracking-[0.14em] text-fg">
          Return &amp; Refund
        </h3>
        <div className="mt-4 border-2 border-paper-200 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-pt text-body-sm font-bold text-fg">{existing.reference}</p>
            <span className="border-2 border-accent px-3 py-1 font-quantico text-caption font-bold uppercase tracking-[0.12em] text-fg">
              {STATUS_LABEL[existing.status] ?? existing.status}
            </span>
          </div>
          <p className="mt-3 font-pt text-body-sm leading-relaxed text-fg-muted">
            {STATUS_COPY[existing.status] ?? 'We’re on it.'}
            {existing.status === 'rejected' && existing.rejectReason ? ` Reason: ${existing.rejectReason}` : ''}
          </p>
          <p className="mt-2 font-pt text-caption text-fg-subtle">
            {inr(existing.amount)} · filed{' '}
            {new Date(existing.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        </div>
      </section>
    );
  }

  /* -------------------------------------------------- no return yet: form */
  return (
    <section aria-labelledby="od-return" className="mt-10">
      <h3 id="od-return" className="font-quantico text-body-sm font-bold uppercase tracking-[0.14em] text-fg">
        Return &amp; Refund
      </h3>

      {!open ? (
        <div className="mt-4">
          <p className="font-pt text-body-sm text-fg-muted">
            Something wrong with this order? Request a return — we review within 24 hours, arrange a doorstep
            pickup, and refund {inr(orderTotal)}{' '}
            {paymentMethod === 'online' ? 'to your original payment method' : 'once the parcel reaches us'}.
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-4 cursor-pointer border-2 border-paper-200 px-6 py-3.5 font-quantico text-caption font-bold uppercase tracking-[0.14em] text-fg transition-colors hover:border-accent"
          >
            Request a return
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-4 border-2 border-paper-200 p-5">
          {/* Reason */}
          <label className="block font-quantico text-caption font-bold uppercase tracking-[0.14em] text-fg-muted">
            Why are you returning it?
          </label>
          <div className="mt-3 flex flex-wrap gap-2">
            {REASONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setReason(r)}
                className={`cursor-pointer border-2 px-4 py-2 font-pt text-body-sm transition-colors ${
                  reason === r ? 'border-accent bg-accent/10 font-bold text-fg' : 'border-paper-200 text-fg-muted hover:border-fg'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Description */}
          <label htmlFor="return-desc" className="mt-6 block font-quantico text-caption font-bold uppercase tracking-[0.14em] text-fg-muted">
            Tell us what happened
          </label>
          <textarea
            id="return-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="The more detail, the faster we can approve it — what's wrong, how many sachets are affected, and so on."
            className="mt-3 w-full border-2 border-paper-200 bg-paper px-4 py-3 font-pt text-body-sm text-fg outline-none transition-colors placeholder:text-fg-subtle focus:border-accent"
          />
          <p className="mt-1 font-pt text-caption text-fg-subtle">{description.trim().length}/20 characters minimum</p>

          {/* Photos */}
          <label className="mt-5 block font-quantico text-caption font-bold uppercase tracking-[0.14em] text-fg-muted">
            Photos (optional, up to 4)
          </label>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            {photos.map((photo, i) => (
              <span key={i} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={URL.createObjectURL(photo)} alt="" className="h-20 w-20 border-2 border-paper-200 object-cover" />
                <button
                  type="button"
                  aria-label="Remove photo"
                  onClick={() => setPhotos((cur) => cur.filter((_, x) => x !== i))}
                  className="absolute -right-2 -top-2 flex h-5 w-5 cursor-pointer items-center justify-center border-2 border-paper-200 bg-paper font-pt text-caption font-bold text-fg hover:border-danger hover:text-danger"
                >
                  ×
                </button>
              </span>
            ))}
            {photos.length < 4 ? (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex h-20 w-20 cursor-pointer items-center justify-center border-2 border-dashed border-paper-300 font-pt text-2xl text-fg-subtle transition-colors hover:border-accent hover:text-fg"
              >
                +
              </button>
            ) : null}
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={(e) => {
                const picked = Array.from(e.target.files ?? []);
                setPhotos((cur) => [...cur, ...picked].slice(0, 4));
                e.target.value = '';
              }}
            />
          </div>

          {error ? (
            <p className="mt-4 border-2 border-danger/40 bg-danger/[0.06] px-4 py-3 font-pt text-body-sm text-danger">{error}</p>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={submitting || !reason || description.trim().length < 20}
              className="cursor-pointer bg-accent px-6 py-3.5 font-quantico text-caption font-bold uppercase tracking-[0.14em] text-accent-ink transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting ? 'Submitting…' : 'Submit return request'}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="cursor-pointer border-2 border-paper-200 px-6 py-3.5 font-quantico text-caption font-bold uppercase tracking-[0.14em] text-fg transition-colors hover:border-fg"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
