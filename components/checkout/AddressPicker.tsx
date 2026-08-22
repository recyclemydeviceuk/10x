'use client';

import { useEffect, useRef, useState } from 'react';

import AddressForm from '@/components/account/AddressForm';
import { useAccountData } from '@/components/account/AccountDataContext';
import { useAuth } from '@/components/account/AuthContext';
import type { Address } from '@/lib/store/types';

/**
 * Delivery address, as one compact selector.
 *
 * The chosen address is shown in a single card; tapping it opens the list of
 * saved addresses (default first) plus "Add a new address". A customer with
 * nothing saved sees the form straight away — an empty list helps nobody.
 */
export default function AddressPicker({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const { addresses, addAddress } = useAccountData();
  const { customer } = useAuth();
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  const selected = addresses.find((a) => a.id === selectedId) ?? null;
  const showForm = adding || addresses.length === 0;

  // Close on outside click / Escape — the list is a menu, not a page section.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (showForm) {
    return (
      <div>
        {addresses.length > 0 && (
          <div className="mb-5 flex items-center justify-between">
            <p className="font-quantico text-caption font-bold uppercase tracking-[0.14em] text-fg">New address</p>
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="cursor-pointer font-pt text-caption text-fg-muted underline underline-offset-2 hover:text-fg"
            >
              Use a saved address
            </button>
          </div>
        )}
        <AddressForm
          prefill={{ name: customer?.name, phone: customer?.phone }}
          saveLabel="Save & deliver here"
          onSave={async (draft) => {
            const created = await addAddress(draft);
            if (!created) return;
            onSelect(created.id);
            setAdding(false);
            setOpen(false);
          }}
          onCancel={addresses.length > 0 ? () => setAdding(false) : undefined}
        />
      </div>
    );
  }

  return (
    <div ref={wrap} className="relative">
      {/* Trigger: the address that will be used */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full cursor-pointer items-start gap-4 border-2 px-5 py-4 text-left transition-colors ${
          open ? 'border-accent' : 'border-paper-200 hover:border-fg-subtle'
        }`}
      >
        <span className="min-w-0 flex-1">
          {selected ? (
            <AddressLine address={selected} />
          ) : (
            <span className="font-pt text-body-sm text-fg-muted">Choose a delivery address</span>
          )}
        </span>
        <span className="mt-1 flex shrink-0 items-center gap-2 font-quantico text-[10px] font-bold uppercase tracking-[0.12em] text-fg-muted">
          Change
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className={`transition-transform ${open ? 'rotate-180' : ''}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {/* Menu */}
      {open && (
        <ul
          role="listbox"
          aria-label="Saved addresses"
          className="absolute left-0 right-0 z-30 mt-2 max-h-96 overflow-auto border-2 border-paper-200 bg-paper shadow-xl"
        >
          {addresses.map((address) => {
            const isSelected = address.id === selectedId;
            return (
              <li key={address.id} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(address.id);
                    setOpen(false);
                  }}
                  className={`flex w-full cursor-pointer items-start gap-4 border-b border-paper-200 px-5 py-4 text-left transition-colors hover:bg-paper-50 dark:hover:bg-paper-200 ${
                    isSelected ? 'bg-accent/[0.06]' : ''
                  }`}
                >
                  <span
                    aria-hidden
                    className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                      isSelected ? 'border-accent' : 'border-paper-300'
                    }`}
                  >
                    {isSelected && <span className="h-2 w-2 rounded-full bg-accent" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <AddressLine address={address} />
                  </span>
                </button>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={() => {
                setAdding(true);
                setOpen(false);
              }}
              className="flex w-full cursor-pointer items-center gap-3 px-5 py-4 text-left font-quantico text-caption font-bold uppercase tracking-[0.12em] text-fg transition-colors hover:bg-paper-50 dark:hover:bg-paper-200"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden className="text-accent-pressed dark:text-accent">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add a new address
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}

/** One address, in two lines. */
function AddressLine({ address }: { address: Address }) {
  return (
    <>
      <span className="flex flex-wrap items-center gap-2">
        <span className="font-quantico text-body-sm font-bold uppercase tracking-wide text-fg">{address.label}</span>
        {address.isDefault && (
          <span className="bg-paper-200 px-1.5 py-0.5 font-quantico text-[9px] font-bold uppercase tracking-[0.1em] text-fg-muted dark:bg-paper-300">
            Default
          </span>
        )}
        <span className="font-pt text-caption text-fg-subtle">· {address.fullName}, {address.phone}</span>
      </span>
      <span className="mt-1 block font-pt text-body-sm leading-relaxed text-fg-muted">
        {address.house}, {address.street}
        {address.landmark ? `, ${address.landmark}` : ''}, {address.city}, {address.state} {address.pincode}
      </span>
    </>
  );
}
