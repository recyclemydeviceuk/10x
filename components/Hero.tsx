import Image from 'next/image';
import Link from 'next/link';

const PRODUCT_HREF = '/products/10x-daytime';

// Full-bleed hero lifestyle image — the dancing commuter, wedding procession behind.
const HERO_IMG =
  'https://res.cloudinary.com/dn2sab6qc/image/upload/v1784875982/Main_JEPG_qmer9f.jpg';

/**
 * Desktop hero (≥ lg). A single full-bleed lifestyle image with the copy
 * overlaid on the left over a soft white scrim — the scrim washes out the
 * procession behind the type so it reads, while the dancing man on the right
 * stays vivid. The mobile hero (`HeroMobile`) takes over below `lg`.
 */
export default function Hero() {
  return (
    <section
      id="hero"
      aria-label="The Brain Battery"
      className="relative hidden w-full overflow-hidden bg-white lg:block"
    >
      {/* Full-bleed image — sits under the fixed header, framed on the man */}
      <Image
        src={HERO_IMG}
        alt="A man in office wear dancing on a quiet street as a wedding procession passes — 10X, The Brain Battery"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* White scrim — heavy on the left so the copy reads, clears by ~70% */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.92) 26%, rgba(255,255,255,0.58) 45%, rgba(255,255,255,0.16) 60%, rgba(255,255,255,0) 72%)',
        }}
      />

      {/* Copy — aligned to the site container so its left edge lines up with the logo */}
      <div className="relative z-10 mx-auto flex min-h-[620px] max-w-7xl items-center px-5 pb-16 pt-24 sm:px-8 md:px-14 lg:min-h-[82vh] lg:max-h-[860px]">
        <div className="max-w-[560px]">
          {/* K — kicker, charcoal */}
          <p className="type-k text-ink-800">The Brain Battery</p>

          {/* D1 — display hero, black (no blue) */}
          <h1 className="type-d1 mt-5 whitespace-nowrap text-ink">
            Fuel Better
            <br />
            Thinking.
          </h1>

          {/* Lede — PT Sans italic (real italic, not the caption cut) */}
          <p className="mt-6 max-w-[440px] font-pt text-xl italic leading-snug text-ink md:text-[22px]">
            No buzz. No crash.
            <br />
            Just quietly better thinking.
          </p>

          {/* Primary button (K on green) */}
          <div className="mt-8">
            <Link
              href={PRODUCT_HREF}
              className="type-k inline-flex cursor-pointer items-center gap-2 bg-accent px-8 py-3.5 text-ink shadow-glow-soft transition-colors hover:bg-accent-hover"
            >
              Order Now
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>

          {/* Hero testimonial — the review we're proudest of */}
          <figure className="mt-9 max-w-[440px]">
            <blockquote className="font-pt text-lg font-bold italic leading-snug text-ink md:text-xl">
              &ldquo;I started dancing again. Don&rsquo;t know if it&rsquo;s the 10X.&rdquo;
            </blockquote>
            <figcaption className="type-b2 mt-2.5 text-fg-muted">
              — an early user. That&rsquo;s the review we&rsquo;re proudest of.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
