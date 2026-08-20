'use client';

import { useRouter } from 'next/navigation';

import { cadenceLabel } from '@/lib/catalog';

import { useCart } from './cart/CartContext';
import { useProductConfig } from './ProductConfigContext';
import { useProductContent } from './ProductContentContext';
import PlanOption from './PlanOption';

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

function Dot() {
  return <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-accent" />;
}

/**
 * The buy panel.
 *
 * Every number and every word on it comes from the catalogue: the packs, their
 * prices, the subscription price, the stock, the hero copy, the button label.
 * When the catalogue can't be read there is nothing to sell, and the panel says
 * so — it never falls back to a price of its own.
 */
export default function ProductPurchase() {
  const router = useRouter();
  const { addLine } = useCart();
  const { tierId, setTierId, subscribe, setSubscribe } = useProductConfig();
  const { product, settings } = useProductContent();

  if (!product) {
    return (
      <div className="border-2 border-dashed border-paper-300 p-8">
        <h1 className="font-condensed text-3xl font-black uppercase italic tracking-tight text-fg">
          Momentarily unavailable
        </h1>
        <p className="mt-3 font-pt text-body text-fg-muted">
          We can’t load the store right now, so we’re not going to guess at a price. Refresh in a
          moment — everything else on this page still works.
        </p>
      </div>
    );
  }

  const tiers = product.tiers;
  const tier = tiers.find((t) => t.id === tierId) ?? tiers[0] ?? null;
  const sf = product.storefront;

  if (!tier) {
    return (
      <div className="border-2 border-dashed border-paper-300 p-8">
        <h1 className="font-condensed text-3xl font-black uppercase italic tracking-tight text-fg">
          {product.name}
        </h1>
        <p className="mt-3 font-pt text-body text-fg-muted">
          No packs are on sale at the moment. Check back shortly.
        </p>
      </div>
    );
  }

  const cadence = cadenceLabel(settings.subscriptionIntervalDays);
  const subscribable = tier.subscribePrice > 0 && tier.subscribePrice < tier.oneTimePrice;
  const subscribed = subscribe && subscribable;
  const saving = subscribable ? tier.oneTimePrice - tier.subscribePrice : 0;
  const price = subscribed ? tier.subscribePrice : tier.oneTimePrice;

  /** Put the configured pack in the cart and go review it. */
  function addToCart() {
    if (!tier || !tier.inStock) return;
    addLine({
      productId: product!.id,
      tierId: tier.id,
      sku: `${product!.slug.toUpperCase()}-${tier.packets}${subscribed ? '-SUB' : ''}`,
      productName: `${product!.name} — ${tier.name}`,
      tierName: tier.name,
      packets: `${tier.packets} Stick Packets`,
      image: product!.images[0] ?? '',
      imageDark: product!.imagesDark[0] ?? '',
      price,
      quantity: 1,
      isSubscription: subscribed,
      oneTimePrice: tier.oneTimePrice,
      stock: tier.stock,
    });
    router.push('/cart');
  }

  return (
    <div>
      {/* Title — small upright lead-in, big italic pack name, accent bar */}
      <h1 className="font-condensed uppercase text-ink dark:text-white">
        {sf.kicker ? (
          <span className="block text-sm font-bold tracking-[0.06em] text-fg sm:text-base">
            {sf.kicker}
          </span>
        ) : null}
        <span className="mt-1 block text-[2.5rem] font-black italic leading-[0.88] tracking-tight sm:text-6xl">
          {tier.name}
        </span>
      </h1>
      <span aria-hidden className="mt-3 block h-1 w-12 rounded-full bg-accent" />

      {/* Pack selector — only rendered when more than one pack is on sale */}
      {tiers.length > 1 && (
        <div className="mt-4 flex rounded-full border border-paper-200 p-1 sm:mt-6">
          {tiers.map((t) => {
            const active = t.id === tier.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTierId(t.id)}
                aria-pressed={active}
                className={`type-k flex-1 cursor-pointer rounded-full px-2 py-2.5 text-center transition-colors ${
                  active ? 'bg-accent text-ink shadow-glow-soft' : 'text-fg-muted hover:text-ink dark:hover:text-white'
                }`}
              >
                {t.packets} Pack
              </button>
            );
          })}
        </div>
      )}

      {/* Plan selector — one-time (default) or recurring */}
      {subscribable && (
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
              price={inr(tier.oneTimePrice)}
            />
            <PlanOption
              active={subscribed}
              onSelect={() => setSubscribe(true)}
              label={cadence}
              price={inr(tier.subscribePrice)}
              badge={`Save ${inr(saving)}`}
            />
          </div>
          {sf.subscriptionNote ? (
            <p className="type-b2 mt-2.5 text-fg-muted">{sf.subscriptionNote}</p>
          ) : null}
        </>
      )}

      {/* Price */}
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 sm:mt-6">
        <div className="flex items-end gap-3">
          {subscribed && (
            <span className="font-condensed text-xl font-bold text-fg-subtle line-through sm:text-2xl">
              {inr(tier.oneTimePrice)}
            </span>
          )}
          <span className="font-condensed text-3xl font-black tracking-tight text-ink dark:text-white sm:text-4xl">
            {inr(price)}
          </span>
        </div>
      </div>
      {(subscribed ? sf.subscribePriceNote : sf.priceNote) ? (
        <p className="mt-1 font-pt text-caption text-fg-muted sm:mt-1.5">
          {subscribed ? sf.subscribePriceNote : sf.priceNote}
        </p>
      ) : null}

      {/* Add to Cart */}
      <button
        type="button"
        onClick={addToCart}
        disabled={!tier.inStock}
        className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-full bg-ink px-6 py-3.5 font-quantico text-body-sm font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-ink-900 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-ink dark:hover:bg-paper-200 sm:mt-6 sm:py-4"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        {tier.inStock ? sf.ctaLabel || 'Add to Cart' : 'Out of stock'}
      </button>

      {!tier.inStock && (
        <p role="status" className="mt-2.5 font-pt text-caption text-fg-muted">
          This pack is sold out. It comes back as soon as the next batch lands.
        </p>
      )}
      {tier.inStock && tier.lowStock && (
        <p role="status" className="mt-2.5 font-pt text-caption font-bold text-fg">
          Only {tier.stock} left in this pack.
        </p>
      )}

      {/* Description + benefits — desktop only. On mobile these move below the
          Engineered With carousel (see ProductDetailsMobile) so the hero fits
          in the first screen. */}
      <div className="hidden md:block">
        {product.description ? (
          <p className="mt-7 type-b2 text-fg-muted">
            {product.description}
            {sf.perfectFor
              ? ` Perfect for ${sf.perfectFor.charAt(0).toLowerCase()}${sf.perfectFor.slice(1)}`
              : ''}
          </p>
        ) : null}

        {sf.benefits.length > 0 && (
          <ul className="mt-5 space-y-2.5">
            {sf.benefits.map((b) => (
              <li key={b} className="flex items-center gap-3 type-b2 text-fg">
                <Dot />
                {b}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
