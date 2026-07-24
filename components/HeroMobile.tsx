import Image from 'next/image';
import Link from 'next/link';

const PRODUCT_HREF = '/products/10x-daytime';

// Full-bleed hero lifestyle image — shared with the desktop hero.
const HERO_IMG =
  'https://res.cloudinary.com/dn2sab6qc/image/upload/v1784875982/Main_JEPG_qmer9f.jpg';

/**
 * Mobile hero (< lg). The same full-bleed lifestyle image as the desktop hero,
 * framed on the dancing man, with the copy bottom-anchored over a strong white
 * scrim so it reads. The desktop hero (`Hero`) takes over at `lg`.
 */
export default function HeroMobile() {
  return (
    <section
      id="hero-mobile"
      aria-label="The Brain Battery"
      className="relative w-full overflow-hidden bg-white lg:hidden"
    >
      {/* Full-bleed image — framed toward the dancing man on the right */}
      <Image
        src={HERO_IMG}
        alt="A man in office wear dancing on a quiet street as a wedding procession passes — 10X, The Brain Battery"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[72%_center]"
      />

      {/* White scrim — image reads up top, copy sits on white below */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(255,255,255,0.99) 0%, rgba(255,255,255,0.97) 44%, rgba(255,255,255,0.85) 58%, rgba(255,255,255,0.35) 74%, rgba(255,255,255,0) 90%)',
        }}
      />

      {/* Copy — bottom-anchored, left-aligned */}
      <div className="relative z-10 flex h-[92svh] max-h-[760px] min-h-[600px] flex-col justify-end px-5 pb-10 pt-24">
        {/* K — kicker, charcoal */}
        <p className="type-k text-ink-800">The Brain Battery</p>

        {/* D1 — display hero, black (no blue) */}
        <h1 className="type-d1 mt-3 text-ink">
          Fuel Better
          <br />
          Thinking.
        </h1>

        {/* Lede — PT Sans italic (real italic, not the caption cut) */}
        <p className="mt-4 max-w-md font-pt text-lg italic leading-snug text-ink">
          No buzz. No crash.
          <br />
          Just quietly better thinking.
        </p>

        {/* Primary button (K on green) */}
        <div className="mt-5">
          <Link
            href={PRODUCT_HREF}
            className="type-k inline-flex cursor-pointer items-center gap-2 bg-accent px-6 py-3 text-ink shadow-glow-soft transition-colors hover:bg-accent-hover"
          >
            Order Now
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>

        {/* Hero testimonial — the review we're proudest of */}
        <figure className="mt-6 max-w-md">
          <blockquote className="font-pt text-base font-bold italic leading-snug text-ink">
            &ldquo;I started dancing again. Don&rsquo;t know if it&rsquo;s the 10X.&rdquo;
          </blockquote>
          <figcaption className="type-b2 mt-2 text-fg-muted">
            — an early user. That&rsquo;s the review we&rsquo;re proudest of.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
