import Image from 'next/image';

/**
 * SECTION — WHAT PEOPLE ACTUALLY SAY (the proof)
 *
 * Mirror of WhatItIs: the image on the left, copy on the right. The image is a
 * single full photo of four handwritten sticky notes — the reviews people
 * actually leave. Nobody says "I feel focused"; they say they started doing
 * things.
 *
 * Type map (per brand kit):
 *   "WHAT PEOPLE ACTUALLY SAY"    → K, charcoal
 *   "NOBODY SAID / 'I FEEL…'"     → D2 — line 1 ink, line 2 green (accent)
 *   sub                           → PT Sans italic
 *
 * White background so the notes photo (white canvas) blends with no edge.
 */

// Full artwork — four handwritten sticky-note reviews.
const NOTES_IMG =
  'https://res.cloudinary.com/dn2sab6qc/image/upload/v1784879648/10X_mzkr4l.jpg';

export default function WhatPeopleSay() {
  return (
    <section
      id="what-people-say"
      aria-label="What people actually say"
      className="bg-white py-14 sm:py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-14">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-12">
          {/* Left — the notes, as a single full image */}
          <div className="lg:w-1/2">
            <Image
              src={NOTES_IMG}
              alt="Four handwritten sticky notes: &lsquo;I started dancing again. Don&rsquo;t know if it&rsquo;s the 10X.&rsquo; · &lsquo;Don&rsquo;t know if it&rsquo;s working, but I started doing pushups daily.&rsquo; · &lsquo;Makes me wanna do things.&rsquo; · &lsquo;I don&rsquo;t reach for tea or coffee as much anymore.&rsquo;"
              width={1622}
              height={970}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="h-auto w-full"
            />
          </div>

          {/* Right — copy */}
          <div className="lg:w-1/2">
            {/* K — kicker, charcoal */}
            <p className="type-k text-ink-800">What people actually say</p>

            {/* D2 — line 1 ink, line 2 green (colour on top, not a font change) */}
            <h2 className="type-d2 mt-4">
              <span className="text-ink">Nobody Said</span>
              <br />
              <span className="text-accent">&ldquo;I Feel Focused.&rdquo;</span>
            </h2>

            {/* Sub — PT Sans italic */}
            <p className="mt-5 max-w-md font-pt text-lg italic leading-relaxed text-ink md:text-xl">
              They said they started doing things.
              <br />
              We&rsquo;ll take that.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
