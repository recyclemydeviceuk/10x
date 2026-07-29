'use client';

import { useState, useTransition } from 'react';

import { updateOrderStatus } from '@/app/admin/actions';
import type { OrderStatus } from '@/lib/admin/types';

const OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'packed', label: 'Packed' },
  { value: 'dispatched', label: 'Dispatched' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'rto', label: 'Returned to origin' },
];

/**
 * Status is the one field an admin changes constantly, so it's an inline
 * control rather than a modal. Save only lights up once the value has actually
 * changed — no accidental no-op writes.
 */
export default function OrderStatusControl({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const [value, setValue] = useState<OrderStatus>(status);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  const dirty = value !== status;

  function save() {
    startTransition(async () => {
      await updateOrderStatus(orderId, value);
      setSaved(true);
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label htmlFor="order-status" className="sr-only">
        Order status
      </label>
      <select
        id="order-status"
        value={value}
        onChange={(e) => {
          setValue(e.target.value as OrderStatus);
          setSaved(false);
        }}
        className="cursor-pointer border border-paper-300 bg-white px-3 py-2.5 font-quantico text-[11px] font-bold uppercase tracking-[0.12em] text-ink outline-none transition-colors focus:border-ink"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={save}
        disabled={!dirty || pending}
        className="inline-flex cursor-pointer items-center gap-2 bg-ink px-4 py-2.5 font-quantico text-[11px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-ink-900 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {pending ? 'Saving…' : 'Update'}
      </button>

      {saved && !dirty && (
        <span className="type-b2 text-[#4EA310]" role="status">
          Saved
        </span>
      )}
    </div>
  );
}
