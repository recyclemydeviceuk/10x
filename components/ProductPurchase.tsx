'use client';

import {
  TIER_LIST,
  TIERS,
  buildSelection,
  tierSavings,
  PRODUCT_DESCRIPTION,
  PRODUCT_PERFECT_FOR,
  SUBSCRIPTION_CADENCE,
  SUBSCRIPTION_NOTE,
} from './plans';
import { useCheckout } from './CheckoutContext';
import { useProductConfig } from './ProductConfigContext';
import PlanOption from './PlanOption';

function Dot() {
  return <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-accent" />;
}

export default function ProductPurchase() {
  const { open } = useCheckout();
  const { tierId, setTierId, subscribe, setSubscribe } = useProductConfig();

  const tier = TIERS[tierId];
  const savings = tierSavings(tier);
  const subscribed = subscribe && tier.subscribable;

  function checkout() {
    open(buildSelection(tier, subscribed));
  }

  return (
    <div>
      {/* Title — small upright lead-in, big italic pack name, accent bar */}
      <h1 className="font-condensed uppercase text-ink">
        <span className="block text-sm font-bold tracking-[0.06em] text-fg sm:text-base">
          10X Day Time —
        </span>
        <span className="mt-1 block text-[2.5rem] font-black italic leading-[0.88] tracking-tight sm:text-6xl">
          {tier.name}
        </span>
      </h1>
      <span aria-hidden className="mt-3 block h-1 w-12 rounded-full bg-accent" />

      {/* Pack selector — only rendered when more than one pack is on sale */}
      {TIER_LIST.length > 1 && (
        <div className="mt-4 flex rounded-full border border-paper-200 p-1 sm:mt-6">
          {TIER_LIST.map((t) => {
            const active = t.id === tierId;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTierId(t.id)}
                aria-pressed={active}
                className={`type-k flex-1 cursor-pointer rounded-full px-2 py-2.5 text-center transition-colors ${
                  active ? 'bg-accent text-ink shadow-glow-soft' : 'text-fg-muted hover:text-ink'
                }`}
              >
                {parseInt(t.packets, 10)} Pack
              </button>
            );
          })}
        </div>
      )}

      {/* Plan selector — one-time (default) or every 4 weeks */}
      {tier.subscribable && savings && (
        <>
          <div
            role="radiogroup"
            aria-label="Choose how you buy"
            className="mt-4 grid gap-2 sm:mt-6 sm:grid-cols-2"
          >
            <PlanOption
              active={!subscribed}
              onSelect={() => setSubscribe(false)}
              label="One-time"
              price={tier.priceLabel}
            />
            <PlanOption
              active={subscribed}
              onSelect={() => setSubscribe(true)}
              label={SUBSCRIPTION_CADENCE}
              price={tier.subscriptionLabel ?? tier.priceLabel}
              badge={`Save ${savings.amountLabel}`}
            />
          </div>
          <p className="type-b2 mt-2.5 text-fg-muted">{SUBSCRIPTION_NOTE}</p>
        </>
      )}

      {/* Price */}
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 sm:mt-6">
        <div className="flex items-end gap-3">
          {subscribed && (
            <span className="font-condensed text-xl font-bold text-fg-subtle line-through sm:text-2xl">
              {tier.priceLabel}
            </span>
          )}
          <span className="font-condensed text-3xl font-black tracking-tight text-ink sm:text-4xl">
            {subscribed ? tier.subscriptionLabel : tier.priceLabel}
          </span>
        </div>
      </div>
      <p className="mt-1 font-pt text-caption text-fg-muted sm:mt-1.5">
        {subscribed
          ? `${SUBSCRIPTION_CADENCE} · skip or cancel anytime · incl. GST`
          : 'One-time purchase · incl. GST'}
      </p>

      {/* Add to Cart */}
      <button
        type="button"
        onClick={checkout}
        className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-full bg-ink px-6 py-3.5 font-quantico text-body-sm font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-ink-900 sm:mt-6 sm:py-4"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        Add to Cart
      </button>

      {/* Description + benefits — desktop only. On mobile these move below the
          Engineered With carousel (see ProductDetailsMobile) so the hero fits
          in the first screen. */}
      <div className="hidden md:block">
        <p className="mt-7 type-b2 text-fg-muted">
          {PRODUCT_DESCRIPTION} Perfect for {PRODUCT_PERFECT_FOR.toLowerCase()}
        </p>

        <ul className="mt-5 space-y-2.5">
          {tier.benefits.map((b) => (
            <li key={b} className="flex items-center gap-3 type-b2 text-fg">
              <Dot />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
