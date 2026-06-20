'use client';

import { useRef } from 'react';

const MINDS = [
  { label: 'Creators', text: 'Sustain creative sprints without the crash.' },
  { label: 'Developers', text: 'Hold deep focus through long problem loops.' },
  { label: 'Students', text: 'Study longer with a calm, clear mind.' },
  { label: 'Athletes', text: 'Sharper focus and reaction — clean inputs only.' },
  { label: 'Entrepreneurs', text: 'Make better decisions, all day long.' },
  { label: 'Leaders', text: 'Stay sharp through back-to-back calls.' },
];

const CARD_BG = 'linear-gradient(160deg, #0821D2 0%, #02063A 58%, #000204 100%)';

export default function BuiltForMinds() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    trackRef.current?.scrollBy({ left: dir * 300, behavior: 'smooth' });
  };

  return (
    <section aria-label="Built for high-output minds" className="bg-paper-100 py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 md:px-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-quantico text-caption font-bold uppercase tracking-[0.2em] text-brand-blue">
              Who It&rsquo;s For
            </p>
            <h2 className="mt-3 font-condensed text-3xl font-black uppercase italic leading-[0.95] tracking-tight text-ink sm:text-4xl">
              Built For High-Output Minds.
            </h2>
          </div>
          <div className="hidden shrink-0 gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label="Scroll left"
              className="flex h-10 w-10 cursor-pointer items-center justify-center border border-paper-300 bg-white text-ink transition-colors hover:border-fg"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label="Scroll right"
              className="flex h-10 w-10 cursor-pointer items-center justify-center border border-paper-300 bg-white text-ink transition-colors hover:border-fg"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2"
          style={{ scrollbarWidth: 'none' }}
        >
          {MINDS.map((m, i) => (
            <article
              key={m.label}
              className="relative flex aspect-[3/4] w-[250px] shrink-0 snap-start flex-col justify-end overflow-hidden p-6 text-white"
              style={{ background: CARD_BG }}
            >
              <span className="pointer-events-none absolute right-4 top-3 font-condensed text-6xl font-black italic leading-none text-white/10">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="relative">
                <span aria-hidden className="block h-[3px] w-9 bg-accent" />
                <h3 className="mt-4 font-condensed text-2xl font-black uppercase italic tracking-tight">
                  {m.label}
                </h3>
                <p className="mt-2 font-pt text-caption text-white/75">{m.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
