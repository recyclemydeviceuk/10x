/**
 * SECTION 2 — WHAT IT IS (the justification)
 *
 * "Nothing new to your body." The equation is the visual centrepiece:
 *   a small grid of food cards  =  one black card (the battery at full charge).
 *
 * Type map (per brand kit):
 *   "WHAT IT IS"                  → K, grey
 *   "NOTHING NEW TO YOUR BODY."   → D2
 *   lede                          → B1
 *   food-card numerals ("90"…)    → D3 (italic numerals)
 *   food-card labels ("ALMONDS")  → K
 *   food-card notes               → B2
 *   "="                           → D2, grey
 *   "One sachet."                 → D3, white on black
 *   "Same compounds…"             → B2, grey
 *
 * Kept visually calmer than the hero: static, paper-grey background, no motion.
 */

type Food = {
  numeral: string;
  label: string;
  note: string;
  /** the one literal ingredient — marked with a green rule */
  literal?: boolean;
};

const FOODS: Food[] = [
  { numeral: '90', label: 'Almonds', note: 'for the L-Tyrosine' },
  { numeral: '4', label: 'Cups green tea', note: 'this one really is green tea', literal: true },
  { numeral: '1', label: 'Bowl spinach', note: 'for the folate' },
  { numeral: '2', label: 'Eggs', note: 'for the choline' },
];

export default function WhatItIs() {
  return (
    <section
      id="what-it-is"
      aria-label="What it is"
      className="bg-paper-100 py-14 sm:py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-14">
        {/* Kicker + headline + lede */}
        <p className="type-k text-fg-muted">What it is</p>
        <h2 className="type-d2 mt-4 max-w-3xl text-ink">Nothing new to your body.</h2>
        <p className="type-b1 mt-5 max-w-2xl text-ink">
          Every compound in 10X is one your brain already knows from food. We
          didn&rsquo;t invent them — we just skipped the{' '}
          <span className="font-bold">four-course meal</span>{' '}it&rsquo;d take
          to get them all in one sitting.
        </p>

        {/* The equation */}
        <div className="mt-12 flex flex-col items-stretch gap-6 lg:mt-16 lg:flex-row lg:items-center lg:gap-8">
          {/* Left — food cards */}
          <ul className="grid flex-1 grid-cols-2 gap-4 sm:gap-5">
            {FOODS.map((f) => (
              <li
                key={f.label}
                className={`flex flex-col justify-between bg-paper p-5 shadow-card sm:p-6 ${
                  f.literal ? 'border-l-4 border-accent' : ''
                }`}
              >
                <span className="type-d3 text-ink">{f.numeral}</span>
                <span className="type-k mt-3 block text-ink">{f.label}</span>
                <span className="type-b2 mt-1 block text-fg-muted">{f.note}</span>
              </li>
            ))}
          </ul>

          {/* Centre — equals sign */}
          <div
            aria-hidden
            className="type-d2 flex items-center justify-center text-fg-subtle lg:px-2"
          >
            =
          </div>

          {/* Right — the battery at full charge */}
          <div className="flex flex-1 flex-col justify-center bg-ink p-8 text-fg-inverse sm:p-10">
            {/* Green battery, full charge */}
            <svg
              width="64"
              height="34"
              viewBox="0 0 64 34"
              fill="none"
              className="mb-6"
              aria-hidden
            >
              <rect x="1" y="1" width="56" height="32" rx="4" stroke="#FFFFFF" strokeOpacity="0.5" strokeWidth="2" />
              <rect x="5" y="5" width="48" height="24" rx="2" fill="#6DE325" />
              <rect x="60" y="11" width="4" height="12" rx="2" fill="#FFFFFF" fillOpacity="0.5" />
            </svg>

            <p className="type-d3 text-fg-inverse">One sachet.</p>
            <p className="type-b2 mt-2 text-fg-inverse-muted">
              Same compounds. None of the shopping.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
