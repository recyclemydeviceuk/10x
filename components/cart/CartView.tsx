'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useAuth } from '@/components/account/AuthContext';
import AuthModal from '@/components/account/AuthModal';
import { inr } from '@/lib/store/types';

import CouponField from './CouponField';
import { useTheme } from '@/components/ThemeProvider';
import { useCart } from './CartContext';

const PRODUCT_HREF = '/products/10x-daytime';

/**
 * The cart.
 *
 * Deliberately unboxed: one product row, the money, and a single action.
 * Borders are used only where something is genuinely separate — everything
 * else leans on spacing and type weight, which keeps a one-line cart from
 * looking like a spreadsheet.
 */
export default function CartView() {
  const router = useRouter();
  const {
    line, loading, subtotal, shipping, shippingKnown, delivery, deliveryLoading, deliveryPincode, setDeliveryPincode,
    total, savings, discount, coupon,
    settings, setQuantity, clear,
  } = useCart();
  const { isAuthed } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  // The cart line carries the product's own photo from the catalogue, in both
  // looks — so the thumbnail matches the theme and the pack that ships.
  const { theme } = useTheme();
  const thumb = (theme === 'light' ? line?.image : line?.imageDark || line?.image) || '';

  function proceed() {
    if (!isAuthed) return setAuthOpen(true);
    router.push('/checkout');
  }

  /* ------------------------------------------------------------ loading */
  if (loading) {
    return (
      <main id="main" className="min-h-[70vh] bg-paper">
        <div className="mx-auto max-w-5xl px-6 pb-20 pt-28 sm:px-10 md:pt-36">
          <div className="h-10 w-40 animate-pulse bg-paper-200" />
          <div className="mt-10 h-32 w-full animate-pulse bg-paper-200" />
        </div>
      </main>
    );
  }

  /* -------------------------------------------------------------- empty */
  if (!line) {
    return (
      <main id="main" className="min-h-[70vh] bg-paper">
        <div className="mx-auto max-w-md px-6 pb-24 pt-32 text-center sm:px-10 md:pt-44">
          <span className="mx-auto flex h-16 w-16 items-center justify-center text-fg-subtle">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </span>
          <h1 className="mt-6 font-condensed text-[clamp(1.75rem,5vw,2.5rem)] font-black uppercase italic leading-[0.95] tracking-tight text-fg">
            Your Cart Is Empty
          </h1>
          <p className="mt-3 font-pt text-body text-fg-muted">
            Pick a pack and it&rsquo;ll show up here.
          </p>
          <Link
            href={PRODUCT_HREF}
            className="mt-8 inline-flex cursor-pointer items-center gap-2 bg-accent px-8 py-4 font-quantico text-body-sm font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-accent-hover"
          >
            Shop 10X Daytime
          </Link>
        </div>
      </main>
    );
  }

  /* --------------------------------------------------------------- cart */
  // The free-delivery nudge is the store's own threshold, not a number this
  // page decided; it stays hidden until that threshold has been read.
  const freeShippingOver = settings.freeShippingOver;
  const freeShippingGap = freeShippingOver - subtotal;
  const totalSaved = savings + discount;

  return (
    <main id="main" className="bg-paper pb-28 lg:pb-0">
      <div className="mx-auto max-w-5xl px-6 pb-20 pt-28 sm:px-10 md:pt-36">
        {/* Heading */}
        <div className="flex items-baseline justify-between gap-6">
          <h1 className="font-condensed text-[clamp(2rem,5.5vw,3.25rem)] font-black uppercase italic leading-[0.9] tracking-tight text-fg">
            Cart
          </h1>
          <Link
            href={PRODUCT_HREF}
            className="shrink-0 font-pt text-body-sm text-fg-muted underline decoration-paper-300 underline-offset-4 transition-colors hover:text-fg"
          >
            Continue shopping
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-x-16 gap-y-10 lg:grid-cols-[1fr_20rem]">
          {/* ============================ ITEM ============================ */}
          <section aria-label="Items in your cart">
            <div className="flex gap-5 border-t border-paper-200 pt-7 sm:gap-7">
              <Link
                href={PRODUCT_HREF}
                className="relative h-28 w-28 shrink-0 overflow-hidden bg-white transition-opacity hover:opacity-85 dark:bg-paper sm:h-32 sm:w-32"
              >
                {thumb ? (
                  <Image src={thumb} alt={line.tierName} fill sizes="128px" className="object-contain" />
                ) : null}
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="font-condensed text-xl font-black uppercase italic tracking-tight text-fg sm:text-2xl">
                      {line.tierName}
                    </h2>
                    <p className="mt-1 font-pt text-body-sm text-fg-muted">{line.packets}</p>
                    {line.isSubscription && (
                      <span className="mt-3 inline-block bg-accent px-2.5 py-1 font-quantico text-[10px] font-bold uppercase tracking-[0.12em] text-ink">
                        Every 4 weeks
                      </span>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    {line.isSubscription && (
                      <p className="font-pt text-body-sm text-fg-subtle line-through">
                        {inr(line.oneTimePrice)}
                      </p>
                    )}
                    <p className="font-quantico text-body font-bold text-fg">{inr(line.price)}</p>
                  </div>
                </div>

                {/* Quantity + remove */}
                <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-6">
                  {line.isSubscription ? (
                    <p className="font-pt text-body-sm text-fg-muted">
                      1 pack per cycle
                    </p>
                  ) : (
                    <div className="inline-flex items-center border border-paper-300">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => setQuantity(line.quantity - 1)}
                        disabled={line.quantity <= 1}
                        className="flex h-10 w-10 cursor-pointer items-center justify-center text-fg transition-colors hover:bg-paper-100 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-paper-200"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                      <span
                        aria-live="polite"
                        className="w-10 text-center font-quantico text-body-sm font-bold text-fg"
                      >
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => setQuantity(line.quantity + 1)}
                        disabled={line.quantity >= 9}
                        className="flex h-10 w-10 cursor-pointer items-center justify-center text-fg transition-colors hover:bg-paper-100 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-paper-200"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={clear}
                    className="cursor-pointer font-pt text-body-sm text-fg-muted underline decoration-paper-300 underline-offset-4 transition-colors hover:text-danger"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>

            {/* Coupon */}
            <div className="mt-8 border-t border-paper-200 pt-8">
              <CouponField />
            </div>

            {/* Live delivery: the rate depends on where it's going. */}
            {settings.deliveryMode === 'live' && (
              <div className="mt-8 border-t border-paper-200 pt-8">
                <label htmlFor="cart-pincode" className="font-quantico text-[10px] font-bold uppercase tracking-[0.16em] text-fg-subtle">
                  Delivery pincode
                </label>
                <div className="mt-2.5 flex items-center gap-3">
                  <input
                    id="cart-pincode"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    maxLength={6}
                    value={deliveryPincode}
                    onChange={(e) => setDeliveryPincode(e.target.value)}
                    placeholder="6-digit pincode"
                    className="w-40 border-2 border-paper-200 bg-paper px-4 py-3 font-pt text-body-sm text-fg outline-none transition-colors focus:border-accent"
                  />
                  <p className="font-pt text-caption text-fg-muted">
                    {deliveryPincode.length < 6
                      ? 'We quote the real courier rate for your area.'
                      : deliveryLoading
                        ? 'Checking courier rates…'
                        : delivery?.source === 'shiprocket'
                          ? `${delivery.courier}${delivery.days ? ` · ${delivery.days} day${delivery.days === 1 ? '' : 's'}` : delivery.etd ? ` · by ${delivery.etd}` : ''}`
                          : delivery?.fee === 0
                            ? 'Free delivery on this order.'
                            : 'Standard rate — we’ll confirm the courier once you order.'}
                  </p>
                </div>
              </div>
            )}

            {/* Free shipping progress */}
            {shipping > 0 && freeShippingOver > 0 && freeShippingGap > 0 && (
              <div className="mt-6">
                <p className="font-pt text-body-sm text-fg-muted">
                  <span className="font-bold text-fg">{inr(freeShippingGap)}</span> away
                  from free express delivery
                </p>
                <div
                  className="mt-2.5 h-1 w-full bg-paper-200"
                  role="progressbar"
                  aria-valuenow={Math.min(100, Math.round((subtotal / freeShippingOver) * 100))}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="h-full bg-accent transition-all duration-500 ease-out-expo"
                    style={{ width: `${Math.min(100, (subtotal / freeShippingOver) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </section>

          {/* =========================== SUMMARY =========================== */}
          <aside aria-label="Order summary" className="lg:sticky lg:top-28 lg:self-start">
            <div className="border-t border-paper-200 pt-7">
              <dl className="space-y-3.5 font-pt text-body-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-fg-muted">
                    Subtotal
                    {!line.isSubscription && line.quantity > 1 && (
                      <span className="text-fg-subtle"> · {line.quantity} packs</span>
                    )}
                  </dt>
                  <dd className="font-quantico font-bold text-fg">{inr(subtotal)}</dd>
                </div>

                {savings > 0 && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-fg-muted">Subscription saving</dt>
                    <dd className="font-quantico font-bold text-accent-pressed dark:text-accent">
                      −{inr(savings)}
                    </dd>
                  </div>
                )}

                {discount > 0 && coupon && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-fg-muted">
                      Coupon <span className="font-bold text-fg">{coupon.code}</span>
                    </dt>
                    <dd className="font-quantico font-bold text-accent-pressed dark:text-accent">
                      −{inr(discount)}
                    </dd>
                  </div>
                )}

                <div className="flex justify-between gap-4">
                  <dt className="text-fg-muted">Delivery</dt>
                  {/* The store's shipping rule decides this, so nothing is
                      quoted until it has been read. */}
                  <dd
                    className={`font-quantico font-bold uppercase tracking-wide ${
                      shippingKnown && shipping === 0 ? 'text-accent-pressed dark:text-accent' : 'text-fg'
                    }`}
                  >
                    {!shippingKnown
                      ? deliveryLoading
                        ? 'Checking…'
                        : 'Enter pincode'
                      : shipping === 0
                        ? 'Free'
                        : inr(shipping)}
                  </dd>
                </div>
              </dl>

              <div className="mt-6 flex items-baseline justify-between gap-4 border-t border-paper-200 pt-6">
                <span className="font-quantico text-caption font-bold uppercase tracking-[0.14em] text-fg-muted">
                  {line.isSubscription ? 'Per cycle' : 'Total'}
                </span>
                <span className="font-condensed text-[2rem] font-black leading-none tracking-tight text-fg">
                  {inr(total)}
                </span>
              </div>

              {totalSaved > 0 && (
                <p className="mt-2.5 text-right font-quantico text-[10px] font-bold uppercase tracking-[0.14em] text-accent-pressed dark:text-accent">
                  You save {inr(totalSaved)}
                </p>
              )}

              <p className="mt-1.5 text-right font-pt text-caption text-fg-subtle">
                {!shippingKnown ? 'Plus delivery · inclusive of all taxes' : 'Inclusive of all taxes'}
              </p>

              {/* Desktop CTA — mobile gets the sticky bar below */}
              <button
                type="button"
                onClick={proceed}
                className="mt-7 hidden min-h-[56px] w-full cursor-pointer items-center justify-center gap-2 bg-accent px-6 py-4 font-quantico text-body-sm font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-accent-hover lg:flex"
              >
                Proceed to Checkout
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>

              {!isAuthed && (
                <p className="mt-3 hidden text-center font-pt text-caption text-fg-subtle lg:block">
                  Sign in next, or create an account in three fields.
                </p>
              )}

              <ul className="mt-7 space-y-2 border-t border-paper-200 pt-6 font-pt text-caption text-fg-subtle">
                <li>Secure payment · 256-bit SSL</li>
                <li>FSSAI licensed · GMP manufactured</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>

      {/* Sticky CTA — mobile only, mirrors the floating bar's position */}
      <div className="fixed inset-x-0 bottom-0 z-[9995] border-t border-paper-200 bg-paper px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 lg:hidden">
        <div className="mx-auto flex max-w-md items-center gap-4">
          <div className="min-w-0">
            <p className="font-quantico text-[10px] font-bold uppercase tracking-[0.14em] text-fg-muted">
              {line.isSubscription ? 'Per cycle' : 'Total'}
            </p>
            <p className="font-condensed text-xl font-black leading-tight tracking-tight text-fg">
              {inr(total)}
            </p>
          </div>
          <button
            type="button"
            onClick={proceed}
            className="flex min-h-[52px] flex-1 cursor-pointer items-center justify-center gap-2 bg-accent px-5 font-quantico text-[11px] font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-accent-hover"
          >
            Proceed to Checkout
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onDone={() => router.push('/checkout')}
      />
    </main>
  );
}
