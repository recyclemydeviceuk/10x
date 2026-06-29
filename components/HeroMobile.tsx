'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const PRODUCT_HREF = '/products/10x-daytime';

// Mobile hero artwork — auto-sliding carousel (images are 1080×1440 / 3:4).
const MOBILE_SLIDES = [
  { src: 'https://res.cloudinary.com/dyxxkrq8r/image/upload/v1782395886/3_nvngsk.png', alt: '10X The Brain Battery — on the go' },
  { src: 'https://res.cloudinary.com/dyxxkrq8r/image/upload/v1782395881/1_p1utcj.png', alt: '10X The Brain Battery' },
  { src: 'https://res.cloudinary.com/dyxxkrq8r/image/upload/v1782395881/2_qx1n8q.png', alt: '10X The Brain Battery — engineered nutrition' },
];

/**
 * Mobile-only hero. Full-bleed product carousel on top that auto-advances every
 * 3 seconds, then a left-aligned copy stack below. The desktop hero (`Hero`) is
 * hidden below `lg`.
 */
export default function HeroMobile() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = window.setInterval(() => {
      setActive((i) => (i + 1) % MOBILE_SLIDES.length);
    }, 5000);
    return () => window.clearInterval(t);
  }, []);

  return (
    <section
      id="hero-mobile"
      aria-label="The Brain Battery"
      className="relative w-full overflow-hidden bg-white pt-14 lg:hidden"
    >
      {/* Product carousel — banner image, edge to edge, slides horizontally.
          Height is capped to the viewport so the hero copy + ingredient strip
          stay in the first view, matching the mockup. */}
      <div className="relative h-[46vh] max-h-[440px] min-h-[300px] w-full overflow-hidden bg-white">
        {/* sliding track — moves one full screen-width per slide */}
        <div
          className="flex h-full w-full transition-transform duration-[1100ms] ease-[cubic-bezier(0.65,0,0.35,1)] will-change-transform"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {MOBILE_SLIDES.map((s, i) => (
            <div key={s.src} className="relative h-full w-full shrink-0">
              <Image
                src={s.src}
                alt={s.alt}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* dots */}
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
          {MOBILE_SLIDES.map((s, i) => (
            <button
              key={s.src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show slide ${i + 1}`}
              aria-current={i === active}
              className={`h-2 rounded-full shadow transition-all ${
                i === active ? 'w-6 bg-white' : 'w-2 bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Copy — left aligned. Compact sizing on mobile so the ingredient strip
          stays in the first view alongside a taller hero image. */}
      <div className="px-5 pb-5 pt-4 text-left">
        <h1 className="font-condensed text-[2rem] font-black uppercase italic leading-[0.9] tracking-tight text-ink">
          The Brain Battery
        </h1>

        <p className="mt-2 font-condensed text-base font-bold uppercase italic tracking-tight text-brand-blue">
          Fuel Better Thinking.
        </p>

        <p className="mt-2.5 max-w-md font-pt text-xs leading-relaxed text-fg-muted">
          Engineered nutrition designed to support focused thinking, controlled
          energy, and clear execution.
        </p>

        <div className="mt-4">
          <Link
            href={PRODUCT_HREF}
            className="inline-flex cursor-pointer items-center gap-2 bg-accent px-6 py-3 font-quantico text-[11px] font-bold uppercase tracking-[0.16em] text-ink shadow-glow-soft transition-colors hover:bg-accent-hover"
          >
            Order Now
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
