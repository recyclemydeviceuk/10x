'use client';

import Link from 'next/link';
import { useState } from 'react';

import { cadenceLabel, type CatalogProduct, type CatalogTier, type StoreSettings } from '@/lib/catalog';
import PlanOption from './PlanOption';
import ThemedImage from './ThemedImage';

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

/**
 * SECTION — TRY IT (the mid-page buy block)
 *
 * Two columns: the product shot on the left, the buy block on the right.
 *
 * The choice here is how you buy it: one-time (default) or on a recurring
 * delivery at a lower price. "Add to Cart" carries the pack and the chosen plan
 * to the product detail page via `?pack=` / `?plan=`. No checkout happens here.
 *
 * The pack and both prices are passed in from the catalogue — the homepage
 * fetches them server-side. When there is nothing on sale this block still
 * renders, minus the prices, rather than quoting a number from the repo.
 *
 * Type map (per brand kit):
 *   "FUEL BETTER THINKING."   → D1 (sized to the column), ink
 *   "Start with a 10-pack…"   → B1, upright
 *   plan labels               → Nebula bold, uppercase
 *   price                     → Quantico bold
 */

const PRODUCT_HREF = '/products/10x-daytime';

type Plan = 'onetime' | 'subscribe';

// Shown only while a product has no benefit bullets of its own yet.
const FALLBACK_BULLETS = [
  'Zero calories',
  '80mg caffeine (≈1 cup tea)',
  'Nutraceutical, not for medicinal use',
];

export default function BuyBox({
  product,
  tier,
  settings,
}: {
  /** null when the catalogue couldn't be read. */
  product: CatalogProduct | null;
  tier: CatalogTier | null;
  settings: StoreSettings;
}) {
  // One-time is the default selection.
  const [plan, setPlan] = useState<Plan>('onetime');

  const cadence = cadenceLabel(settings.subscriptionIntervalDays);
  const subscribable = Boolean(tier && tier.subscribePrice > 0 && tier.subscribePrice < tier.oneTimePrice);
  const subscribed = plan === 'subscribe' && subscribable;
  const saving = tier && subscribable ? tier.oneTimePrice - tier.subscribePrice : 0;

  const sf = product?.storefront;
  const priceLabel = tier ? inr(subscribed ? tier.subscribePrice : tier.oneTimePrice) : null;
  const priceNote = subscribed
    ? sf?.subscribePriceNote || `${cadence} · incl. GST`
    : sf?.priceNote || 'One-time purchase · incl. GST';
  const productHref = product ? `/products/${product.slug}` : PRODUCT_HREF;

  // The shot comes from the catalogue — the panel's photos, per theme, same
  // as the product page. An empty dark set falls back to the light photo.
  const heroLight = product?.images[0] ?? '';
  const heroDark = product?.imagesDark[0] || heroLight;
  const bullets = sf?.benefits?.length ? sf.benefits : FALLBACK_BULLETS;

  return (
    <section
      id="try-it"
      aria-label="Buy 10X"
      className="bg-white dark:bg-paper py-10 sm:py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-14">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-14">
          {/* Left — product shot, square black frame. Kept on its own stacking
              level so the image can never paint over the price beside it. */}
          {heroLight ? (
            <div className="relative z-0 lg:w-1/2">
              <div className="relative aspect-square w-full overflow-hidden bg-white dark:bg-paper">
                <ThemedImage
                  src={{ light: heroLight, dark: heroDark }}
                  alt={product ? `${product.name} — pack shot` : 'Product photo'}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-contain"
                />
              </div>
            </div>
          ) : null}

          {/* Right — buy block, above the product shot in the stacking order */}
          <div className="relative z-10 lg:w-1/2">
            {/* D1 — headline, sized to the column */}
            <h2 className="type-d1 text-[2.5rem] text-ink dark:text-white sm:text-[3.25rem] lg:text-[3.5rem] xl:text-[4rem]">
              Fuel Better
              <br />
              Thinking.
            </h2>

            {/* Sub — B1, upright */}
            <p className="type-b1 mt-5 text-ink dark:text-white">
              {tier ? `Start with a ${tier.packets}-pack.` : 'Start where it suits you.'}
              <br />
              See if you start doing things too.
            </p>

            {/* Plan selector — one-time (default) or recurring */}
            {tier && subscribable && (
              <>
                <div
                  role="radiogroup"
                  aria-label="Choose how you buy"
                  className="mt-7 grid w-full max-w-md gap-2 sm:grid-cols-2"
                >
                  <PlanOption
                    active={!subscribed}
                    onSelect={() => setPlan('onetime')}
                    label="One-time"
                    price={inr(tier.oneTimePrice)}
                  />
                  <PlanOption
                    active={subscribed}
                    onSelect={() => setPlan('subscribe')}
                    label={cadence}
                    price={inr(tier.subscribePrice)}
                    badge={`Save ${inr(saving)}`}
                  />
                </div>

                {/* Subscription terms — visible next to the option, not in the
                    fine print. Kept in the flow so it reads at any width. */}
                {sf?.subscriptionNote ? (
                  <p className="type-b2 mt-2.5 max-w-md text-fg-muted">{sf.subscriptionNote}</p>
                ) : null}
              </>
            )}

            {/* Price */}
            {priceLabel ? (
              <div className="mt-6">
                <p className="font-quantico text-3xl font-bold text-ink dark:text-white">{priceLabel}</p>
                <p className="type-b2 mt-1 text-fg-muted">{priceNote}</p>
              </div>
            ) : null}

            {/* Add to Cart — hands the pack and plan to the product detail page.
                A sold-out pack keeps the button honest instead of sending the
                customer to a page they can't buy from. */}
            {tier && !tier.inStock ? (
              <div className="mt-6 flex w-full max-w-md items-center justify-center gap-2.5 rounded-full bg-ink px-8 py-4 text-fg-inverse opacity-40 dark:bg-white dark:text-ink">
                <span className="type-k">Out of stock</span>
              </div>
            ) : (
              <Link
                href={tier ? `${productHref}?pack=${tier.id}&plan=${plan}` : productHref}
                className="mt-6 flex w-full max-w-md cursor-pointer items-center justify-center gap-2.5 rounded-full bg-ink px-8 py-4 text-fg-inverse transition-colors hover:bg-ink-900 dark:bg-white dark:text-ink dark:hover:bg-paper-200"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                <span className="type-k">{tier ? sf?.ctaLabel || 'Add to Cart' : 'See the product'}</span>
              </Link>
            )}

            {/* Trust bullets */}
            <ul className="mt-6 space-y-1.5">
              {bullets.map((b) => (
                <li key={b} className="type-b2 flex gap-2 text-ink dark:text-white">
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
