'use client';

import { useState } from 'react';

import { useAccountData } from './AccountDataContext';
import { useAuth } from './AuthContext';
import AddressForm from './AddressForm';

/** Saved delivery addresses — add, edit, set default, delete. */
export default function AddressesView() {
  const { customer } = useAuth();
  const {
    addresses,
    loading,
    addAddress,
    updateAddress,
    removeAddress,
    makeDefaultAddress,
  } = useAccountData();

  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /** Every write is a round trip now — say so when one is refused. */
  async function save(action: () => Promise<{ ok: boolean; message?: string }>) {
    setError(null);
    const result = await action();
    if (!result.ok) setError(result.message ?? 'We couldn’t save that address.');
    return result.ok;
  }

  if (loading) {
    return <div className="h-72 w-full animate-pulse bg-paper-200" />;
  }

  const editing = addresses.find((a) => a.id === editingId) ?? null;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-condensed text-2xl font-black uppercase italic tracking-tight text-fg">
          Addresses
        </h2>
        {!adding && !editing && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="shrink-0 cursor-pointer bg-accent px-5 py-3 font-quantico text-caption font-bold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-accent-hover"
          >
            Add new
          </button>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-5 border-2 border-danger/40 bg-danger/[0.06] px-4 py-3 font-pt text-body-sm font-bold text-danger">
          {error}
        </p>
      )}

      {/* Add form */}
      {adding && (
        <div className="mt-7 border-2 border-paper-200 p-6">
          <h3 className="mb-5 font-quantico text-body-sm font-bold uppercase tracking-[0.14em] text-fg">
            New Address
          </h3>
          <AddressForm
            prefill={{ name: customer?.name, phone: customer?.phone }}
            onSave={async (draft) => {
              setError(null);
              const created = await addAddress(draft);
              if (!created) return setError('We couldn’t save that address. Try again in a moment.');
              setAdding(false);
            }}
            onCancel={() => setAdding(false)}
          />
        </div>
      )}

      {/* Edit form */}
      {editing && (
        <div className="mt-7 border-2 border-accent p-6">
          <h3 className="mb-5 font-quantico text-body-sm font-bold uppercase tracking-[0.14em] text-fg">
            Edit Address
          </h3>
          <AddressForm
            initial={editing}
            saveLabel="Save Changes"
            onSave={async (draft) => {
              if (await save(() => updateAddress(editing.id, draft))) setEditingId(null);
            }}
            onCancel={() => setEditingId(null)}
          />
        </div>
      )}

      {/* Empty */}
      {addresses.length === 0 && !adding && (
        <div className="mt-7 border-2 border-dashed border-paper-300 px-6 py-14 text-center">
          <h3 className="font-condensed text-xl font-black uppercase italic tracking-tight text-fg">
            No Saved Addresses
          </h3>
          <p className="mx-auto mt-3 max-w-sm font-pt text-body text-fg-muted">
            Save an address now and checkout becomes one tap next time.
          </p>
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="mt-7 cursor-pointer bg-accent px-7 py-3.5 font-quantico text-body-sm font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-accent-hover"
          >
            Add an address
          </button>
        </div>
      )}

      {/* List */}
      {addresses.length > 0 && (
        <ul className="mt-7 grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <li
              key={address.id}
              className={`flex flex-col border-2 p-5 ${
                address.isDefault ? 'border-accent' : 'border-paper-200'
              }`}
            >
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-quantico text-body-sm font-bold uppercase tracking-wide text-fg">
                  {address.label}
                </span>
                {address.isDefault && (
                  <span className="bg-accent px-2 py-0.5 font-quantico text-[10px] font-bold uppercase tracking-[0.1em] text-ink">
                    Default
                  </span>
                )}
              </div>

              <p className="mt-3 font-pt text-body-sm font-bold text-fg">
                {address.fullName}
              </p>
              <p className="mt-1 flex-1 font-pt text-body-sm leading-relaxed text-fg-muted">
                {address.house}, {address.street}
                {address.landmark ? `, ${address.landmark}` : ''}
                <br />
                {address.city}, {address.state} {address.pincode}
              </p>
              <p className="mt-1.5 font-pt text-caption text-fg-subtle">{address.phone}</p>

              <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-paper-200 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(address.id);
                    setAdding(false);
                  }}
                  className="cursor-pointer font-quantico text-caption font-bold uppercase tracking-[0.12em] text-fg-muted underline decoration-paper-300 underline-offset-4 transition-colors hover:text-fg"
                >
                  Edit
                </button>
                {!address.isDefault && (
                  <>
                    <button
                      type="button"
                      onClick={() => void save(() => makeDefaultAddress(address.id))}
                      className="cursor-pointer font-quantico text-caption font-bold uppercase tracking-[0.12em] text-fg-muted underline decoration-paper-300 underline-offset-4 transition-colors hover:text-fg"
                    >
                      Set default
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(address.id)}
                      className="cursor-pointer font-quantico text-caption font-bold uppercase tracking-[0.12em] text-fg-muted underline decoration-paper-300 underline-offset-4 transition-colors hover:text-danger"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>

              {confirmDelete === address.id && (
                <div className="mt-4 border-2 border-danger/40 bg-danger/[0.06] p-4">
                  <p className="font-pt text-body-sm text-fg">
                    Delete this address?
                  </p>
                  <div className="mt-3 flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        void save(() => removeAddress(address.id));
                        setConfirmDelete(null);
                      }}
                      className="cursor-pointer bg-danger px-4 py-2.5 font-quantico text-[10px] font-bold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90"
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(null)}
                      className="cursor-pointer border-2 border-paper-200 px-4 py-2.5 font-quantico text-[10px] font-bold uppercase tracking-[0.12em] text-fg transition-colors hover:border-fg"
                    >
                      Keep
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
