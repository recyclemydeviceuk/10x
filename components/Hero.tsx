import Link from 'next/link';

const PRODUCT_HREF = '/products/10x-daytime';

const HERO_VIDEO =
  'https://res.cloudinary.com/dwo7y0jxw/video/upload/v1786902123/Natual_clean_slow_dance_202607311223_2_ycdwe1.mp4';

export default function Hero() {
  return (
    <section
      id="hero"
      aria-label="The Brain Battery"
      className="relative mt-[72px] hidden w-full overflow-hidden bg-ink lg:block"
    >
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover object-center"
      >
        <source src={HERO_VIDEO} type="video/mp4" />
      </video>

      {/* Full dark overlay — low opacity so the video stays visible */}
      <div
        aria-hidden
        className="absolute inset-0 bg-black/40"
      />

      {/* Copy */}
      <div className="relative z-10 mx-auto flex min-h-[560px] max-w-7xl items-center px-5 py-20 sm:px-8 md:px-14 lg:min-h-[80vh] lg:max-h-[820px]">
        <div className="max-w-[560px]">
          <p className="type-k text-white/70">The Brain Battery</p>

          <h1 className="type-d1 mt-5 whitespace-nowrap text-white">
            Fuel Better
            <br />
            Thinking.
          </h1>

          <p className="type-b1 mt-6 max-w-[540px] text-white/85">
            No buzz. No crash. No moment it &lsquo;kicks in.&rsquo;
            <br />
            Just a quietly better afternoon.
          </p>

          <div className="mt-8">
            <Link
              href={PRODUCT_HREF}
              className="type-k inline-flex cursor-pointer items-center gap-2 bg-accent px-8 py-3.5 text-ink shadow-glow-soft transition-colors hover:bg-accent-hover"
            >
              Order Now
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>

          <figure className="mt-9 max-w-[440px]">
            <blockquote className="font-pt text-lg font-bold italic leading-snug text-white md:text-xl">
              &ldquo;I started dancing again. Don&rsquo;t know if it&rsquo;s the 10X.&rdquo;
            </blockquote>
            <figcaption className="type-b2 mt-2.5 text-white/60">
              — an early user. That&rsquo;s the review we&rsquo;re proudest of.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
