import Image from 'next/image';
import Link from 'next/link';

import { PRODUCT_IMAGES } from './productMedia';

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden bg-ink text-fg-inverse"
      aria-label="The Brain Battery"
    >
      {/* Background image — wide hero crop with the product left-of-centre */}
      <Image
        src={PRODUCT_IMAGES.heroBanner}
        alt="10X Daytime can and single-serve sachet on a kitchen counter"
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Left blue gradient overlay — keeps text legible */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, #02063A 0%, #0821D2 30%, rgba(8,33,210,0.55) 58%, rgba(8,33,210,0.0) 80%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex min-h-[500px] items-center py-14 md:min-h-[620px] md:py-20 lg:min-h-[720px] lg:py-24">
        <div className="w-full max-w-7xl px-6 sm:px-10 md:px-14">
          <div className="max-w-2xl">
            <h1 className="font-condensed italic font-black uppercase leading-[0.88] tracking-tight text-white text-[clamp(3rem,8vw,6.5rem)]">
              <span className="block whitespace-nowrap">The Brain</span>
              <span className="block whitespace-nowrap">Battery</span>
            </h1>

            <p className="mt-6 max-w-md font-pt text-body font-bold uppercase tracking-[0.04em] text-white/90">
              Brain nourishment for focus, clarity, and control.
              <br className="hidden sm:block" />
              No spikes. No crashes. No noise.
            </p>

            <Link
              href="#collection"
              className="mt-8 inline-flex cursor-pointer items-center gap-2 border-2 border-accent bg-transparent px-7 py-3 font-quantico text-body-sm font-bold uppercase tracking-[0.18em] text-accent transition hover:bg-accent hover:text-ink"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
