'use client';

import Image from 'next/image';
import { useRef } from 'react';

import { useAutoScroll } from './useAutoScroll';

const MINDS = [
  {
    label: 'Creators',
    text: 'Sustain creative sprints without the crash.',
    image: 'https://res.cloudinary.com/dyxxkrq8r/image/upload/v1782301319/CREATORS.jpg_orofoj.jpg',
  },
  {
    label: 'Developers',
    text: 'Hold deep focus through long problem loops.',
    image: 'https://res.cloudinary.com/dyxxkrq8r/image/upload/v1782301319/DEVELOPERS.jpg_tmy9e5.jpg',
  },
  {
    label: 'Students',
    text: 'Study longer with a calm, clear mind.',
    image: 'https://res.cloudinary.com/dyxxkrq8r/image/upload/v1782301319/STUDENTS.jpg_jcbkxf.jpg',
  },
  {
    label: 'Athletes',
    text: 'Sharper focus and reaction — clean inputs only.',
    image: 'https://res.cloudinary.com/dyxxkrq8r/image/upload/v1782301319/ATHLETES.jpg_djkixu.jpg',
  },
  {
    label: 'Entrepreneurs',
    text: 'Make better decisions, all day long.',
    image: 'https://res.cloudinary.com/dyxxkrq8r/image/upload/v1782301320/FOUNDERS.jpg_dtb63a.jpg',
  },
  {
    label: 'Leaders',
    text: 'Stay sharp through back-to-back calls.',
    image: 'https://res.cloudinary.com/dyxxkrq8r/image/upload/v1782301319/EXECUTIVES.jpg_wze9kd.jpg',
  },
];

export default function BuiltForMinds() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollByAmount } = useAutoScroll(trackRef, { speed: 0.5, wrapIndex: MINDS.length });

  return (
    <section aria-label="Built for high-output minds" className="bg-paper-100 py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 md:px-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-condensed uppercase text-ink">
              <span className="block text-sm font-bold italic tracking-[0.06em] text-fg sm:text-base">
                Built For
              </span>
              <span className="mt-1 block text-4xl font-black italic leading-[0.9] tracking-tight sm:text-5xl">
                High-Output Minds.
              </span>
            </h2>
            <span aria-hidden className="mt-3 block h-1 w-12 rounded-full bg-accent" />
          </div>
          <div className="hidden shrink-0 gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scrollByAmount(-300)}
              aria-label="Scroll left"
              className="flex h-10 w-10 cursor-pointer items-center justify-center border border-paper-300 bg-white text-ink transition-colors hover:border-fg"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scrollByAmount(300)}
              aria-label="Scroll right"
              className="flex h-10 w-10 cursor-pointer items-center justify-center border border-paper-300 bg-white text-ink transition-colors hover:border-fg"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Continuous auto-scrolling marquee. Cards are rendered twice for a
            seamless loop; scrolling pauses on hover / touch. */}
        <div
          ref={trackRef}
          className="mt-10 flex gap-5 overflow-x-auto pb-2"
          style={{ scrollbarWidth: 'none' }}
        >
          {[...MINDS, ...MINDS].map((m, i) => {
            const isClone = i >= MINDS.length;
            const n = (i % MINDS.length) + 1;
            return (
              <article
                key={i}
                aria-hidden={isClone || undefined}
                className="relative flex aspect-[3/5] w-[250px] shrink-0 flex-col justify-end overflow-hidden bg-ink p-6 text-white"
              >
                {/* Background image */}
                <Image
                  src={m.image}
                  alt={isClone ? '' : m.label}
                  fill
                  sizes="250px"
                  className="object-cover object-center"
                />
                {/* Dark scrim — keeps the label and number legible over the photo */}
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10" />

                <span className="pointer-events-none absolute right-4 top-3 font-condensed text-6xl font-black italic leading-none text-white/20">
                  {String(n).padStart(2, '0')}
                </span>
                <div className="relative">
                  <span aria-hidden className="block h-[3px] w-9 bg-accent" />
                  <h3 className="mt-4 font-condensed text-2xl font-black uppercase italic tracking-tight">
                    {m.label}
                  </h3>
                  <p className="mt-2 font-pt text-caption text-white/80">{m.text}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
