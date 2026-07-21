'use client';

import Link from 'next/link';
import { useState } from 'react';

const PRODUCT_HREF = '/products/10x-daytime';

/**
 * SECTION 5 — BUY (the ask)
 *
 * The one place the product is the star: black background, cloudy-white drink.
 * Headline restated, a three-option pack selector, one green ORDER NOW, and a
 * quiet trust line under it.
 *
 * Type map (per brand kit):
 *   "FUEL BETTER THINKING."          → D1, white on black
 *   "Start with a 10-pack…"          → B1, grey
 *   pack names ("10 Pack")           → D3;  pack notes ("try it") → B2
 *   "ORDER NOW →"                    → K
 *   "Zero calories · 80mg caffeine…" → B2, grey
 */

type Pack = { id: string; name: string; price?: string; note: string };

const PACKS: Pack[] = [
  { id: '10', name: '10 Pack', price: '₹1,199', note: 'try it' },
  { id: '30', name: '30 Pack', note: 'best value' },
  { id: '60', name: '60 Pack', note: 'the habit' },
];

export default function FinalCTA() {
  const [selected, setSelected] = useState('30');

  return (
    <section
      id="buy"
      aria-label="Buy 10X"
      className="relative overflow-hidden bg-ink text-fg-inverse"
    >
      {/* soft green glow behind the headline */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(42% 55% at 50% 30%, rgba(109,227,37,0.16) 0%, rgba(0,2,4,0) 70%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl px-5 py-16 text-center sm:px-8 sm:py-20 md:px-14 md:py-28">
        <span aria-hidden className="mx-auto block h-[3px] w-10 bg-accent" />

        {/* D1 — headline, white on black */}
        <h2 className="type-d1 mt-7 text-fg-inverse">Fuel Better Thinking.</h2>

        {/* B1 — sub-line, grey */}
        <p className="type-b1 mx-auto mt-5 max-w-md text-fg-inverse-muted">
          Start with a 10-pack. See if you start doing things too.
        </p>

        {/* Pack selector — three options */}
        <div
          role="radiogroup"
          aria-label="Choose a pack"
          className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4"
        >
          {PACKS.map((p) => {
            const active = p.id === selected;
            return (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setSelected(p.id)}
                className={`flex cursor-pointer flex-col items-center gap-1.5 border-2 px-5 py-6 text-center transition-colors ${
                  active
                    ? 'border-accent bg-accent/10'
                    : 'border-fg-inverse-muted/25 hover:border-fg-inverse-muted/60'
                }`}
              >
                <span className="type-d3 text-fg-inverse">{p.name}</span>
                <span className="type-b2 text-fg-inverse-muted">
                  {p.price ? (
                    <>
                      {/* PT Sans Caption's ₹ glyph is drawn like a ₱ — render the
                          price in a system stack (clean ₹) while notes stay B2. */}
                      <span style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif' }}>
                        {p.price}
                      </span>
                      {' · '}
                    </>
                  ) : null}
                  {p.note}
                </span>
              </button>
            );
          })}
        </div>

        {/* ORDER NOW (K) */}
        <div className="mt-9">
          <Link
            href={`${PRODUCT_HREF}?pack=${selected}`}
            className="type-k inline-flex cursor-pointer items-center gap-2 bg-accent px-9 py-4 text-ink shadow-glow-soft transition-colors hover:bg-accent-hover"
          >
            Order Now
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>

        {/* Trust line (B2, grey) */}
        <p className="type-b2 mx-auto mt-5 max-w-md text-fg-inverse-muted">
          Zero calories · 80mg caffeine (=1 cup tea) · Nutraceutical, not for
          medicinal use
        </p>
      </div>
    </section>
  );
}
