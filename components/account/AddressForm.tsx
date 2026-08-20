'use client';

import { useState } from 'react';

import { Field, IconPhone, IconUser, SelectFieldNative } from '@/components/ui/Field';
import type { Address, AddressDraft } from '@/lib/store/types';

/** Indian states and union territories, for the delivery form. */
const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands',
  'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi',
  'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

const LABELS = ['Home', 'Work', 'Other'] as const;

type Errors = Partial<Record<keyof AddressDraft, string>>;

const EMPTY: AddressDraft = {
  label: 'Home',
  fullName: '',
  phone: '',
  house: '',
  street: '',
  landmark: '',
  city: '',
  state: 'Maharashtra',
  pincode: '',
  isDefault: false,
};

/**
 * Create or edit a delivery address.
 *
 * Used inline in checkout ("Add new address") and on the account addresses
 * page, so it owns validation but not persistence — the caller decides what
 * `onSave` does.
 */
export default function AddressForm({
  initial,
  onSave,
  onCancel,
  saveLabel = 'Save Address',
  /** Prefill name/phone from the signed-in profile for a first address. */
  prefill,
}: {
  initial?: Address;
  onSave: (draft: AddressDraft) => void;
  onCancel: () => void;
  saveLabel?: string;
  prefill?: { name?: string; phone?: string };
}) {
  const [form, setForm] = useState<AddressDraft>(() => {
    if (initial) {
      const { id: _id, ...rest } = initial;
      return rest;
    }
    return {
      ...EMPTY,
      fullName: prefill?.name ?? '',
      phone: prefill?.phone ?? '',
    };
  });
  const [errors, setErrors] = useState<Errors>({});
  const [geo, setGeo] = useState<'idle' | 'locating' | 'error'>('idle');

  function set<K extends keyof AddressDraft>(key: K, value: AddressDraft[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate() {
    const next: Errors = {};
    if (form.fullName.trim().length < 2) next.fullName = 'Enter the recipient’s name.';
    if (!/^(\+?91[\s-]?)?[6-9]\d{9}$/.test(form.phone.replace(/[\s-]/g, '')))
      next.phone = 'Enter a valid 10-digit mobile number.';
    if (!form.house.trim()) next.house = 'Enter your house / flat number.';
    if (!form.street.trim()) next.street = 'Enter your street or area.';
    if (!form.city.trim()) next.city = 'Enter your city.';
    if (!/^\d{6}$/.test(form.pincode.trim())) next.pincode = 'Enter a valid 6-digit pin code.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSave(form);
  }

  /** Fill city / pincode / area from the browser's location. */
  function detect() {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return setGeo('error');
    setGeo('locating');
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=en`,
          );
          const d = await res.json();
          setForm((f) => ({
            ...f,
            street: f.street || [d.locality, d.city].filter(Boolean).join(', '),
            city: f.city || d.city || d.locality || '',
            state: d.principalSubdivision && STATES.includes(d.principalSubdivision)
              ? d.principalSubdivision
              : f.state,
            pincode:
              f.pincode || (d.postcode ? String(d.postcode).replace(/\D/g, '').slice(0, 6) : ''),
          }));
          setGeo('idle');
        } catch {
          // Coordinates resolved but the lookup failed — let them type it in.
          setGeo('idle');
        }
      },
      () => setGeo('error'),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      {/* Label picker */}
      <div>
        <p className="mb-2 block font-quantico text-[11px] font-bold uppercase tracking-[0.14em] text-fg-muted">
          Save As
        </p>
        <div className="flex gap-2">
          {LABELS.map((l) => {
            const active = form.label === l;
            return (
              <button
                key={l}
                type="button"
                onClick={() => set('label', l)}
                aria-pressed={active}
                className={`cursor-pointer border-2 px-5 py-2.5 font-quantico text-caption font-bold uppercase tracking-[0.12em] transition-colors ${
                  active
                    ? 'border-accent bg-accent text-ink'
                    : 'border-paper-200 text-fg-muted hover:border-fg hover:text-fg'
                }`}
              >
                {l}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="ad-name"
          label="Full Name"
          icon={IconUser}
          value={form.fullName}
          autoComplete="name"
          placeholder="e.g. Arjun Mehta"
          error={errors.fullName}
          onChange={(e) => set('fullName', e.target.value)}
        />
        <Field
          id="ad-phone"
          label="Mobile Number"
          icon={IconPhone}
          type="tel"
          value={form.phone}
          autoComplete="tel"
          placeholder="e.g. 98765 43210"
          error={errors.phone}
          onChange={(e) => set('phone', e.target.value)}
        />
      </div>

      {/* Use my location */}
      <button
        type="button"
        onClick={detect}
        disabled={geo === 'locating'}
        className="inline-flex cursor-pointer items-center gap-2 border-2 border-paper-200 px-4 py-2.5 font-quantico text-caption font-bold uppercase tracking-[0.12em] text-fg transition-colors hover:border-accent disabled:opacity-60"
      >
        {geo === 'locating' ? (
          <>
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-fg-subtle border-t-fg" />
            Locating…
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            Use my location
          </>
        )}
      </button>
      {geo === 'error' && (
        <p className="font-pt text-caption font-bold text-danger">
          Couldn&rsquo;t access your location. Please fill the address in below.
        </p>
      )}

      <Field
        id="ad-house"
        label="House / Flat No., Building"
        value={form.house}
        autoComplete="address-line1"
        placeholder="e.g. Flat 902, Tower B"
        error={errors.house}
        onChange={(e) => set('house', e.target.value)}
      />
      <Field
        id="ad-street"
        label="Street / Area"
        value={form.street}
        autoComplete="address-line2"
        placeholder="e.g. Senapati Bapat Road"
        error={errors.street}
        onChange={(e) => set('street', e.target.value)}
      />
      <Field
        id="ad-landmark"
        label="Landmark (optional)"
        value={form.landmark ?? ''}
        placeholder="e.g. Near Kamala Mills"
        onChange={(e) => set('landmark', e.target.value)}
      />

      <div className="grid gap-5 sm:grid-cols-3">
        <Field
          id="ad-city"
          label="City"
          value={form.city}
          autoComplete="address-level2"
          placeholder="e.g. Mumbai"
          error={errors.city}
          onChange={(e) => set('city', e.target.value)}
        />
        <SelectFieldNative
          id="ad-state"
          label="State"
          value={form.state}
          onChange={(e) => set('state', e.target.value)}
        >
          {STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </SelectFieldNative>
        <Field
          id="ad-pincode"
          label="Pin Code"
          inputMode="numeric"
          maxLength={6}
          value={form.pincode}
          autoComplete="postal-code"
          placeholder="e.g. 400013"
          error={errors.pincode}
          onChange={(e) => set('pincode', e.target.value.replace(/\D/g, ''))}
        />
      </div>

      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={form.isDefault}
          onChange={(e) => set('isDefault', e.target.checked)}
          className="h-4 w-4 cursor-pointer accent-accent"
        />
        <span className="font-pt text-body-sm text-fg-muted">
          Make this my default delivery address
        </span>
      </label>

      <div className="flex flex-wrap gap-3 pt-1">
        <button
          type="submit"
          className="cursor-pointer bg-accent px-7 py-3.5 font-quantico text-body-sm font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-accent-hover"
        >
          {saveLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer border-2 border-paper-200 px-7 py-3.5 font-quantico text-body-sm font-bold uppercase tracking-[0.14em] text-fg-muted transition-colors hover:border-fg hover:text-fg"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
