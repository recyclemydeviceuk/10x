'use client';

import type { PaymentMethod } from '@/lib/store/types';

import PaymentLogos from './PaymentLogos';

/**
 * Payment method — two small cards side by side. The exact instrument (UPI,
 * card, net banking) is chosen on Cashfree's own window, so there is
 * nothing to expand here; one line under the cards says what happens next.
 */
export default function PaymentPicker({
  value,
  onChange,
  isSubscription,
  codEnabled,
}: {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
  isSubscription: boolean;
  codEnabled: boolean;
}) {
  const codAvailable = codEnabled && !isSubscription;

  return (
    <div>
      <div className={`grid gap-3 ${codAvailable ? 'grid-cols-2' : 'grid-cols-1 sm:max-w-xs'}`}>
        <MiniCard
          id="online"
          selected={value === 'online'}
          onSelect={() => onChange('online')}
          title="Pay Online"
          sub="UPI · Cards · Net banking"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          }
        />
        {codAvailable && (
          <MiniCard
            id="cod"
            selected={value === 'cod'}
            onSelect={() => onChange('cod')}
            title="Cash on Delivery"
            sub="Pay when it arrives"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <circle cx="12" cy="12" r="2.5" />
              </svg>
            }
          />
        )}
      </div>

      {value === 'online' && (
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        <PaymentLogos />
        <p className="font-pt text-caption text-fg-subtle">
          {isSubscription
              ? 'One approval on the secure Cashfree window pays for this box and sets auto-pay for every box after it. Switch it off any time from your account.'
              : !codEnabled
                ? 'Cash on delivery is paused right now. You’ll pick your exact method on the secure Cashfree window.'
                : 'You’ll pick your exact method on the secure Cashfree window after placing the order.'}
        </p>
      </div>
      )}
    </div>
  );
}

function MiniCard({
  id,
  selected,
  onSelect,
  title,
  sub,
  icon,
}: {
  id: string;
  selected: boolean;
  onSelect: () => void;
  title: string;
  sub: string;
  icon: React.ReactNode;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 border-2 px-4 py-3.5 transition-colors ${
        selected ? 'border-accent bg-accent/[0.06]' : 'border-paper-200 hover:border-fg-subtle'
      }`}
    >
      <input type="radio" name="checkout-payment" value={id} checked={selected} onChange={onSelect} className="sr-only" />
      <span className={`shrink-0 ${selected ? 'text-accent-pressed dark:text-accent' : 'text-fg-muted'}`}>{icon}</span>
      <span className="min-w-0">
        <span className="block font-quantico text-caption font-bold uppercase tracking-wide text-fg">{title}</span>
        <span className="mt-0.5 block truncate font-pt text-[11px] text-fg-muted">{sub}</span>
      </span>
    </label>
  );
}
