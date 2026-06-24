'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const PRODUCT_HREF = '/products/10x-daytime';

const SLIDES = [
  { src: 'https://res.cloudinary.com/dpq1nvxmd/image/upload/v1781942859/1_ijcfyp.png', alt: '10X The Brain Battery' },
  { src: 'https://res.cloudinary.com/dpq1nvxmd/image/upload/v1781942859/Banner-2_ifjqif.png', alt: '10X The Brain Battery — focus and performance' },
  { src: 'https://res.cloudinary.com/dpq1nvxmd/image/upload/v1781942860/Banner-3_tqhuc2.jpg', alt: '10X The Brain Battery — engineered nutrition' },
  { src: 'https://res.cloudinary.com/dpq1nvxmd/image/upload/v1781942864/Section-2-Banner-1_rpmgmo.png', alt: '10X The Brain Battery — fuel better thinking' },
];

export default function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = window.setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, 3800);
    return () => window.clearInterval(t);
  }, []);

  return (
    <section
      id="hero"
      aria-label="The Brain Battery"
      className="relative hidden w-full overflow-hidden bg-white pt-14 md:pt-[72px] lg:block"
    >
      {/* Product / lifestyle carousel —
          mobile: full-width block on top · lg: full-bleed right half, full height */}
      <div className="relative h-[56vw] max-h-[360px] w-full bg-paper-100 sm:max-h-[440px] lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:max-h-none lg:w-1/2">
        {SLIDES.map((s, i) => (
          <Image
            key={s.src}
            src={s.src}
            alt={s.alt}
            fill
            priority={i === 0}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className={`object-cover transition-opacity duration-700 ease-out ${
              i === active ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}

        {/* dots */}
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2">
          {SLIDES.map((s, i) => (
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

      {/* Copy — aligned to the site container so its left edge lines up with the logo */}
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-14">
        <div className="flex items-center py-10 sm:py-14 lg:min-h-[80vh] lg:w-1/2 lg:py-20 lg:pr-12">
          <div className="w-full max-w-xl text-center lg:text-left">
            <p className="font-quantico text-caption font-bold uppercase tracking-[0.24em] text-brand-blue">
              The Brain Battery
            </p>

            <h1 className="mt-3 font-condensed text-[2.6rem] font-black uppercase italic leading-[0.9] tracking-tight text-ink sm:text-6xl lg:text-7xl">
              Fuel
              <br />
              Better
              <br />
              <span className="text-brand-blue">Thinking.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-md font-pt text-body text-fg-muted sm:text-body-lg lg:mx-0">
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
        </div>
      </div>
    </section>
  );
}
