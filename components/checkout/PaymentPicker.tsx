'use client';

import type { PaymentMethod } from '@/lib/store/types';

import PaymentLogos from './PaymentLogos';

/**
 * Payment step.
 *
 * Two routes only:
 *   · Online — hands off to Cashfree Checkout, which presents UPI, cards,
 *     net banking and wallets itself. We deliberately do NOT rebuild that
 *     picker here: the gateway owns the method list, and duplicating it means
 *     maintaining two versions of the truth.
 *   · Cash on Delivery — one-time orders only. A subscription needs a mandate
 *     the gateway can charge every cycle, and cash can't provide one.
 */
export default function PaymentPicker({
  value,
  onChange,
  /** Subscriptions can't be paid in cash — COD is hidden entirely. */
  isSubscription,
  /** The store can switch cash on delivery off from the admin panel. */
  codEnabled = true,
}: {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  isSubscription: boolean;
  codEnabled?: boolean;
}) {
  return (
    <div className="space-y-3">
      <Option
        id="online"
        selected={value === 'online'}
        onSelect={() => onChange('online')}
        title="Pay Online"
        sub="UPI, cards, net banking & wallets — via Cashfree"
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
        }
      >
        <div className="border-t border-accent/30 px-5 pb-5 pt-4">
          <PaymentLogos />
          <p className="mt-3 font-pt text-caption text-fg-subtle">
            {isSubscription
              ? 'You’ll approve auto-pay once on the secure Cashfree window — UPI Autopay, card or bank. That approval pays for this box and every box after it.'
              : 'You’ll pick your exact method on the secure Cashfree window after placing the order.'}
          </p>
        </div>
      </Option>

      {isSubscription || !codEnabled ? (
        <p className="flex items-start gap-2.5 border-l-2 border-paper-300 bg-paper-50 px-4 py-3.5 font-pt text-body-sm text-fg-muted dark:bg-paper-200">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="mt-0.5 shrink-0">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>
            {isSubscription
              ? 'Subscriptions pay online so auto-pay is on from the first box — nothing to do at the door. You can switch it off any time from your account.'
              : 'Cash on delivery is paused right now. Paying online is the only option for this order.'}
          </span>
        </p>
      ) : (
        <Option
          id="cod"
          selected={value === 'cod'}
          onSelect={() => onChange('cod')}
          title="Cash on Delivery"
          sub="Pay in cash when your order arrives"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="2" y="6" width="20" height="12" rx="2" />
              <circle cx="12" cy="12" r="2.5" />
            </svg>
          }
        />
      )}
    </div>
  );
}

function Option({
  id,
  selected,
  onSelect,
  title,
  sub,
  icon,
  children,
}: {
  id: string;
  selected: boolean;
  onSelect: () => void;
  title: string;
  sub: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`border-2 transition-colors ${
        selected ? 'border-accent bg-accent/[0.06]' : 'border-paper-200'
      }`}
    >
      <label className="flex cursor-pointer items-center gap-4 px-5 py-4">
        <input
          type="radio"
          name="checkout-payment"
          value={id}
          checked={selected}
          onChange={onSelect}
          className="sr-only"
        />
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center border-2 ${
            selected ? 'border-accent text-accent-pressed dark:text-accent' : 'border-paper-200 text-fg-muted'
          }`}
        >
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-quantico text-body-sm font-bold uppercase tracking-wide text-fg">
            {title}
          </span>
          <span className="mt-0.5 block font-pt text-caption text-fg-muted">{sub}</span>
        </span>
        <span
          aria-hidden
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
            selected ? 'border-accent' : 'border-paper-300'
          }`}
        >
          {selected && <span className="h-2.5 w-2.5 rounded-full bg-accent" />}
        </span>
      </label>
      {selected && children}
    </div>
  );
}
