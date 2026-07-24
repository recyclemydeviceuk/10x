import Image from 'next/image';

/**
 * SECTION — WHAT IT IS (the justification)
 *
 * Two columns: the copy on the left, the "equation" on the right as a single
 * full image — 90 almonds · 4 cups green tea · 1 bowl spinach · 2 eggs  =  one
 * 10X Daytime sachet (battery at full charge).
 *
 * Type map (per brand kit):
 *   "WHAT IT IS"                  → K, grey
 *   "NOTHING NEW TO YOUR BODY."   → D2, ink
 *   lede                          → PT Sans italic (real italic), tail bold
 *
 * Calmer than the hero: static, white background so the image (white canvas)
 * blends in with no visible edge.
 */

// Full equation artwork — food cards = the sachet.
const EQUATION_IMG =
  'https://res.cloudinary.com/dn2sab6qc/image/upload/v1784876612/product_nwnukt.jpg';

export default function WhatItIs() {
  return (
    <section
      id="what-it-is"
      aria-label="What it is"
      className="bg-white py-14 sm:py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-14">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-12">
          {/* Left — copy */}
          <div className="lg:w-[42%]">
            {/* K — kicker, grey */}
            <p className="type-k text-fg-muted">What it is</p>

            {/* D2 — section head, black (no blue) */}
            <h2 className="type-d2 mt-4 text-ink">
              Nothing New
              <br />
              To Your Body.
            </h2>

            {/* Lede — PT Sans italic, the payoff in bold */}
            <p className="mt-5 max-w-md font-pt text-lg italic leading-relaxed text-ink md:text-xl">
              Every compound in 10X is one your brain already knows from food. We
              didn&rsquo;t invent them{' '}
              <span className="font-bold">
                — we just skipped the four-course meal it&rsquo;d take to get them
                all in one sitting.
              </span>
            </p>
          </div>

          {/* Right — the equation, as a single full image */}
          <div className="lg:w-[58%]">
            <Image
              src={EQUATION_IMG}
              alt="90 almonds for L-Tyrosine, 4 cups of green tea, 1 bowl of spinach for folate and 2 eggs for choline — equal to one 10X Daytime sachet"
              width={867}
              height={578}
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
