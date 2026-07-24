'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { TIERS } from './plans';

/**
 * SECTION — TRY IT (the mid-page buy block)
 *
 * Two columns: the product shot on the left, the buy block on the right. The
 * pack selector (10 / 30 / 60) updates the price; "Add to Cart" carries the
 * chosen pack to the product detail page via `?pack=` (read there by
 * `tierIdFromPack`). No checkout happens here — this is the hand-off to the PDP.
 *
 * Type map (per brand kit):
 *   "FUEL BETTER THINKING."   → D1 (sized to the column), ink
 *   "Start with a 10-pack…"   → PT Sans italic
 *   pack labels               → Nebula bold, uppercase
 *   price                     → Quantico bold (₹ falls through to a clean glyph)
 */

const PRODUCT_HREF = '/products/10x-daytime';

// Studio product shot — sachet beside the prepared drink, black backdrop.
const PRODUCT_IMG =
  'https://res.cloudinary.com/dn2sab6qc/image/upload/v1784895949/10x-1_hvygmw.jpg';

type PackId = '10' | '30' | '60';
type Pack = { id: PackId; name: string; price: string; note: string };

// Prices come straight from the pricing source of truth (one-time / MRP).
const PACKS: Pack[] = [
  { id: '10', name: '10 Pack', price: TIERS.single.priceLabel, note: 'try it' },
  { id: '30', name: '30 Pack', price: TIERS.core.priceLabel, note: 'best value' },
  { id: '60', name: '60 Pack', price: TIERS.performance.priceLabel, note: 'the habit' },
];

const BULLETS = [
  'Zero calories',
  '80mg caffeine (≈1 cup tea)',
  'Nutraceutical, not for medicinal use',
];

export default function BuyBox() {
  const [selected, setSelected] = useState<PackId>('10');
  const pack = PACKS.find((p) => p.id === selected) ?? PACKS[0];

  return (
    <section
      id="try-it"
      aria-label="Buy 10X"
      className="bg-white py-14 sm:py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-14">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-14">
          {/* Left — product shot, square black frame */}
          <div className="lg:w-1/2">
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

          {/* Right — buy block */}
          <div className="lg:w-1/2">
            {/* D1 — headline, sized to the column */}
            <h2 className="type-d1 text-[2.5rem] text-ink sm:text-[3.25rem] lg:text-[3.5rem] xl:text-[4rem]">
              Fuel Better
              <br />
              Thinking.
            </h2>

            {/* Sub — PT Sans italic */}
            <p className="mt-5 font-pt text-lg italic leading-snug text-ink md:text-xl">
              Start with a 10-pack.
              <br />
              See if you start doing things too.
            </p>

            {/* Pack selector */}
            <div
              role="radiogroup"
              aria-label="Choose a pack"
              className="mt-7 grid w-full max-w-md grid-cols-3 gap-1 rounded-full border border-paper-200 bg-white p-1"
            >
              {PACKS.map((p) => {
                const active = p.id === selected;
                return (
                  <button
                    key={p.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    aria-label={`${p.name} — ${p.note}`}
                    onClick={() => setSelected(p.id)}
                    className={`flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-2 py-2.5 transition-colors ${
                      active ? 'bg-accent text-ink' : 'text-fg-muted hover:text-ink'
                    }`}
                  >
                    <span className="font-nebula text-[11px] font-bold uppercase tracking-[0.1em] md:text-xs">
                      {p.name}
                    </span>
                    {active && (
                      <span className="hidden text-[10px] italic text-ink/70 sm:inline">
                        {p.note}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Price */}
            <div className="mt-7">
              <p className="font-quantico text-3xl font-bold text-ink">{pack.price}</p>
              <p className="type-b2 mt-1 text-fg-muted">One-time purchase · incl. GST</p>
            </div>

            {/* Add to Cart — hands the chosen pack to the product detail page */}
            <Link
              href={`${PRODUCT_HREF}?pack=${selected}`}
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
