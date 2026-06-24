import Image from 'next/image';

const BG_IMAGE =
  'https://res.cloudinary.com/dpq1nvxmd/image/upload/v1781942860/Banner-3_tqhuc2.jpg';

export default function WhoWeAre() {
  return (
    <section
      id="who-we-are"
      aria-label="Who we are"
      className="relative w-full overflow-hidden bg-pastel-lime lg:bg-brand-blue"
    >
      {/* Image — left half, lg and up only (hidden on mobile for a clean full section) */}
      <div className="absolute inset-y-0 left-0 z-0 hidden w-[56%] lg:block">
        <Image
          src={BG_IMAGE}
          alt="10X — fuel better thinking"
          fill
          sizes="56vw"
          className="object-cover object-center"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex max-w-7xl items-center px-5 py-12 sm:px-8 sm:py-16 md:px-14 md:py-24 lg:min-h-[680px]">
        <div className="w-full lg:ml-auto lg:max-w-lg lg:bg-white lg:p-12 lg:shadow-elevated lg:-translate-x-16 xl:-translate-x-28">
          <h2 className="font-condensed text-3xl font-black uppercase italic leading-[0.95] tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Your Brain Is Your Most Important Tool.
          </h2>

          <p className="mt-5 font-pt text-body text-fg sm:text-body-lg">
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
