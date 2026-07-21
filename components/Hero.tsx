'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const PRODUCT_HREF = '/products/10x-daytime';

const SLIDES = [
  { src: 'https://res.cloudinary.com/dyxxkrq8r/image/upload/v1782395886/3_nvngsk.png', alt: '10X The Brain Battery — on the go' },
  { src: 'https://res.cloudinary.com/dyxxkrq8r/image/upload/v1782395881/1_p1utcj.png', alt: '10X The Brain Battery' },
  { src: 'https://res.cloudinary.com/dyxxkrq8r/image/upload/v1782395881/2_qx1n8q.png', alt: '10X The Brain Battery — engineered nutrition' },
];

export default function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = window.setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, 5000);
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
      <div className="relative h-[56vw] max-h-[360px] w-full overflow-hidden bg-paper-100 sm:max-h-[440px] lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:max-h-none lg:w-1/2">
        {/* sliding track — moves one full panel-width per slide */}
        <div
          className="flex h-full w-full transition-transform duration-[1100ms] ease-[cubic-bezier(0.65,0,0.35,1)] will-change-transform"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {SLIDES.map((s, i) => (
            <div key={s.src} className="relative h-full w-full shrink-0">
              <Image
                src={s.src}
                alt={s.alt}
                fill
                priority={i === 0}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* dots */}
        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
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
            {/* K — kicker, grey */}
            <p className="type-k text-fg-muted">The Brain Battery</p>

            {/* D1 — display hero, black (no blue) */}
            <h1 className="type-d1 mt-4 text-ink">
              Fuel
              <br />
              Better
              <br />
              Thinking.
            </h1>

            {/* B1 — lede, "quietly better afternoon" bold */}
            <p className="type-b1 mx-auto mt-6 max-w-md text-ink lg:mx-0">
              No buzz. No crash. No moment it &ldquo;kicks in.&rdquo;{' '}
              <span className="font-bold">Just a quietly better afternoon.</span>
            </p>

            {/* Primary button (K on green) + micro-trust (B2, grey) */}
            <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap lg:items-center lg:justify-start">
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
              <span className="type-b2 text-fg-muted">
                Zero calories · No harsh stimulants
              </span>
            </div>

            {/* Hero testimonial — rule above it. The review we're proudest of. */}
            <figure className="mx-auto mt-9 max-w-md border-t border-paper-200 pt-6 lg:mx-0">
              <blockquote className="type-d3 text-ink">
                &ldquo;I started dancing again. Don&rsquo;t know if it&rsquo;s the 10X.&rdquo;
              </blockquote>
              <figcaption className="type-b2 mt-3 text-fg-muted">
                — an early user. That&rsquo;s the review we&rsquo;re{' '}
                <span className="font-bold text-accent-pressed">proudest of</span>.
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
