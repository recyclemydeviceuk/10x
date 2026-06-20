'use client';

import Image from 'next/image';
import { useState } from 'react';

import { TIER_LIST, TIERS, buildSelection, type TierId } from './plans';
import { useCheckout } from './CheckoutContext';

import blinkit from '../10x-Assets/Blinkit.png';
import zepto from '../10x-Assets/Zepto.png';

const LIGHT_GREEN = 'rgba(109,227,37,0.08)';

function Dot() {
  return <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-accent" />;
}

export default function ProductPurchase() {
  const { open } = useCheckout();
  const [tierId, setTierId] = useState<TierId>('core');
  const [subscribe, setSubscribe] = useState(true);

  const tier = TIERS[tierId];

  function selectTier(id: TierId) {
    setTierId(id);
    if (!TIERS[id].subscribable) setSubscribe(false);
  }

  function checkout() {
    open(buildSelection(tier, subscribe));
  }

  return (
    <div>
      {/* Dynamic title */}
      <h1 className="font-condensed text-4xl font-black uppercase italic leading-[0.95] tracking-tight text-ink sm:text-5xl">
        10X Day Time — {tier.name}
      </h1>

      {/* Static description */}
      <p className="mt-5 max-w-md font-pt text-body text-fg-muted">
        Premium brain nourishment formula designed to support calm focus, cognitive
        clarity, and sustained mental performance. Perfect for creators, developers,
        athletes, and directors.
      </p>

      {/* Per-tier benefits */}
      <ul className="mt-7 space-y-2.5">
        {tier.benefits.map((b) => (
          <li key={b} className="flex items-center gap-3 font-pt text-body text-fg">
            <Dot />
            {b}
          </li>
        ))}
      </ul>

      {/* Pack tier selector */}
      <p className="mt-7 font-quantico text-caption font-bold uppercase tracking-[0.18em] text-fg-muted">
        Select Pack Tier
      </p>
      <div className="mt-3 grid grid-cols-3 gap-3">
        {TIER_LIST.map((t) => {
          const active = t.id === tierId;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => selectTier(t.id)}
              aria-pressed={active}
              style={active ? { backgroundColor: LIGHT_GREEN } : undefined}
              className={`relative rounded-xl border-2 p-4 text-left transition-colors ${
                active ? 'border-accent' : 'border-paper-200 bg-white hover:border-paper-300'
              }`}
            >
              <p
                className={`font-quantico text-body-sm font-bold uppercase leading-tight tracking-wide ${
                  active ? 'text-accent-pressed' : 'text-ink'
                }`}
              >
                {t.name}
              </p>
              <p className="mt-1.5 font-pt text-[11px] text-fg-muted">{t.packets}</p>
              <p
                className={`mt-4 font-quantico text-body font-bold ${
                  active ? 'text-accent-pressed' : 'text-ink'
                }`}
              >
                {t.priceLabel}
              </p>
            </button>
          );
        })}
      </div>

      {/* Purchase type */}
      {tier.subscribable ? (
        <div className="mt-5 overflow-hidden rounded-xl border border-paper-200">
          {/* Subscribe */}
          <button
            type="button"
            onClick={() => setSubscribe(true)}
            aria-pressed={subscribe}
            style={subscribe ? { backgroundColor: LIGHT_GREEN } : undefined}
            className={`flex w-full items-center gap-4 border-b border-paper-200 px-5 py-4 text-left transition-colors ${
              subscribe ? 'ring-1 ring-inset ring-accent' : 'hover:bg-paper-50'
            }`}
          >
            <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${subscribe ? 'border-accent' : 'border-paper-300'}`}>
              {subscribe && <span className="h-2.5 w-2.5 rounded-full bg-accent" />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-quantico text-body-sm font-bold uppercase tracking-wide text-fg">Subscribe &amp; Save 15%</span>
              <span className="block font-pt text-caption text-fg-muted">Regular automated deliveries. Edit or cancel any time.</span>
            </span>
            <span className="shrink-0 font-quantico text-body font-bold text-ink">{tier.subscriptionLabel}</span>
          </button>
          {/* One-time */}
          <button
            type="button"
            onClick={() => setSubscribe(false)}
            aria-pressed={!subscribe}
            style={!subscribe ? { backgroundColor: LIGHT_GREEN } : undefined}
            className={`flex w-full items-center gap-4 px-5 py-4 text-left transition-colors ${
              !subscribe ? 'ring-1 ring-inset ring-accent' : 'hover:bg-paper-50'
            }`}
          >
            <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${!subscribe ? 'border-accent' : 'border-paper-300'}`}>
              {!subscribe && <span className="h-2.5 w-2.5 rounded-full bg-accent" />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-quantico text-body-sm font-bold uppercase tracking-wide text-fg">One-Time Purchase</span>
              <span className="block font-pt text-caption text-fg-muted">Perfect for sampling. Standard price.</span>
            </span>
            <span className="shrink-0 font-quantico text-body font-bold text-ink">{tier.priceLabel}</span>
          </button>
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-paper-200 px-5 py-4 text-center">
          <p className="font-pt text-caption italic text-fg-muted">
            * Single Trial Pack is ineligible for recurring subscription savings.
            Try the larger packs above to Subscribe &amp; Save 15%.
          </p>
        </div>
      )}

      {/* CTA */}
      <button
        type="button"
        onClick={checkout}
        className="mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-full bg-ink px-6 py-4 font-quantico text-body-sm font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-ink-900"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M6 2 3 6v13a1.5 1.5 0 0 0 1.5 1.5h15A1.5 1.5 0 0 0 21 19V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
        Proceed To Checkout
      </button>

      {/* Marketplace */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <span className="font-quantico text-[10px] font-bold uppercase tracking-[0.18em] text-fg-muted">
          Also available on
        </span>
        <a href="https://blinkit.com/" target="_blank" rel="noopener noreferrer" aria-label="Order on Blinkit" className="relative h-5 w-16 transition-opacity hover:opacity-70">
          <Image src={blinkit} alt="Blinkit" fill sizes="64px" className="object-contain" />
        </a>
        <a href="https://www.zepto.in/" target="_blank" rel="noopener noreferrer" aria-label="Order on Zepto" className="relative h-5 w-16 transition-opacity hover:opacity-70">
          <Image src={zepto} alt="Zepto" fill sizes="64px" className="object-contain" />
        </a>
      </div>
    </div>
  );
}
