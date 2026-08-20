'use client';

import { useState } from 'react';

import AddressForm from '@/components/account/AddressForm';
import { useAccountData } from '@/components/account/AccountDataContext';
import { useAuth } from '@/components/account/AuthContext';
import type { Address } from '@/lib/store/types';

/**
 * Delivery address step.
 *
 * Saved addresses come first as selectable cards, with "Add new address"
 * underneath. A customer with nothing saved drops straight into the form —
 * an empty list of radio buttons helps nobody.
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
  const [adding, setAdding] = useState(false);

  const showForm = adding || addresses.length === 0;

  return (
    <div>
      {addresses.length > 0 && (
        <ul className="space-y-3">
          {addresses.map((address) => (
            <li key={address.id}>
              <AddressCard
                address={address}
                selected={address.id === selectedId}
                onSelect={() => onSelect(address.id)}
              />
            </li>
          ))}
        </ul>
      )}

      {showForm ? (
        <div className={addresses.length > 0 ? 'mt-6 border-t-2 border-paper-200 pt-6' : ''}>
          {addresses.length > 0 && (
            <h3 className="mb-5 font-quantico text-body-sm font-bold uppercase tracking-[0.14em] text-fg">
              New Address
            </h3>
          )}
          <AddressForm
            prefill={{ name: customer?.name, phone: customer?.phone }}
            saveLabel="Save & Use This Address"
            onSave={async (draft) => {
              const created = await addAddress(draft);
              if (!created) return;
              onSelect(created.id);
              setAdding(false);
            }}
            onCancel={() => setAdding(false)}
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 border-2 border-dashed border-paper-300 py-4 font-quantico text-body-sm font-bold uppercase tracking-[0.14em] text-fg-muted transition-colors hover:border-accent hover:text-fg"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add New Address
        </button>
      )}
    </div>
  );
}

/** One saved address, selectable. */
export function AddressCard({
  address,
  selected,
  onSelect,
}: {
  address: Address;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <label
      className={`flex cursor-pointer gap-4 border-2 p-5 transition-colors ${
        selected ? 'border-accent bg-accent/[0.06]' : 'border-paper-200 hover:border-fg-subtle'
      }`}
    >
      <input
        type="radio"
        name="checkout-address"
        checked={selected}
        onChange={onSelect}
        className="sr-only"
      />
      <span
        aria-hidden
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
          selected ? 'border-accent' : 'border-paper-300'
        }`}
      >
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-accent" />}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2.5">
          <span className="font-quantico text-body-sm font-bold uppercase tracking-wide text-fg">
            {address.label}
          </span>
          {address.isDefault && (
            <span className="bg-paper-200 px-2 py-0.5 font-quantico text-[10px] font-bold uppercase tracking-[0.1em] text-fg-muted dark:bg-paper-300">
              Default
            </span>
          )}
        </span>
        <span className="mt-2 block font-pt text-body-sm font-bold text-fg">
          {address.fullName}
        </span>
        <span className="mt-1 block font-pt text-body-sm leading-relaxed text-fg-muted">
          {address.house}, {address.street}
          {address.landmark ? `, ${address.landmark}` : ''}
          <br />
          {address.city}, {address.state} {address.pincode}
        </span>
        <span className="mt-1.5 block font-pt text-caption text-fg-subtle">
          {address.phone}
        </span>
      </span>
    </label>
  );
}
