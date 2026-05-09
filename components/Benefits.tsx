import Image from 'next/image';

import blueBg from '../10x-Assets/Blue Plain Background.png';
import benefitsBanner from '../10x-Assets/Section-2-Banner-1.png';

const benefits = [
  {
    title: 'Powerhouse of Rejuvenation',
    body:
      "Whether it's invigoration for your busy day or the wind down at night so you can rest and recharge, 10X amplifies nourishment for peak performance. It's rapid nourishment for a starving brain.",
  },
  {
    title: "The Winner's Shot",
    body:
      "It's an essential boost in an easy to carry, convenient pack that doesn't need refrigeration and fits in a pocket for high flyers, go-getters, and people outworking the competition.",
  },
  {
    title: 'Energy You Can Control',
    body:
      "Forget nervous, jittery, unsteady energy that's explosive and puts you in a briefly heightened state. 10X is collected, expansive energy that your brain can regulate all day and night.",
  },
];

export default function Benefits() {
  return (
    <section
      aria-label="Benefits of 10X"
      className="relative w-full overflow-hidden text-fg-inverse"
    >
      {/* Full-section background image (decorative) */}
      <Image
        src={blueBg}
        alt=""
        role="presentation"
        fill
        sizes="100vw"
        priority={false}
        className="object-cover object-center"
      />

      {/* All content sits above the bg */}
      <div className="relative z-10">
        {/* ============ Top: heading + paragraph ============ */}
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-6 py-12 sm:px-10 md:grid-cols-2 md:gap-12 md:px-14 md:py-16">
          <div className="inline-block w-fit">
            <span aria-hidden className="block h-[3px] w-full bg-white" />
            <h2 className="my-3 font-condensed italic font-black uppercase leading-[0.9] tracking-tight text-white text-[clamp(2.75rem,7vw,5.5rem)]">
              Benefits
              <br />
              Of 10X
            </h2>
            <span aria-hidden className="block h-[3px] w-full bg-white" />
          </div>

          <p className="font-pt text-body text-white/90 md:text-right">
            With ZERO calories and ZERO sugar, 10X is an indispensable asset for
            those who want to plug into their maximum potential and harness every
            ounce of it in a healthy way. And we deliver within 60 minutes of
            your purchase!
          </p>
        </div>

        {/* ============ Inset banner image ============ */}
        <div className="mx-auto max-w-7xl px-6 pt-10 sm:px-10 md:px-14 md:pt-14">
          <div className="relative aspect-[16/7] w-full overflow-hidden md:aspect-[21/8]">
            <Image
              src={benefitsBanner}
              alt="A group of hikers in mountains carrying 10X energy drinks"
              fill
              sizes="(min-width: 1280px) 1200px, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* ============ 3-column features ============ */}
        <div className="mx-auto max-w-7xl px-6 py-14 sm:px-10 md:px-14 md:py-20">
          <div className="grid gap-10 md:grid-cols-3 md:gap-12">
            {benefits.map((b) => (
              <div key={b.title}>
                <h3 className="whitespace-nowrap font-condensed font-black uppercase tracking-tight text-white text-[clamp(0.95rem,1.6vw,1.35rem)] leading-tight">
                  {b.title}
                </h3>
                <p className="mt-4 font-pt text-body text-white/85">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
