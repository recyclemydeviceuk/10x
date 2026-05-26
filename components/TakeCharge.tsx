import Image from 'next/image';
import Link from 'next/link';

import takeChargeBg from '../10x-Assets/TakeChargeBG-mKiw2fP8.png';

export default function TakeCharge() {
  return (
    <section
      id="take-charge"
      aria-label="Take Charge. Own The Day."
      className="bg-paper-100"
    >
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* ============ Left: copy + CTA ============ */}
        <div className="flex items-center bg-paper-100 px-6 py-16 sm:px-10 md:px-14 md:py-24 lg:px-20 lg:py-32">
          <div className="max-w-xl">
            <h2 className="font-condensed font-black uppercase leading-[0.95] tracking-tight text-fg text-[clamp(2.25rem,5vw,4rem)]">
              <span className="block">Take Charge.</span>
              <span className="block">Own The Day.</span>
            </h2>

            <p className="mt-6 max-w-md font-pt text-body text-fg-muted">
              10X Formulas was born out of a deep understanding of nutritional
              needs and a dedication to improving people&rsquo;s daily performance
              through proper brain nourishment. Harness your potential with 10X
              to tackle your day with confidence and clarity.
            </p>

            <Link
              href="#collection"
              className="mt-8 inline-flex cursor-pointer items-center gap-2 px-8 py-3 font-quantico text-body-sm font-bold uppercase tracking-[0.18em] text-white shadow-elevated transition hover:opacity-90"
              style={{
                background:
                  'linear-gradient(90deg, #000204 0%, #02063A 35%, #06189E 100%)',
              }}
            >
              Buy Now
            </Link>
          </div>
        </div>

        {/* ============ Right: product image ============ */}
        <div className="relative min-h-[320px] md:min-h-0">
          <Image
            src={takeChargeBg}
            alt="10X Lime Charge can on a vibrant lime green background"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}
