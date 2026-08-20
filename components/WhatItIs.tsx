import Image from 'next/image';

/**
 * SECTION — WHAT IT IS (the justification)
 *
 * Two columns: the copy on the left, the scale on the right — a plate of whole
 * foods weighed against one sachet in a glass of water. One flat artwork, so
 * the second column is the image and nothing else.
 *
 * Type map (per brand kit):
 *   "WHAT IT IS"                  → K, grey
 *   "NOTHING NEW TO YOUR BODY."   → D2, ink
 *   lede                          → B1 (PT Sans Caption, upright), tail bold
 *
 * Calmer than the hero: static, white background so the image (white canvas)
 * blends in with no visible edge.
 */

const SCALE_IMAGE =
  'https://res.cloudinary.com/dwo7y0jxw/image/upload/v1786896407/Food_scale_gzfd53.png';

export default function WhatItIs() {
  return (
    <section
      id="what-it-is"
      aria-label="What it is"
      className="bg-white dark:bg-paper py-10 sm:py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-14">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
          {/* Left — copy */}
          <div className="lg:w-[42%]">
            {/* K — kicker, grey */}
            <p className="type-k text-fg-muted">What it is</p>

            {/* D2 — section head, black (no blue) */}
            <h2 className="type-d2 mt-4 text-ink dark:text-white">
              Nothing New
              <br />
              To Your Body.
            </h2>

            {/* Lede — B1 upright, the payoff in bold (bold is the emphasis,
                italic stays reserved for headlines and pull-quotes) */}
            <p className="type-b1 mt-5 max-w-md text-ink dark:text-white">
              Every compound in 10X is one your brain already knows from food. We
              didn&rsquo;t invent them{' '}
              <span className="font-bold">
                — we just skipped the four-course meal it&rsquo;d take to get them
                all in one sitting.
              </span>
            </p>
          </div>

          {/* Right — the scale, full column */}
          <div className="lg:w-[58%]">
            <Image
              src={SCALE_IMAGE}
              alt="A balance scale: a plate of eggs, four cups of green tea, pulses, spring onions and a vitamin B12 bottle on one side, level with a single 10X Daytime sachet being poured into a glass of water on the other."
              width={1536}
              height={1024}
              sizes="(min-width: 1024px) 58vw, 100vw"
              /* The artwork's canvas is rgb(254,254,254), not pure white, which
                 reads as a faint grey box against the section. A 1.2% lift
                 clamps it to #FFF and leaves the subject untouched. */
              style={{ filter: 'brightness(1.012)' }}
              className="h-auto w-full rounded-lg border border-black/[0.06] dark:border-white/[0.06] dark:brightness-90"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
