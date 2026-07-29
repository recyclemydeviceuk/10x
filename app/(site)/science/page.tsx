import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import bgImg from '@/10x-Assets/Section-2-Banner-1.png';
import logo from '@/10x-Assets/10xLogo.webp';

export const metadata: Metadata = {
  title: 'The Science',
  description:
    'How 10X works: brain nourishment, not override. Your brain is the multiplier — calm, controllable energy with no spikes, no crashes, no noise.',
  alternates: { canonical: '/science' },
};

/* ---------------- Icons ---------------- */
type IconProps = { className?: string };

function PowerUpChevrons({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 64" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <polyline points="6 24 24 8 42 24" />
      <polyline points="6 40 24 24 42 40" />
      <polyline points="6 56 24 40 42 56" />
    </svg>
  );
}
function TargetIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" />
    </svg>
  );
}
function EyeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function SlidersIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
      <circle cx="9" cy="7" r="2.2" fill="currentColor" />
      <circle cx="15" cy="12" r="2.2" fill="currentColor" />
      <circle cx="8" cy="17" r="2.2" fill="currentColor" />
    </svg>
  );
}
function ArrowRight({ className }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

/* Energy-over-time chart: stimulant spike/crash vs 10X steady */
function EnergyChart({ className }: IconProps) {
  return (
    <svg viewBox="0 0 480 260" fill="none" className={className} aria-hidden>
      <g stroke="currentColor" strokeOpacity="0.12" strokeWidth="1">
        <line x1="20" y1="50" x2="464" y2="50" />
        <line x1="20" y1="110" x2="464" y2="110" />
        <line x1="20" y1="170" x2="464" y2="170" />
      </g>
      <line x1="20" y1="210" x2="464" y2="210" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />
      <line x1="20" y1="30" x2="20" y2="210" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />

      {/* 10X — steady (area + line) */}
      <path d="M20 200 C120 200 150 120 250 116 C340 112 404 110 464 108 L464 210 L20 210 Z" fill="#6DE325" fillOpacity="0.12" />
      <path d="M20 200 C120 200 150 120 250 116 C340 112 404 110 464 108" stroke="#6DE325" strokeWidth="4" strokeLinecap="round" />
      <circle cx="464" cy="108" r="5" fill="#6DE325" />

      {/* Stimulants — spike then crash (dashed) */}
      <path d="M20 198 L132 198 L168 58 L208 244 L464 234" stroke="#FFFFFF" strokeOpacity="0.5" strokeWidth="2.5" strokeDasharray="6 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const designedFor = [
  { title: 'Focus', Icon: TargetIcon, body: 'A clear, locked-in state for the work that matters — without the nervous, jittery edge.' },
  { title: 'Clarity', Icon: EyeIcon, body: 'A quiet mind that sees the next step. Less noise, more signal, all day long.' },
  { title: 'Control', Icon: SlidersIcon, body: 'Calm, expansive energy your brain can regulate — you stay in the driver’s seat.' },
];

export default function SciencePage() {
  return (
    <main id="main" className="bg-paper">
      {/* ============ Hero — energy curve ============ */}
      <section
        className="relative overflow-hidden text-white"
        style={{ background: 'linear-gradient(160deg, #0821D2 0%, #02063A 48%, #000204 100%)' }}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 pb-16 pt-32 sm:px-10 md:grid-cols-2 md:gap-12 md:px-14 md:pb-24 md:pt-40">
          {/* Left — copy */}
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-accent" />
              <p className="font-quantico text-caption font-bold uppercase tracking-[0.2em] text-accent">The Science</p>
            </div>
            <h1 className="mt-6 font-condensed text-[clamp(2.75rem,7vw,5.5rem)] font-black uppercase italic leading-[0.88] tracking-tight">
              Energy You
              <br />
              Can <span className="text-accent">Control</span>
            </h1>
            <p className="mt-6 max-w-md font-pt text-body-lg text-white/85">
              Stimulants force a spike, then drop you into a crash. 10X supports the
              brain for calm, sustained output.
            </p>

            {/* Legend */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3">
                <span className="h-1 w-8 rounded-full bg-accent" />
                <span className="font-quantico text-caption font-bold uppercase tracking-wide text-white">10X — calm &amp; sustained</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-0 w-8 border-t-2 border-dashed border-white/50" />
                <span className="font-quantico text-caption font-bold uppercase tracking-wide text-white/60">Stimulants — spike, then crash</span>
              </div>
            </div>
          </div>

          {/* Right — chart */}
          <div className="relative">
            <div aria-hidden className="pointer-events-none absolute inset-0 -m-6 rounded-full bg-accent/10 blur-3xl" />
            <div className="relative border border-white/15 bg-white/[0.03] p-5 text-white md:p-7">
              <div className="mb-4 flex items-center justify-between font-quantico text-[10px] font-bold uppercase tracking-widest text-white/50">
                <span>Energy</span>
                <span>Over a Day</span>
              </div>
              <EnergyChart className="h-auto w-full text-white" />
            </div>
          </div>
        </div>
      </section>

      {/* ============ The Multiplier ============ */}
      <section className="bg-paper">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 sm:px-10 md:grid-cols-[1.1fr_0.9fr] md:gap-16 md:px-14 md:py-28">
          <div>
            <p className="font-quantico text-caption font-bold uppercase tracking-[0.2em] text-brand-blue">
              The Big Idea
            </p>
            <h2 className="mt-4 font-condensed text-[clamp(2rem,4.5vw,3.25rem)] font-black uppercase italic leading-[0.95] tracking-tight text-fg">
              Your Brain Is
              <br />
              The Multiplier
            </h2>
            <div className="mt-6 space-y-4 font-pt text-body-lg text-fg-muted">
              <p>
                Everyone optimizes software — sleep, routines, apps. But your brain is
                the hardware it all runs on.
              </p>
              <p>
                When the multiplier underperforms, everything downstream compounds at a
                lower level. Nourish it directly, and the whole system lifts.
              </p>
            </div>
          </div>

          {/* Multiplier graphic */}
          <div className="relative flex aspect-square items-center justify-center overflow-hidden border-2 border-accent bg-ink text-white">
            <PowerUpChevrons className="pointer-events-none absolute right-4 top-4 h-20 w-16 text-accent/20" />
            <div className="px-8 text-center">
              <Image
                src={logo}
                alt="10X — The Brain Battery"
                width={240}
                height={98}
                className="mx-auto h-auto w-44 md:w-56"
              />
              <p className="mt-6 font-quantico text-caption font-bold uppercase tracking-widest text-white/70">
                Nourish the multiplier
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ Designed For — numbered ledger list ============ */}
      <section className="text-white" style={{ backgroundColor: '#0821D2' }}>
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 md:px-14 md:py-28">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-accent" />
            <p className="font-quantico text-caption font-bold uppercase tracking-[0.2em] text-accent">
              What You Feel
            </p>
          </div>
          <h2 className="mt-4 max-w-2xl font-condensed text-[clamp(2rem,5vw,3.5rem)] font-black uppercase italic leading-[0.95] tracking-tight">
            Designed For
          </h2>

          <div className="mt-12 border-t border-white/15">
            {designedFor.map(({ title, body, Icon }, i) => (
              <div
                key={title}
                className="grid grid-cols-1 items-center gap-5 border-b border-white/15 py-8 md:grid-cols-[auto_1fr_1.25fr] md:gap-12 md:py-10"
              >
                <div className="flex items-center gap-5">
                  <span aria-hidden className="font-condensed text-[clamp(2.25rem,5vw,3.5rem)] font-black italic leading-none text-white/20">
                    0{i + 1}
                  </span>
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center border-2 border-accent text-accent">
                    <Icon className="h-7 w-7" />
                  </span>
                </div>
                <h3 className="font-condensed text-[clamp(1.75rem,3.5vw,2.75rem)] font-black uppercase italic leading-none tracking-tight text-white">
                  {title}
                </h3>
                <p className="font-pt text-body text-white/80 md:text-right">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA — full-bleed split panel + image ============ */}
      <section className="bg-ink text-white">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left — content */}
          <div
            className="flex flex-col justify-center px-6 py-20 sm:px-10 md:px-14 md:py-28 lg:px-20"
            style={{ background: 'linear-gradient(135deg, #000204 0%, #02063A 45%, #0821D2 130%)' }}
          >
            <div className="w-full max-w-xl md:ml-auto">
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-accent" />
                <p className="font-quantico text-caption font-bold uppercase tracking-[0.2em] text-accent">Take Control</p>
              </div>
              <h2 className="mt-5 font-condensed text-[clamp(2rem,5vw,3.5rem)] font-black uppercase italic leading-[0.92] tracking-tight">
                No Spikes.
                <br />
                No Crashes.
                <br />
                No Noise.
              </h2>
              <p className="mt-5 max-w-md font-pt text-body-lg text-white/80">
                Just the right inputs — calm, controllable energy your brain can
                regulate, all day.
              </p>
              <Link
                href="/#collection"
                className="mt-9 inline-flex w-fit cursor-pointer items-center gap-2 bg-accent px-9 py-4 font-quantico text-body-sm font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-accent-hover"
              >
                Shop 10X Daytime
                <ArrowRight />
              </Link>
            </div>
          </div>

          {/* Right — image */}
          <div className="relative min-h-[320px] md:min-h-0">
            <Image src={bgImg} alt="Go-getters powered by 10X" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-ink/50 to-transparent" />
          </div>
        </div>
      </section>
    </main>
  );
}
