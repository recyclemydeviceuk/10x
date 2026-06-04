'use client';

import Image from 'next/image';

import productDay from '../10x-Assets/Product Gallery image/a2f49314-bd16-47d6-b876-b00dce74b757.png';
import { useCart, type CartProduct } from './CartContext';

const PRODUCT: CartProduct = {
  id: '10x-daytime',
  name: '10X Daytime',
  pack: 'Pack of 2 (60ml)',
  price: 299,
  priceLabel: '₹299.00',
  image: productDay,
};

const ctaGradient =
  'linear-gradient(90deg, #000204 0%, #02063A 35%, #0821D2 100%)';

const includes = [
  {
    label: 'Free Express Delivery',
    sub: 'Blinkit, Zepto, Instamart & Flipkart Minutes',
    value: 'Free',
    strike: '₹49',
  },
  {
    label: 'Focus. Clarity. Control.',
    sub: 'No spikes. No crashes. No noise.',
    value: 'Included',
  },
];

export default function Collection() {
  const { addItem, open } = useCart();

  function buy() {
    addItem(PRODUCT, 1);
    open();
  }

  return (
    <section id="collection" aria-label="Start with 10X Daytime" className="bg-paper py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6 sm:px-10 md:px-14">
        <div className="grid items-center gap-10 md:grid-cols-[1fr_1.05fr] md:gap-16">
          {/* ============ Left: offer breakdown ============ */}
          <div className="order-last md:order-first">
            <p className="font-quantico text-caption font-bold uppercase tracking-[0.18em] text-brand-blue">
              Get Started
            </p>
            <h2 className="mt-3 font-condensed text-[clamp(2rem,4vw,3.25rem)] font-black uppercase italic leading-[0.95] tracking-tight text-fg">
              Start Your Day
              <br />
              With 10X Daytime
            </h2>
            <p className="mt-4 max-w-md font-pt text-body text-fg-muted">
              Brain nourishment for focus, clarity, and control — delivered to your
              door in minutes.
            </p>

            <div className="mt-8 border border-paper-200 bg-white p-6 shadow-card md:p-7">
              {/* Primary line — the product */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-quantico text-body font-bold uppercase tracking-wide text-ink">
                    10X Daytime
                  </p>
                  <p className="mt-1 font-pt text-body-sm text-fg-muted">
                    Pack of 2 &middot; 60ml sachets
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-quantico text-body-lg font-bold text-ink">₹299</p>
                  <p className="font-quantico text-caption text-fg-subtle line-through">₹399</p>
                </div>
              </div>

              <div className="my-6 border-t border-paper-200" />

              <p className="mb-4 font-quantico text-[11px] font-bold uppercase tracking-[0.16em] text-fg-subtle">
                Every order includes
              </p>
              <ul className="space-y-5">
                {includes.map((item) => (
                  <li key={item.label} className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-quantico text-body-sm font-bold uppercase tracking-wide text-ink">
                        {item.label}
                      </p>
                      <p className="mt-0.5 font-pt text-caption text-fg-muted">{item.sub}</p>
                    </div>
                    <div className="shrink-0 whitespace-nowrap text-right">
                      <span className="font-quantico text-body-sm font-bold uppercase tracking-wide text-brand-blue">
                        {item.value}
                      </span>
                      {item.strike && (
                        <span className="ml-2 font-quantico text-caption text-fg-subtle line-through">
                          {item.strike}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="my-6 border-t border-paper-200" />

              <div className="flex items-baseline justify-between">
                <p className="font-quantico text-body font-bold uppercase tracking-wide text-ink">
                  Total
                </p>
                <p className="font-quantico text-display-md font-bold text-ink">₹299.00</p>
              </div>

              <button
                type="button"
                onClick={buy}
                className="mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-2 px-8 py-4 font-quantico text-body-sm font-bold uppercase tracking-[0.18em] text-white shadow-elevated transition hover:opacity-90"
                style={{ background: ctaGradient }}
              >
                Shop 10X Daytime
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>

          {/* ============ Right: product image ============ */}
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-paper-100">
            <Image
              src={productDay}
              alt="10X Daytime — brain nourishment for focus, clarity, and control"
              fill
              sizes="(min-width: 768px) 560px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
