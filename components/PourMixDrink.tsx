import Image from 'next/image';

import banner from '../10x-Assets/POUR IT-MIX IT-DRINK IT.jpg';

export default function PourMixDrink() {
  return (
    <section
      id="pour-mix-drink"
      aria-label="Pour it. Mix it. Drink it."
      className="bg-paper py-3 sm:py-4 md:py-5"
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-5">
        <div className="relative aspect-[1320/495] w-full overflow-hidden">
          <Image
            src={banner}
            alt="Three-step usage: Pour 10X into water, mix it, and drink it"
            fill
            sizes="(min-width: 1280px) 1200px, 100vw"
            priority={false}
            className="object-cover dark:brightness-90"
          />
        </div>
      </div>
    </section>
  );
}
