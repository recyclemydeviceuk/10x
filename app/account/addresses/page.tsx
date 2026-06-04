'use client';

import { useEffect, useState } from 'react';

import {
  getAddresses,
  upsertAddress,
  removeAddress,
  setDefaultAddress,
  type Address,
} from '../../../components/account/accountData';

const inputCls =
  'w-full border-2 border-paper-200 bg-white px-4 py-2.5 font-pt text-body text-fg outline-none transition-colors placeholder:text-fg-subtle focus:border-brand-blue';

type FormState = {
  id?: string;
  label: string; name: string; line1: string; line2: string;
  city: string; state: string; pincode: string; phone: string;
};
const EMPTY: FormState = { label: 'Home', name: '', line1: '', line2: '', city: '', state: '', pincode: '', phone: '' };

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setAddresses(getAddresses());
  }, []);

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((f) => (f ? { ...f, [k]: v } : f));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    if (!form.name.trim() || !form.line1.trim() || !form.city.trim()) {
      setError('Please fill name, address and city.');
      return;
    }
    if (!/^\d{6}$/.test(form.pincode.trim())) {
      setError('Enter a valid 6-digit pincode.');
      return;
    }
    setAddresses(
      upsertAddress({
        id: form.id,
        label: form.label.trim() || 'Home',
        name: form.name.trim(),
        line1: form.line1.trim(),
        line2: form.line2.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim(),
        phone: form.phone.trim(),
      }),
    );
    setForm(null);
    setError('');
  }

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-quantico text-display-md font-bold uppercase tracking-tight text-ink">Addresses</h2>
          <p className="mt-1 font-pt text-body text-fg-muted">Saved delivery addresses for faster checkout.</p>
        </div>
        {!form && (
          <button type="button" onClick={() => { setForm({ ...EMPTY }); setError(''); }} className="cursor-pointer bg-accent px-6 py-3 font-quantico text-body-sm font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-accent-hover">
            + Add address
          </button>
        )}
      </header>

      {form && (
        <form onSubmit={onSubmit} className="mb-8 space-y-4 border border-paper-200 bg-white p-6 shadow-card md:p-8">
          <p className="font-quantico text-body font-bold uppercase tracking-wide text-ink">{form.id ? 'Edit address' : 'New address'}</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input aria-label="Label" placeholder="Label (Home / Work)" value={form.label} onChange={(e) => set('label', e.target.value)} className={inputCls} />
            <input aria-label="Full name" placeholder="Full name" value={form.name} onChange={(e) => set('name', e.target.value)} className={inputCls} autoComplete="name" />
          </div>
          <input aria-label="Address line 1" placeholder="Address line 1" value={form.line1} onChange={(e) => set('line1', e.target.value)} className={inputCls} autoComplete="address-line1" />
          <input aria-label="Address line 2" placeholder="Address line 2 (optional)" value={form.line2} onChange={(e) => set('line2', e.target.value)} className={inputCls} autoComplete="address-line2" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <input aria-label="City" placeholder="City" value={form.city} onChange={(e) => set('city', e.target.value)} className={inputCls} autoComplete="address-level2" />
            <input aria-label="State" placeholder="State" value={form.state} onChange={(e) => set('state', e.target.value)} className={inputCls} autoComplete="address-level1" />
            <input aria-label="Pincode" placeholder="Pincode" inputMode="numeric" value={form.pincode} onChange={(e) => set('pincode', e.target.value)} className={inputCls} autoComplete="postal-code" />
          </div>
          <input aria-label="Phone" placeholder="Phone" value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputCls} autoComplete="tel" />
          {error && <p role="alert" className="font-pt text-body-sm text-danger">{error}</p>}
          <div className="flex items-center gap-3 pt-1">
            <button type="submit" className="cursor-pointer bg-accent px-7 py-3 font-quantico text-body-sm font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-accent-hover">Save address</button>
            <button type="button" onClick={() => { setForm(null); setError(''); }} className="cursor-pointer px-3 py-3 font-quantico text-body-sm font-bold uppercase tracking-[0.16em] text-fg-muted transition-colors hover:text-ink">Cancel</button>
          </div>
        </form>
      )}

      {addresses === null ? (
        <p className="font-pt text-body text-fg-muted">Loading…</p>
      ) : addresses.length === 0 && !form ? (
        <div className="border border-paper-200 bg-white p-10 text-center shadow-card">
          <p className="font-quantico text-body-lg font-bold uppercase tracking-wide text-ink">No addresses saved</p>
          <p className="mx-auto mt-2 max-w-sm font-pt text-body text-fg-muted">Add a delivery address to speed up your next 10X order.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((a) => (
            <li key={a.id} className="flex flex-col border border-paper-200 bg-white p-5 shadow-card">
              <div className="mb-2 flex items-center gap-2">
                <span className="font-quantico text-body-sm font-bold uppercase tracking-wide text-ink">{a.label}</span>
                {a.isDefault && <span className="bg-accent px-2 py-0.5 font-quantico text-[9px] font-bold uppercase tracking-wider text-ink">Default</span>}
              </div>
              <p className="font-pt text-body-sm text-fg">{a.name}</p>
              <p className="font-pt text-body-sm text-fg-muted">{a.line1}{a.line2 ? `, ${a.line2}` : ''}</p>
              <p className="font-pt text-body-sm text-fg-muted">{a.city}{a.state ? `, ${a.state}` : ''} — {a.pincode}</p>
              {a.phone && <p className="font-pt text-body-sm text-fg-muted">{a.phone}</p>}
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-paper-200 pt-3 font-quantico text-caption font-bold uppercase tracking-wider">
                <button type="button" onClick={() => { setForm({ id: a.id, label: a.label, name: a.name, line1: a.line1, line2: a.line2 ?? '', city: a.city, state: a.state, pincode: a.pincode, phone: a.phone }); setError(''); }} className="cursor-pointer text-brand-blue transition-opacity hover:opacity-70">Edit</button>
                {!a.isDefault && <button type="button" onClick={() => setAddresses(setDefaultAddress(a.id))} className="cursor-pointer text-fg-muted transition-colors hover:text-ink">Set default</button>}
                <button type="button" onClick={() => setAddresses(removeAddress(a.id))} className="cursor-pointer text-danger transition-opacity hover:opacity-70">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
