import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import adventureImg from '../../10x-Assets/Section-2-Banner-1.png';
import { PRODUCT_IMAGES } from '../../components/productMedia';

const storyImg = PRODUCT_IMAGES.pourBeige;

export const metadata: Metadata = {
  title: 'Our Story',
  description:
    'How 10X was born — a brain-first performance company built to nourish the brain, not override it. The Brain Battery for go-getters.',
  alternates: { canonical: '/our-story' },
};

/* ---------------- Icons (clean line set) ---------------- */
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
function BrainIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M12 5a3 3 0 0 0-6 0 3 3 0 0 0-2.5 4.5A3 3 0 0 0 5 15a3 3 0 0 0 5 2.5V5Z" />
      <path d="M12 5a3 3 0 0 1 6 0 3 3 0 0 1 2.5 4.5A3 3 0 0 1 19 15a3 3 0 0 1-5 2.5V5Z" />
      <path d="M12 5v14" />
    </svg>
  );
}
function MonitorIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  );
}
function FlaskIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3" />
      <path d="M7.5 14h9" />
    </svg>
  );
}
function ClockIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
function BoltOffIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M13 2 4.5 12.5H11l-1 9 4.5-5.6" />
      <path d="M3 3l18 18" />
    </svg>
  );
}
function LeafIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M11 20A7 7 0 0 1 4 13c0-5 4.5-9 16-9 0 9-4 16-9 16Z" />
      <path d="M6 18C9 13 13 10 18 8" />
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
function SparkIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l3.5 3.5M15.5 15.5 19 19M19 5l-3.5 3.5M8.5 15.5 5 19" />
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
function ArrowRight({ className }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

const stats = [
  { value: '20+', label: 'Years of research & training behind the formula', Icon: ClockIcon },
  { value: '3', label: 'Core inputs — amino acids, nutrients & nootropics', Icon: FlaskIcon },
  { value: '0', label: 'Spikes. Crashes. Noise.', Icon: BoltOffIcon },
  { value: '100%', label: 'Brain-first — built for focus, clarity & control', Icon: BrainIcon },
];

const beliefs = [
  { label: 'Mission', Icon: TargetIcon, body: 'Create brain nourishment that revitalises the mind and powers go-getters around the clock.' },
  { label: 'Purpose', Icon: SparkIcon, body: 'Plug people into their maximum potential and liberate them to achieve greatness.' },
  { label: 'Vision', Icon: EyeIcon, body: 'Be the go-to source of sustained nourishment for a sharper, calmer, higher-performing mind.' },
];

export default function OurStoryPage() {
  return (
    <main id="main" className="bg-paper">
      {/* ============ Hero ============ */}
      <section
        className="relative overflow-hidden text-white"
        style={{ background: 'linear-gradient(125deg, #000204 0%, #02063A 38%, #0821D2 100%)' }}
      >
        {/* Decorative brand motif */}
        <PowerUpChevrons className="pointer-events-none absolute -right-6 top-1/2 h-72 w-56 -translate-y-1/2 text-accent/15 md:right-10 md:h-96 md:w-72" />
        <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-32 sm:px-10 md:px-14 md:pb-28 md:pt-40">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-accent" />
            <p className="font-quantico text-caption font-bold uppercase tracking-[0.2em] text-accent">
              Our Story
            </p>
          </div>
          <h1 className="mt-6 max-w-3xl font-condensed text-[clamp(2.75rem,8vw,6rem)] font-black uppercase italic leading-[0.88] tracking-tight">
            A Brain-First
            <br />
            <span className="text-accent">Company</span>
          </h1>
          <p className="mt-7 max-w-xl font-pt text-body-lg text-white/85">
            We can&rsquo;t slow life down. So we set out to upgrade the system everything
            runs on — your brain.
          </p>
        </div>
      </section>

      {/* ============ Stats strip ============ */}
      <section className="border-b border-paper-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 sm:px-10 md:px-14">
          <div className="grid grid-cols-2 gap-px bg-paper-200 md:grid-cols-4">
            {stats.map(({ value, label, Icon }) => (
              <div key={label} className="flex flex-col items-center bg-white px-4 py-12 text-center md:px-6 md:py-16">
                <span className="flex h-14 w-14 items-center justify-center border border-paper-300 text-brand-blue">
                  <Icon className="h-7 w-7" />
                </span>
                <p className="mt-6 font-condensed text-[clamp(2.25rem,4.5vw,3.25rem)] font-black italic leading-none tracking-tight text-fg">
                  {value}
                </p>
                <span aria-hidden className="mt-4 h-[3px] w-8 bg-accent" />
                <p className="mt-4 max-w-[20ch] font-pt text-caption leading-relaxed text-fg-muted">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Why we exist — software vs hardware ============ */}
      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 md:px-14 md:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-quantico text-caption font-bold uppercase tracking-[0.2em] text-brand-blue">
              Why We Exist
            </p>
            <h2 className="mt-4 font-condensed text-[clamp(2rem,5vw,3.5rem)] font-black uppercase italic leading-[0.95] tracking-tight text-fg">
              Everyone Optimizes
              <br />
              The Wrong Thing
            </h2>
          </div>

          <div className="mt-14 grid items-stretch gap-6 md:grid-cols-[1fr_auto_1fr] md:gap-4">
            <div className="flex flex-col border border-paper-200 bg-white p-8 shadow-card md:p-10">
              <span className="flex h-14 w-14 items-center justify-center border-2 border-paper-300 text-fg-muted">
                <MonitorIcon className="h-7 w-7" />
              </span>
              <h3 className="mt-6 font-quantico text-body-lg font-bold uppercase tracking-wide text-fg">
                Optimizing Software
              </h3>
              <p className="mt-3 font-pt text-body text-fg-muted">
                Sleep trackers, productivity apps, endless routines. We fine-tune
                everything around the brain — but rarely the brain itself.
              </p>
            </div>

            <div className="flex items-center justify-center text-brand-blue md:px-2">
              <ArrowRight className="h-8 w-8 rotate-90 md:rotate-0" />
            </div>

            <div className="relative flex flex-col overflow-hidden border-2 border-accent bg-ink p-8 text-white shadow-elevated md:p-10">
              <PowerUpChevrons className="pointer-events-none absolute -right-4 -top-4 h-28 w-20 text-accent/15" />
              <span className="flex h-14 w-14 items-center justify-center border-2 border-accent text-accent">
                <BrainIcon className="h-7 w-7" />
              </span>
              <h3 className="mt-6 font-quantico text-body-lg font-bold uppercase tracking-wide">
                Fixing The Hardware
              </h3>
              <p className="mt-3 font-pt text-body text-white/80">
                Your brain is the multiplier. When it underperforms, everything
                compounds at a lower level. 10X nourishes it directly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ Founder / origin ============ */}
      <section className="bg-paper-100">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 sm:px-10 md:grid-cols-2 md:gap-16 md:px-14 md:py-28">
          <div className="relative">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-paper-200">
              <Image src={storyImg} alt="10X in everyday use" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            </div>
            {/* floating accent chip */}
            <div className="absolute -bottom-5 -right-5 hidden border-2 border-accent bg-ink px-6 py-4 text-white shadow-elevated md:block">
              <p className="font-condensed text-[1.75rem] font-black italic leading-none text-accent">10X</p>
              <p className="mt-1 font-quantico text-[10px] font-bold uppercase tracking-widest text-white/70">The Brain Battery</p>
            </div>
          </div>

          <div>
            <p className="font-quantico text-caption font-bold uppercase tracking-[0.2em] text-brand-blue">
              The Origin
            </p>
            <h2 className="mt-4 font-condensed text-[clamp(2rem,4.5vw,3.25rem)] font-black uppercase italic leading-[0.95] tracking-tight text-fg">
              Born From A
              <br />
              Real Need
            </h2>
            <div className="mt-6 space-y-4 font-pt text-body-lg text-fg-muted">
              <p>
                After two decades of training thousands of high performers, our
                founder kept seeing the same gap: people needed something more
                restorative than coffee, pre-workout, and energy drinks.
              </p>
              <p>
                A nourishing alternative that doesn&rsquo;t make you crash. So began
                years of R&amp;D into the inputs the brain actually needs to perform.
              </p>
            </div>

            {/* pull quote */}
            <figure className="mt-8 border-l-4 border-accent bg-white py-5 pl-6 pr-5 shadow-card">
              <blockquote className="font-condensed text-[clamp(1.25rem,2.5vw,1.6rem)] font-black uppercase italic leading-tight tracking-tight text-fg">
                &ldquo;Don&rsquo;t override the brain. Support it.&rdquo;
              </blockquote>
              <figcaption className="mt-2 font-quantico text-caption font-bold uppercase tracking-widest text-brand-blue">
                The 10X Principle
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ============ Philosophy: support vs override ============ */}
      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 md:px-14 md:py-28">
          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
            <div className="flex items-start gap-5 border border-paper-200 bg-white p-8">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-paper-300 text-fg-muted">
                <BoltOffIcon className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-quantico text-body-lg font-bold uppercase tracking-wide text-fg">
                  Override
                </h3>
                <p className="mt-2 font-pt text-body text-fg-muted">
                  Coffee, energy drinks and nicotine force the brain with harsh
                  stimulants — a temporary high, then an inevitable low.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-5 border-2 border-accent bg-white p-8 shadow-card">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-accent text-brand-blue">
                <LeafIcon className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-quantico text-body-lg font-bold uppercase tracking-wide text-fg">
                  Support
                </h3>
                <p className="mt-2 font-pt text-body text-fg-muted">
                  10X uses ingredients your body already recognises — the right
                  inputs, in the right form, at the right time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ What we believe — mission/purpose/vision ============ */}
      <section className="relative overflow-hidden text-white" style={{ backgroundColor: '#0821D2' }}>
        <PowerUpChevrons className="pointer-events-none absolute -left-8 bottom-0 h-80 w-60 text-white/[0.06]" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 sm:px-10 md:px-14 md:py-28">
          <div className="max-w-2xl">
            <p className="font-quantico text-caption font-bold uppercase tracking-[0.2em] text-accent">
              What We Believe
            </p>
            <h2 className="mt-4 font-condensed text-[clamp(2rem,5vw,3.5rem)] font-black uppercase italic leading-[0.95] tracking-tight">
              The Reason We
              <br />
              Show Up
            </h2>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden border border-white/15 bg-white/15 md:grid-cols-3">
            {beliefs.map(({ label, body, Icon }) => (
              <div key={label} className="bg-[#0821D2] p-8 md:p-10">
                <span className="flex h-14 w-14 items-center justify-center border-2 border-accent text-accent">
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="mt-6 font-quantico text-body-lg font-bold uppercase tracking-wide text-accent">
                  {label}
                </h3>
                <p className="mt-3 font-pt text-body text-white/85">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="relative overflow-hidden bg-ink text-white">
        <Image src={adventureImg} alt="" fill sizes="100vw" className="object-cover opacity-25" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 py-24 text-center sm:px-10 md:px-14 md:py-32">
          <PowerUpChevrons className="mx-auto h-12 w-10 text-accent" />
          <h2 className="mt-6 font-condensed text-[clamp(2rem,5vw,3.5rem)] font-black uppercase italic leading-[0.95] tracking-tight">
            The Brain Battery
            <br />
            For Go-Getters
          </h2>
          <p className="mx-auto mt-5 max-w-md font-pt text-body-lg text-white/80">
            Brain nourishment for focus, clarity, and control — delivered in minutes.
          </p>
          <Link
            href="/#collection"
            className="mt-10 inline-flex cursor-pointer items-center gap-2 bg-accent px-9 py-4 font-quantico text-body-sm font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-accent-hover"
          >
            Shop 10X Daytime
            <ArrowRight />
          </Link>
        </div>
      </section>
    </main>
  );
}
