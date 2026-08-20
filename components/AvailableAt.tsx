import Image, { type StaticImageData } from 'next/image';

import tenXLogo from '../10x-Assets/10x-available.png';
import blinkit from '../10x-Assets/Blinkit.png';
import zepto from '../10x-Assets/Zepto.png';
import instamart from '../10x-Assets/Instamartlogo.webp';
import flipkartMinutes from '../10x-Assets/Flipkart Minutes.png';

const partners: { name: string; src: StaticImageData; scale?: string }[] = [
  // 10xdrink source PNG has ~30% whitespace around the artwork; scale it up to match the rest
  { name: '10xdrink.com', src: tenXLogo, scale: 'scale-[1.4]' },
  { name: 'Blinkit', src: blinkit },
  { name: 'Zepto', src: zepto },
  { name: 'Swiggy Instamart', src: instamart },
  { name: 'Flipkart Minutes', src: flipkartMinutes },
];

// Duplicate the list so the marquee scroll has no visible seam
const marqueeItems = [...partners, ...partners];

export default function AvailableAt() {
  return (
    <section
      id="available-at"
      aria-label="Available at"
      className="relative w-full overflow-hidden bg-paper-100 py-14 md:py-20"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-10 md:px-14">
        <h2 className="text-center font-condensed italic font-black uppercase tracking-tight text-fg text-[clamp(2rem,5vw,3.5rem)]">
          Available{' '}
          <span className="inline-block bg-accent px-1 leading-none not-italic text-white">
            At
          </span>
        </h2>

        {/* Static row */}
        <div className="mt-10 hidden grid-cols-2 items-center gap-x-10 gap-y-8 sm:mt-14 sm:grid sm:grid-cols-3 md:mt-16 lg:grid-cols-5">
          {partners.map((p) => (
            <div
              key={p.name}
              className="relative mx-auto flex h-14 w-full max-w-[160px] items-center justify-center md:h-16 lg:h-20"
            >
              <Image
                src={p.src}
                alt={p.name}
                fill
                sizes="160px"
                className={`object-contain dark:brightness-90 ${p.scale ?? ''}`}
              />
            </div>
          ))}
        </div>

        {/* Mobile marquee */}
        <div className="mt-10 sm:hidden">
          <div className="flex animate-[marquee_22s_linear_infinite] gap-12">
            {marqueeItems.map((p, i) => (
              <div
                key={`${p.name}-${i}`}
                className="relative h-16 w-[160px] shrink-0"
              >
                <Image
                  src={p.src}
                  alt={p.name}
                  fill
                  sizes="160px"
                  className={`object-contain dark:brightness-90 ${p.scale ?? ''}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
