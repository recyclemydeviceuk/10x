'use client';

import { useState } from 'react';

import { TIER_LIST, TIERS, buildSelection, type TierId } from './plans';
import { useCheckout } from './CheckoutContext';

function Dot() {
  return <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-accent" />;
}

export default function ProductPurchase() {
  const { open } = useCheckout();
  const [tierId, setTierId] = useState<TierId>('core');

  const tier = TIERS[tierId];

  function checkout() {
    // Larger packs default to their best (Subscribe & Save) price; the single
    // trial pack is one-time only.
    open(buildSelection(tier, tier.subscribable));
  }

  return (
    <div>
      {/* Title */}
      <h1 className="font-condensed text-4xl font-black uppercase italic leading-[0.95] tracking-tight text-ink sm:text-5xl">
        10X Day Time — {tier.name}
      </h1>

      {/* Pack selector — segmented pills */}
      <div className="mt-6 flex rounded-full border border-paper-200 p-1">
        {TIER_LIST.map((t) => {
          const active = t.id === tierId;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTierId(t.id)}
              aria-pressed={active}
              className={`flex-1 cursor-pointer rounded-full px-2 py-2.5 text-center font-quantico text-[11px] font-bold uppercase tracking-wide transition-colors sm:text-body-sm ${
                active ? 'bg-accent text-ink shadow-glow-soft' : 'text-fg-muted hover:text-ink'
              }`}
            >
              {parseInt(t.packets, 10)} Pack
            </button>
          );
        })}
      </div>

      {/* Price */}
      <div className="mt-6 flex items-end gap-3">
        {tier.subscribable && (
          <span className="font-condensed text-2xl font-bold text-fg-subtle line-through">{tier.priceLabel}</span>
        )}
        <span className="font-condensed text-4xl font-black tracking-tight text-ink">
          {tier.subscribable ? tier.subscriptionLabel : tier.priceLabel}
        </span>
      </div>
      <p className="mt-1.5 font-pt text-caption text-fg-muted">
        {tier.subscribable
          ? 'Subscribe & Save 15% · cancel anytime · incl. GST'
          : 'One-time purchase · incl. GST'}
      </p>

      {/* Add to Cart */}
      <button
        type="button"
        onClick={checkout}
        className="mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-full bg-ink px-6 py-4 font-quantico text-body-sm font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-ink-900"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        Add to Cart
      </button>

      {/* Description */}
      <p className="mt-7 font-pt text-body text-fg-muted">
        Premium brain nourishment formula designed to support calm focus, cognitive
        clarity, and sustained mental performance. Perfect for creators, developers,
        athletes, and directors.
      </p>

      {/* Benefits */}
      <ul className="mt-5 space-y-2.5">
        {tier.benefits.map((b) => (
          <li key={b} className="flex items-center gap-3 font-pt text-body text-fg">
            <Dot />
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}
