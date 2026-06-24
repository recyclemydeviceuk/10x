'use client';

import Image from 'next/image';
import Link from 'next/link';

const PRODUCT_HREF = '/products/10x-daytime';

// Dedicated mobile hero artwork — displayed as-is (full image, never cropped).
const MOBILE_HERO_IMAGE =
  'https://res.cloudinary.com/dyxxkrq8r/image/upload/v1782291134/10X_Hero_mobile_Image_1_lzmc5a.png';

/**
 * Mobile-only hero. Mirrors the reference layout — full-bleed product banner on
 * top, then a left-aligned copy stack below — while keeping 10X's own branding
 * and copy. The desktop hero (`Hero`) is hidden below `lg`.
 */
export default function HeroMobile() {
  return (
    <section
      id="hero-mobile"
      aria-label="The Brain Battery"
      className="relative w-full overflow-hidden bg-white pt-14 lg:hidden"
    >
      {/* Product banner — full image, edge to edge, shown exactly as provided */}
      <div className="relative w-full bg-white">
        <Image
          src={MOBILE_HERO_IMAGE}
          alt="10X The Brain Battery"
          width={1086}
          height={1310}
          priority
          sizes="100vw"
          className="h-auto w-full"
        />
      </div>

      {/* Copy — left aligned */}
      <div className="px-5 pb-12 pt-6 text-left">
        <h1 className="font-condensed text-[2.9rem] font-black uppercase italic leading-[0.9] tracking-tight text-ink">
          The Brain Battery
        </h1>

        <p className="mt-3 font-condensed text-2xl font-bold uppercase italic tracking-tight text-brand-blue">
          Fuel Better Thinking.
        </p>

        <p className="mt-4 max-w-md font-pt text-body text-fg-muted">
          Engineered nutrition designed to support focused thinking, controlled
          energy, and clear execution.
        </p>

        <div className="mt-7">
          <Link
            href={PRODUCT_HREF}
            className="inline-flex cursor-pointer items-center gap-2 bg-accent px-8 py-3.5 font-quantico text-body-sm font-bold uppercase tracking-[0.18em] text-ink shadow-glow-soft transition-colors hover:bg-accent-hover"
          >
            Order Now
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
