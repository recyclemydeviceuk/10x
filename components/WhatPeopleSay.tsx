import Image from 'next/image';

/**
 * SECTION — WHAT PEOPLE ACTUALLY SAY (the proof)
 *
 * The headline is the punchline, so the copy leads and the notes land after it:
 * kicker → headline → sub-line → the post-it notes. On desktop that reads
 * left-to-right, on mobile top-to-bottom — same order either way.
 *
 * Type map (per brand kit):
 *   "WHAT PEOPLE ACTUALLY SAY"    → K, charcoal
 *   "NOBODY SAID / 'I FEEL…'"     → D2 — line 1 ink, line 2 green (accent)
 *   sub                           → B1, upright
 *
 * White background so the notes photo (white canvas) blends with no edge.
 */

// Full artwork — four handwritten sticky-note reviews.
const NOTES_IMG =
  'https://res.cloudinary.com/dwo7y0jxw/image/upload/v1786896488/10x-2_2_hxwwsr.png';

export default function WhatPeopleSay() {
  return (
    <section
      id="what-people-say"
      aria-label="What people actually say"
      className="bg-white dark:bg-paper py-10 sm:py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-14">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
          {/* Left — copy. Comes first: the headline is the punchline. */}
          <div className="lg:w-1/2">
            {/* K — kicker, charcoal */}
            <p className="type-k text-ink-800 dark:text-paper-200">What people actually say</p>

            {/* D2 — line 1 ink, line 2 green (colour on top, not a font change) */}
            <h2 className="type-d2 mt-4">
              <span className="text-ink dark:text-white">Nobody Said</span>
              <br />
              <span className="text-accent">&ldquo;I Feel Focused.&rdquo;</span>
            </h2>

            {/* Sub — B1, upright */}
            <p className="type-b1 mt-5 max-w-md text-ink dark:text-white">
              They said they started doing things.
              <br />
              We&rsquo;ll take that.
            </p>
          </div>

          {/* Right — the notes, as a single full image */}
          <div className="lg:w-1/2">
            <Image
              src={NOTES_IMG}
              alt="Four handwritten sticky notes: &lsquo;I started dancing again. Don&rsquo;t know if it&rsquo;s the 10X.&rsquo; · &lsquo;Don&rsquo;t know if it&rsquo;s working, but I started doing pushups daily.&rsquo; · &lsquo;Makes me wanna do things.&rsquo; · &lsquo;I don&rsquo;t reach for tea or coffee as much anymore.&rsquo;"
              width={1622}
              height={970}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="h-auto w-full dark:brightness-90"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
