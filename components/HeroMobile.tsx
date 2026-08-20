import Link from 'next/link';

const PRODUCT_HREF = '/products/10x-daytime';

const HERO_VIDEO_MOBILE =
  'https://res.cloudinary.com/dwo7y0jxw/video/upload/v1786902122/Hero_Video_rvmu5m.mp4';

export default function HeroMobile() {
  return (
    <section
      id="hero-mobile"
      aria-label="The Brain Battery"
      className="relative mt-14 w-full overflow-hidden bg-ink lg:hidden"
    >
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover object-[72%_center]"
      >
        <source src={HERO_VIDEO_MOBILE} type="video/mp4" />
      </video>

      {/* Full dark overlay — low opacity so the video stays visible */}
      <div
        aria-hidden
        className="absolute inset-0 bg-black/40"
      />

      {/* Copy — bottom-anchored, left-aligned */}
      <div className="relative z-10 flex h-[85svh] max-h-[720px] min-h-[540px] flex-col justify-end px-5 pb-10">
        <p className="type-k text-white/70">The Brain Battery</p>

        <h1 className="type-d1 mt-3 text-white">
          Fuel Better
          <br />
          Thinking.
        </h1>

        <p className="type-b1 mt-4 max-w-md text-white/85">
          No buzz. No crash. No moment it &lsquo;kicks in.&rsquo;{' '}
          <br className="hidden sm:inline" />
          Just a quietly better afternoon.
        </p>

        <div className="mt-5">
          <Link
            href={PRODUCT_HREF}
            className="type-k inline-flex cursor-pointer items-center gap-2 bg-accent px-6 py-3 text-ink shadow-glow-soft transition-colors hover:bg-accent-hover"
          >
            Order Now
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>

        <figure className="mt-6 max-w-md">
          <blockquote className="font-pt text-base font-bold italic leading-snug text-white">
            &ldquo;I started dancing again. Don&rsquo;t know if it&rsquo;s the 10X.&rdquo;
          </blockquote>
          <figcaption className="type-b2 mt-2 text-white/60">
            — an early user. That&rsquo;s the review we&rsquo;re proudest of.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
