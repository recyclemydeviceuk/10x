import Image from 'next/image';

const BG_IMAGE =
  'https://res.cloudinary.com/dpq1nvxmd/image/upload/v1781942860/Banner-3_tqhuc2.jpg';

export default function WhoWeAre() {
  return (
    <section
      id="who-we-are"
      aria-label="Who we are"
      className="relative w-full overflow-hidden bg-brand-blue"
    >
      {/* Image — left, bleeds to the left edge */}
      <div className="absolute inset-y-0 left-0 z-0 w-full lg:w-[56%]">
        <Image
          src={BG_IMAGE}
          alt="10X — fuel better thinking"
          fill
          sizes="(min-width: 1024px) 56vw, 100vw"
          className="object-cover object-center"
        />
        {/* dim the image a touch on mobile so the card reads */}
        <div aria-hidden className="absolute inset-0 bg-ink/30 lg:hidden" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[560px] max-w-7xl items-center px-6 py-16 sm:px-10 md:min-h-[680px] md:px-14 md:py-24">
        <div className="ml-auto w-full max-w-lg bg-white p-8 shadow-elevated sm:p-10 md:p-12 lg:-translate-x-16 xl:-translate-x-28">
          <p className="font-quantico text-caption font-bold uppercase tracking-[0.24em] text-brand-blue">
            Who We Are
          </p>
          <h2 className="mt-4 font-condensed text-3xl font-black uppercase italic leading-[0.95] tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Your Brain Is Your Most Important Tool.
          </h2>

          <p className="mt-6 font-pt text-body-lg text-fg">
            Every thought. Every action. Every result.{' '}
            <span className="font-bold text-brand-blue">Begins there.</span>
          </p>
          <p className="mt-4 max-w-md font-pt text-body text-fg-muted">
            10X exists for the people who rely on their minds every day — and want
            to keep that edge sharp.
          </p>
        </div>
      </div>
    </section>
  );
}
