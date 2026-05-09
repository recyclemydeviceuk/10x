import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';

import productDay from '../10x-Assets/Product Gallery image/Day-2.jpg';

type Product = {
  name: string;
  pack: string;
  price: string;
  image: StaticImageData;
};

const products: Product[] = [
  { name: 'Lime Charge', pack: 'Pack of 2 (60ml)', price: '₹299.00', image: productDay },
];

const ctaGradient =
  'linear-gradient(90deg, #000204 0%, #02063A 35%, #06189E 100%)';

export default function Collection() {
  return (
    <section
      aria-label="Our Collection"
      className="bg-paper py-14 md:py-20"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-10 md:px-14">
        {/* ============ Header ============ */}
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <div className="inline-block w-fit">
              <span aria-hidden className="block h-[3px] w-full bg-fg" />
              <h2 className="my-2 font-condensed italic font-black uppercase leading-[0.95] tracking-tight text-fg text-[clamp(2rem,4.5vw,3.25rem)]">
                Collection
              </h2>
              <span aria-hidden className="block h-[3px] w-full bg-fg" />
            </div>
            <p className="mt-4 font-pt text-body text-fg-muted">
              Take a look at our expansive collection.
            </p>
          </div>

          <Link
            href="#"
            className="cursor-pointer bg-transparent px-6 py-3 font-quantico text-body-sm font-bold uppercase tracking-[0.18em] text-brand-blue transition hover:opacity-80"
            style={{
              cursor: 'pointer',
              border: '2px solid',
              borderImage: `${ctaGradient} 1`,
            }}
          >
            View All
          </Link>
        </div>

        {/* ============ Product card(s) ============ */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-16 md:gap-8 lg:grid-cols-3">
          {products.map((p) => (
            <article
              key={p.name}
              className="flex flex-col border border-paper-200 bg-paper p-3 shadow-card"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-paper-100">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  sizes="(min-width: 1024px) 280px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>

              <div className="mt-4 flex items-start justify-between gap-3 px-1">
                <div>
                  <h3 className="font-quantico text-body font-bold text-fg">
                    {p.name}
                  </h3>
                  <p className="mt-1 font-pt text-caption text-fg-muted">
                    {p.pack}
                  </p>
                </div>
                <p className="font-quantico text-body font-bold text-fg">
                  {p.price}
                </p>
              </div>

              <button
                type="button"
                className="mt-4 w-full cursor-pointer bg-transparent px-4 py-3 font-quantico text-body-sm font-bold uppercase tracking-[0.18em] text-brand-blue transition hover:opacity-80"
                style={{
                  cursor: 'pointer',
                  border: '2px solid',
                  borderImage: `${ctaGradient} 1`,
                }}
              >
                Add to Cart
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
