import FoodEquation from './FoodEquation';

/**
 * SECTION — WHAT IT IS (the justification)
 *
 * Two columns: the copy on the left, the "equation" on the right — 90 almonds ·
 * 4 cups green tea · 1 bowl spinach · 2 eggs  =  one 10X Daytime sachet
 * (battery at full charge). See `FoodEquation` for why it's markup, not art.
 *
 * Type map (per brand kit):
 *   "WHAT IT IS"                  → K, grey
 *   "NOTHING NEW TO YOUR BODY."   → D2, ink
 *   lede                          → B1 (PT Sans Caption, upright), tail bold
 *
 * Calmer than the hero: static, white background so the image (white canvas)
 * blends in with no visible edge.
 */

export default function WhatItIs() {
  return (
    <section
      id="what-it-is"
      aria-label="What it is"
      className="bg-white py-10 sm:py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-14">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
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

            {/* Lede — B1 upright, the payoff in bold (bold is the emphasis,
                italic stays reserved for headlines and pull-quotes) */}
            <p className="type-b1 mt-5 max-w-md text-ink">
              Every compound in 10X is one your brain already knows from food. We
              didn&rsquo;t invent them{' '}
              <span className="font-bold">
                — we just skipped the four-course meal it&rsquo;d take to get them
                all in one sitting.
              </span>
            </p>
          </div>

          {/* Right — the equation */}
          <div className="lg:w-[58%]">
            <FoodEquation />
          </div>
        </div>
      </div>
    </section>
  );
}
