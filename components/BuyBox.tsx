'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import {
  TIERS,
  tierSavings,
  SUBSCRIPTION_CADENCE,
  SUBSCRIPTION_NOTE,
} from './plans';
import PlanOption from './PlanOption';

/**
 * SECTION — TRY IT (the mid-page buy block)
 *
 * Two columns: the product shot on the left, the buy block on the right.
 *
 * Only the 10-pack is on sale, so there is no pack-size selector — the choice
 * here is how you buy it: one-time (default) or every 4 weeks at a lower price.
 * "Add to Cart" carries both the pack and the chosen plan to the product detail
 * page via `?pack=` / `?plan=`. No checkout happens here.
 *
 * Type map (per brand kit):
 *   "FUEL BETTER THINKING."   → D1 (sized to the column), ink
 *   "Start with a 10-pack…"   → B1, upright
 *   plan labels               → Nebula bold, uppercase
 *   price                     → Quantico bold
 */

const PRODUCT_HREF = '/products/10x-daytime';

// Studio product shot — sachet beside the prepared drink, black backdrop.
const PRODUCT_IMG =
  'https://res.cloudinary.com/dn2sab6qc/image/upload/v1784895949/10x-1_hvygmw.jpg';

const TIER = TIERS.single;
const SAVINGS = tierSavings(TIER);

type Plan = 'onetime' | 'subscribe';

const BULLETS = [
  'Zero calories',
  '80mg caffeine (≈1 cup tea)',
  'Nutraceutical, not for medicinal use',
];

export default function BuyBox() {
  // One-time is the default selection.
  const [plan, setPlan] = useState<Plan>('onetime');
  const subscribed = plan === 'subscribe';

  const priceLabel = subscribed ? TIER.subscriptionLabel ?? TIER.priceLabel : TIER.priceLabel;
  const priceNote = subscribed
    ? `${SUBSCRIPTION_CADENCE} · incl. GST`
    : 'One-time purchase · incl. GST';

  return (
    <section
      id="try-it"
      aria-label="Buy 10X"
      className="bg-white py-10 sm:py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-14">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-14">
          {/* Left — product shot, square black frame. Kept on its own stacking
              level so the image can never paint over the price beside it. */}
          <div className="relative z-0 lg:w-1/2">
            <div className="relative aspect-square w-full overflow-hidden bg-black">
              <Image
                src={PRODUCT_IMG}
                alt="A 10X Daytime sachet beside a tall glass of the prepared drink"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-[50%_58%]"
              />
            </div>
          </div>

          {/* Right — buy block, above the product shot in the stacking order */}
          <div className="relative z-10 lg:w-1/2">
            {/* D1 — headline, sized to the column */}
            <h2 className="type-d1 text-[2.5rem] text-ink sm:text-[3.25rem] lg:text-[3.5rem] xl:text-[4rem]">
              Fuel Better
              <br />
              Thinking.
            </h2>

            {/* Sub — B1, upright */}
            <p className="type-b1 mt-5 text-ink">
              Start with a 10-pack.
              <br />
              See if you start doing things too.
            </p>

            {/* Plan selector — one-time (default) or every 4 weeks */}
            <div
              role="radiogroup"
              aria-label="Choose how you buy"
              className="mt-7 grid w-full max-w-md gap-2 sm:grid-cols-2"
            >
              <PlanOption
                active={!subscribed}
                onSelect={() => setPlan('onetime')}
                label="One-time"
                price={TIER.priceLabel}
              />
              <PlanOption
                active={subscribed}
                onSelect={() => setPlan('subscribe')}
                label={SUBSCRIPTION_CADENCE}
                price={TIER.subscriptionLabel ?? TIER.priceLabel}
                badge={SAVINGS ? `Save ${SAVINGS.amountLabel}` : undefined}
              />
            </div>

            {/* Subscription terms — visible next to the option, not in the fine
                print. Kept in the flow so it reads at any width. */}
            <p className="type-b2 mt-2.5 max-w-md text-fg-muted">{SUBSCRIPTION_NOTE}</p>

            {/* Price */}
            <div className="mt-6">
              <p className="font-quantico text-3xl font-bold text-ink">{priceLabel}</p>
              <p className="type-b2 mt-1 text-fg-muted">{priceNote}</p>
            </div>

            {/* Add to Cart — hands the pack and plan to the product detail page */}
            <Link
              href={`${PRODUCT_HREF}?pack=10&plan=${plan}`}
              className="mt-6 flex w-full max-w-md cursor-pointer items-center justify-center gap-2.5 rounded-full bg-ink px-8 py-4 text-fg-inverse transition-colors hover:bg-ink-900"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span className="type-k">Add to Cart</span>
            </Link>

            {/* Trust bullets */}
            <ul className="mt-6 space-y-1.5">
              {BULLETS.map((b) => (
                <li key={b} className="type-b2 flex gap-2 text-ink">
                  <span aria-hidden>•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
