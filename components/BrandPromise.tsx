'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { PILLARS } from './plans';

const PRODUCT_HREF = '/products/10x-daytime';

const SLIDES = [
  { src: 'https://res.cloudinary.com/dpq1nvxmd/image/upload/v1781945940/ChatGPT_Image_May_29_2026_03_41_00_PM_qorlzz.png', alt: '10X The Brain Battery' },
  { src: 'https://res.cloudinary.com/dpq1nvxmd/image/upload/v1781945944/ChatGPT_Image_May_29_2026_03_40_56_PM_bhhf11.png', alt: '10X The Brain Battery' },
  { src: 'https://res.cloudinary.com/dpq1nvxmd/image/upload/v1781945940/ChatGPT_Image_May_29_2026_03_40_52_PM_zpxryj.png', alt: '10X The Brain Battery' },
];

const N = SLIDES.length;

// signed distance from the active slide, wrapped to [-N/2, N/2]
function rel(i: number, active: number) {
  let d = i - active;
  if (d > N / 2) d -= N;
  if (d < -N / 2) d += N;
  return d;
}

function slideStyle(d: number): React.CSSProperties {
  if (d === 0) return { transform: 'translateX(-50%) scale(1)', opacity: 1, zIndex: 30 };
  if (d === -1) return { transform: 'translateX(-118%) scale(0.82)', opacity: 0.5, zIndex: 20 };
  if (d === 1) return { transform: 'translateX(18%) scale(0.82)', opacity: 0.5, zIndex: 20 };
  return { transform: 'translateX(-50%) scale(0.7)', opacity: 0, zIndex: 0 };
}

export default function BrandPromise() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = window.setInterval(() => {
      setActive((i) => (i + 1) % N);
    }, 3500);
    return () => window.clearInterval(t);
  }, []);

  const go = (dir: number) => setActive((i) => (i + dir + N) % N);

  return (
    <section
      id="brand-promise"
      aria-label="The Brain Battery — Fuel better thinking"
      className="bg-white py-14 sm:py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-14">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* ---------- Left: content (unchanged) ---------- */}
          <div>
            <p className="font-quantico text-caption font-bold uppercase tracking-[0.24em] text-brand-blue">
              The Brain Battery
            </p>
            <h2 className="mt-4 font-condensed text-4xl font-black uppercase italic leading-[0.9] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Fuel Better
              <br />
              Thinking.
            </h2>
            <ul className="mt-7 space-y-3">
              {PILLARS.map((p) => (
                <li
                  key={p}
                  className="flex items-center gap-3 font-quantico text-body font-bold uppercase tracking-wide text-fg"
                >
                  <span aria-hidden className="h-[3px] w-6 bg-accent" />
                  {p}
                </li>
              ))}
            </ul>

            <Link
              href={PRODUCT_HREF}
              className="mt-8 inline-flex cursor-pointer items-center gap-2 bg-accent px-9 py-3.5 font-quantico text-body-sm font-bold uppercase tracking-[0.18em] text-ink shadow-glow-soft transition-colors hover:bg-accent-hover"
            >
              Order Now
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>

          {/* ---------- Right: coverflow 3D carousel ---------- */}
          <div className="relative">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              {SLIDES.map((s, i) => {
                const d = rel(i, active);
                return (
                  <div
                    key={s.src}
                    className="absolute inset-y-0 left-1/2 w-[76%] origin-center transition-all duration-500 ease-out"
                    style={slideStyle(d)}
                    aria-hidden={d !== 0}
                  >
                    <button
                      type="button"
                      onClick={() => (d === 0 ? undefined : setActive(i))}
                      tabIndex={d === 0 ? -1 : 0}
                      aria-label={d === 0 ? undefined : `Show slide ${i + 1}`}
                      className="relative block h-full w-full cursor-pointer overflow-hidden rounded-2xl bg-paper-100 shadow-elevated"
                    >
                      <Image
                        src={s.src}
                        alt={s.alt}
                        fill
                        sizes="(min-width: 1024px) 40vw, 80vw"
                        className="object-cover"
                      />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* arrows */}
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous"
              className="absolute left-1 top-1/2 z-40 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white text-ink shadow-card transition-colors hover:bg-paper-100 md:left-2"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next"
              className="absolute right-1 top-1/2 z-40 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white text-ink shadow-card transition-colors hover:bg-paper-100 md:right-2"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* dots */}
            <div className="mt-5 flex items-center justify-center gap-2">
              {SLIDES.map((s, i) => (
                <button
                  key={s.src}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Show slide ${i + 1}`}
                  aria-current={i === active}
                  className={`h-2 rounded-full transition-all ${
                    i === active ? 'w-6 bg-brand-blue' : 'w-2 bg-paper-300 hover:bg-paper-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
