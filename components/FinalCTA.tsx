import Link from 'next/link';

const PRODUCT_HREF = '/products/10x-daytime';

export default function FinalCTA() {
  return (
    <section
      id="final-cta"
      aria-label="Ready to fuel better thinking?"
      className="relative overflow-hidden bg-white text-ink"
    >
      {/* dot-grid pattern, faded toward the edges */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(rgba(8,33,210,0.13) 1.3px, transparent 1.3px)',
          backgroundSize: '24px 24px',
          maskImage:
            'radial-gradient(ellipse 75% 80% at 50% 50%, #000 35%, transparent 78%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 75% 80% at 50% 50%, #000 35%, transparent 78%)',
        }}
      />
      {/* soft green glow behind the headline */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(42% 55% at 50% 42%, rgba(109,227,37,0.14) 0%, rgba(255,255,255,0) 70%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-24 text-center sm:px-10 md:px-14 md:py-36">
        <span aria-hidden className="mx-auto block h-[3px] w-10 bg-accent" />

        <h2 className="mt-8 font-condensed text-4xl font-black uppercase italic leading-[0.95] tracking-tight text-ink sm:text-5xl lg:text-6xl">
          Ready To Fuel Better Thinking?
        </h2>

        <Link
          href={PRODUCT_HREF}
          className="mt-10 inline-flex cursor-pointer items-center gap-2 bg-accent px-10 py-4 font-quantico text-body-sm font-bold uppercase tracking-[0.18em] text-ink shadow-glow-soft transition-colors hover:bg-accent-hover"
        >
          Order Now
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
