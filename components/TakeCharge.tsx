import Image from 'next/image';
import Link from 'next/link';

import takeChargeBg from '../10x-Assets/TakeChargeBG-mKiw2fP8.png';

export default function TakeCharge() {
  return (
    <section
      id="take-charge"
      aria-label="Don't override the brain. Support it."
      className="bg-paper-100"
    >
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* ============ Left: copy + CTA ============ */}
        <div className="flex items-center bg-paper-100 px-6 py-16 sm:px-10 md:px-14 md:py-24 lg:px-20 lg:py-32">
          <div className="max-w-xl">
            <h2 className="font-condensed font-black uppercase leading-[0.95] tracking-tight text-fg text-[clamp(2.25rem,5vw,4rem)]">
              <span className="block">Don&rsquo;t Override.</span>
              <span className="block">Support It.</span>
            </h2>

            <p className="mt-6 max-w-md font-pt text-body text-fg-muted">
              More output, more decisions, more pressure — same system. That&rsquo;s
              the bottleneck. 10X supports the hardware it all runs on: your brain.
              No hacks. No shortcuts. No override — just the right inputs, in the
              right form, at the right time.
            </p>

            <Link
              href="#collection"
              className="btn-accent mt-8 inline-flex cursor-pointer items-center gap-2 px-8 py-3 font-quantico text-body-sm font-bold uppercase tracking-[0.18em] shadow-elevated transition hover:opacity-90"
            >
              Buy Now
            </Link>
          </div>
        </div>

        {/* ============ Right: product image ============ */}
        <div className="relative min-h-[320px] md:min-h-0">
          <Image
            src={takeChargeBg}
            alt="10X Daytime can on a vibrant lime green background"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}
