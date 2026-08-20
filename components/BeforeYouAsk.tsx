/**
 * SECTION — BEFORE YOU ASK (the objection handler)
 *
 * Left: the big question + the one-word answer ("No", green). Right: an
 * accordion of the follow-up questions. Uses the native <details>/<summary>
 * pattern (no JS) with a CSS-driven green "+" → "−" toggle. First item open.
 *
 * Type map (per brand kit):
 *   "BEFORE YOU ASK"                → K, charcoal
 *   "IS THIS JUST … ENERGY DRINK?"  → D2, ink
 *   "No"                            → Quantico italic, green
 *   question labels                 → Quantico bold, uppercase, upright, ink
 *   answers                         → B2, grey
 *
 * White background, no section divider (flows into the neighbours).
 */

type Faq = { q: string; a: string };

const FAQS: Faq[] = [
  {
    q: 'Will I crash later?',
    a: 'No. Energy drinks give you a spike then a crash — a borrowed hour paid back with interest. 10X doesn’t override your brain, it feeds it. There’s no high to come down from, which is why users describe “a quietly better afternoon” rather than a hit.',
  },
  {
    q: 'Wait, is there caffeine in it?',
    a: 'Only what’s naturally in the matcha — a small, steady amount, not a jolt. There are no added stimulants, so you get calm, sustained focus instead of a caffeine spike and the slump that follows.',
  },
  {
    q: 'What’s actually in it?',
    a: 'Real food, nothing you can’t pronounce: pumpkin seeds, sesame seeds, edamame, matcha, spinach and almonds. Every compound is one your brain already knows — we just skipped the four-course meal it’d take to get them all in one sitting.',
  },
  {
    q: 'So what’s “brain fog,” then?',
    a: 'It’s what happens when your brain runs low on its raw inputs — focus slips and small tasks start to feel heavy. 10X tops up the nutrients behind clear thinking, so the fog lifts on its own instead of being masked by a stimulant.',
  },
  {
    q: 'How and when do I take it?',
    a: 'Tear one sachet into a glass of water and drink it at the start of your day, or right before a block of deep work. One simple daily protocol — that’s it.',
  },
];

export default function BeforeYouAsk() {
  return (
    <section
      id="before-you-ask"
      aria-label="Before you ask"
      className="bg-white dark:bg-paper py-10 sm:py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-14">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-16">
          {/* Left — the question + the one-word answer */}
          <div className="lg:w-1/2">
            {/* K — kicker, charcoal */}
            <p className="type-k text-ink-800 dark:text-paper-200">Before you ask</p>

            {/* D2 — section head, black (no blue) */}
            <h2 className="type-d2 mt-5 text-ink dark:text-white">
              Is This Just
              <br />
              Another
              <br />
              Energy Drink?
            </h2>

            {/* The answer, green — colour on top, not a font change */}
            <p className="mt-7 font-quantico text-4xl font-bold italic text-accent md:text-5xl">
              No
            </p>

            {/* The follow-through — hands the reader to the accordion */}
            <p className="type-b2 mt-3 max-w-sm text-fg-muted">
              Long answer — pick whichever doubt is yours.
            </p>
          </div>

          {/* Right — accordion */}
          <div className="lg:w-1/2">
            {FAQS.map((f, i) => (
              <details
                key={f.q}
                open={i === 0}
                className="group border-b border-paper-200"
              >
                <summary className="flex cursor-pointer list-none items-center gap-4 py-5">
                  {/* Green "+" → "−" on open */}
                  <span
                    aria-hidden
                    className="relative flex h-6 w-6 shrink-0 items-center justify-center text-accent"
                  >
                    <span className="absolute h-[3px] w-4 rounded-full bg-current" />
                    <span className="absolute h-4 w-[3px] rounded-full bg-current transition-transform duration-200 group-open:scale-y-0" />
                  </span>
                  <span className="font-quantico text-[15px] font-bold uppercase leading-snug text-ink dark:text-white md:text-[17px]">
                    {f.q}
                  </span>
                </summary>
                <p className="type-b2 max-w-lg pb-6 pl-10 text-fg-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
