import type { Metadata } from 'next';
import Link from 'next/link';

import ThemedProductImage from '@/components/ThemedImage';
import { PRODUCT_IMAGES } from '@/components/productMedia';

export const metadata: Metadata = {
  title: 'Formulation',
  description:
    '10X is a precise blend of amino acids, nutrients, and nootropics — ingredients your body already recognizes from everyday foods, used here in more effective forms. Nothing excessive.',
  alternates: { canonical: '/formulation' },
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
function AtomIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <circle cx="12" cy="12" r="1.5" />
      <ellipse cx="12" cy="12" rx="10" ry="4.5" />
      <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(120 12 12)" />
    </svg>
  );
}
function DropletIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" />
      <path d="M9.5 14a2.5 2.5 0 0 0 2.5 2.5" />
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
function BoltOffIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M13 2 4.5 12.5H11l-1 9 4.5-5.6" />
      <path d="M3 3l18 18" />
    </svg>
  );
}
function BanIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M5.6 5.6 18.4 18.4" />
    </svg>
  );
}
function FlatlineIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M2 12h6l2-5 3 10 2-5h7" />
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
function FlaskIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3" />
      <path d="M7.5 14h9" />
    </svg>
  );
}
function ShieldCheckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />
      <path d="m9 11.5 2 2 4-4" />
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

const blend = [
  { title: 'Amino Acids', Icon: AtomIcon, body: 'The building blocks your brain uses to make neurotransmitters — the chemistry behind focus and a steady mood.' },
  { title: 'Nutrients', Icon: DropletIcon, body: 'Vitamins and minerals your body already recognises from everyday food, delivered in more effective, bioavailable forms.' },
  { title: 'Nootropics', Icon: BrainIcon, body: 'Studied compounds that support clarity and cognition — to nourish the brain, never to override it.' },
];

const freeFrom = [
  { label: 'Harsh Stimulants', Icon: BoltOffIcon },
  { label: 'Unnecessary Additives', Icon: BanIcon },
  { label: 'Spikes & Crashes', Icon: FlatlineIcon },
  { label: 'Hidden Nonsense', Icon: BanIcon },
];

const principles = [
  { title: 'Recognizable', Icon: LeafIcon, body: 'Ingredients your body already knows from everyday foods — nothing alien, nothing extreme.' },
  { title: 'More Effective Forms', Icon: FlaskIcon, body: 'Delivered in bioavailable forms designed to actually absorb and do their job.' },
  { title: 'Nothing Hidden', Icon: ShieldCheckIcon, body: 'Clean, simple and well understood. If it doesn’t earn its place, it isn’t in the pack.' },
];

export default function FormulationPage() {
  return (
    <main id="main" className="bg-paper">
      {/* ============ Hero — the formula equation ============ */}
      <section
        className="relative overflow-hidden text-white"
        style={{ backgroundColor: '#000204' }}
      >
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-80 w-[40rem] max-w-full -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-6 pb-20 pt-32 text-center sm:px-10 md:px-14 md:pb-28 md:pt-40">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-accent" />
            <p className="font-quantico text-caption font-bold uppercase tracking-[0.2em] text-accent">Formulation</p>
            <span className="h-px w-8 bg-accent" />
          </div>
          <h1 className="mt-6 font-condensed text-[clamp(2.75rem,8vw,6rem)] font-black uppercase italic leading-[0.9] tracking-tight">
            The 10X <span className="text-accent">Formula</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl font-pt text-body-lg text-white/85">
            Every ingredient earns its place. Three inputs, combined to nourish the
            brain — not override it.
          </p>

          {/* Equation: AminoAcids + Nutrients + Nootropics = 10X */}
          <div className="mt-14 flex flex-wrap items-stretch justify-center gap-3 md:mt-16 md:gap-5">
            <div className="flex w-28 flex-col items-center justify-center gap-3 border border-white/15 bg-white/[0.04] px-3 py-6 md:w-32">
              <AtomIcon className="h-8 w-8 text-accent" />
              <span className="text-center font-quantico text-[11px] font-bold uppercase tracking-wider text-white">Amino Acids</span>
            </div>
            <span className="self-center font-condensed text-3xl font-black leading-none text-accent md:text-4xl">+</span>
            <div className="flex w-28 flex-col items-center justify-center gap-3 border border-white/15 bg-white/[0.04] px-3 py-6 md:w-32">
              <DropletIcon className="h-8 w-8 text-accent" />
              <span className="text-center font-quantico text-[11px] font-bold uppercase tracking-wider text-white">Nutrients</span>
            </div>
            <span className="self-center font-condensed text-3xl font-black leading-none text-accent md:text-4xl">+</span>
            <div className="flex w-28 flex-col items-center justify-center gap-3 border border-white/15 bg-white/[0.04] px-3 py-6 md:w-32">
              <BrainIcon className="h-8 w-8 text-accent" />
              <span className="text-center font-quantico text-[11px] font-bold uppercase tracking-wider text-white">Nootropics</span>
            </div>
            <span className="self-center font-condensed text-3xl font-black leading-none text-white/50 md:text-4xl">=</span>
            <div className="flex w-28 flex-col items-center justify-center gap-1 border-2 border-accent bg-accent/10 px-3 py-6 md:w-32">
              <span className="font-condensed text-[1.75rem] font-black italic leading-none text-accent">10X</span>
              <span className="text-center font-quantico text-[10px] font-bold uppercase tracking-widest text-white/80">Brain Battery</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ The Blend — 3 inputs ============ */}
      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 md:px-14 md:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-quantico text-caption font-bold uppercase tracking-[0.2em] text-accent">
              What&rsquo;s Inside
            </p>
            <h2 className="mt-4 font-condensed text-[clamp(2rem,5vw,3.5rem)] font-black uppercase italic leading-[0.95] tracking-tight text-fg">
              Three Inputs.
              <br />
              One Purpose.
            </h2>
            <p className="mt-5 font-pt text-body-lg text-fg-muted">
              A focused formula — every ingredient earns its place.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3 md:gap-8">
            {blend.map(({ title, body, Icon }, i) => (
              <div key={title} className="group relative overflow-hidden border border-paper-200 bg-white dark:bg-paper p-8 transition-colors hover:border-accent md:p-10">
                <span aria-hidden className="absolute -right-1 top-0 font-condensed text-[6rem] font-black italic leading-none text-paper-100">
                  0{i + 1}
                </span>
                <span className="relative flex h-16 w-16 items-center justify-center border-2 border-accent text-accent">
                  <Icon className="h-8 w-8" />
                </span>
                <h3 className="relative mt-7 font-quantico text-body-lg font-bold uppercase tracking-wide text-fg">
                  {title}
                </h3>
                <span aria-hidden className="relative mt-3 block h-[3px] w-8 bg-accent" />
                <p className="relative mt-4 font-pt text-body text-fg-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ What's NOT inside ============ */}
      <section className="relative overflow-hidden bg-ink text-white">
        <PowerUpChevrons className="pointer-events-none absolute -left-6 top-1/2 h-72 w-56 -translate-y-1/2 text-accent/[0.06]" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 sm:px-10 md:px-14 md:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-quantico text-caption font-bold uppercase tracking-[0.2em] text-accent">
              Nothing Excessive
            </p>
            <h2 className="mt-4 font-condensed text-[clamp(2rem,5vw,3.5rem)] font-black uppercase italic leading-[0.95] tracking-tight">
              What&rsquo;s Not Inside
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden border border-white/10 bg-white/10 lg:grid-cols-4">
            {freeFrom.map(({ label, Icon }) => (
              <div key={label} className="flex flex-col items-center bg-ink px-5 py-10 text-center">
                <span className="flex h-14 w-14 items-center justify-center border-2 border-accent text-accent">
                  <Icon className="h-7 w-7" />
                </span>
                <p className="mt-5 font-quantico text-caption font-bold uppercase tracking-widest text-white/60">
                  No
                </p>
                <p className="mt-1 font-quantico text-body-sm font-bold uppercase tracking-wide text-white">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Principles + product ============ */}
      <section className="bg-paper-100 dark:bg-paper-100">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 sm:px-10 md:grid-cols-2 md:gap-16 md:px-14 md:py-28">
          <div className="relative order-last md:order-first">
            <div className="relative aspect-square w-full overflow-hidden border border-paper-200 bg-white dark:bg-paper">
              <ThemedProductImage src={PRODUCT_IMAGES.front} alt="10X Daytime can" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            </div>
            <PowerUpChevrons className="pointer-events-none absolute -bottom-5 -left-5 hidden h-24 w-20 text-accent md:block" />
          </div>

          <div>
            <p className="font-quantico text-caption font-bold uppercase tracking-[0.2em] text-accent">
              Our Standard
            </p>
            <h2 className="mt-4 font-condensed text-[clamp(2rem,4.5vw,3.25rem)] font-black uppercase italic leading-[0.95] tracking-tight text-fg">
              Simple. Real.
              <br />
              Understood.
            </h2>

            <div className="mt-10 space-y-8">
              {principles.map(({ title, body, Icon }) => (
                <div key={title} className="flex items-start gap-5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-accent text-accent">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-quantico text-body-lg font-bold uppercase tracking-wide text-fg">{title}</h3>
                    <p className="mt-1.5 font-pt text-body text-fg-muted">{body}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/#collection"
              className="mt-10 inline-flex cursor-pointer items-center gap-2 bg-accent px-9 py-4 font-quantico text-body-sm font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-accent-hover"
            >
              Shop 10X Daytime
              <ArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
