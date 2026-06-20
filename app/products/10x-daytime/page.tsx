import type { Metadata } from 'next';
import Link from 'next/link';

import ProductGallery, { type GalleryImage } from '../../../components/ProductGallery';
import PlanSelector from '../../../components/PlanSelector';
import IngredientStrip from '../../../components/IngredientStrip';
import ProductFAQ from '../../../components/ProductFAQ';
import BuiltForMinds from '../../../components/BuiltForMinds';

import { PRODUCT_IMAGES } from '../../../components/productMedia';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://10xdrink.com';

export const metadata: Metadata = {
  title: '10X Day Time — The Brain Battery | Fuel Better Thinking',
  description:
    '10X Day Time: a premium brain nourishment formula for calm focus, cognitive clarity, and sustained mental performance. One-time ₹1,199 (10 servings) or monthly ₹2,999 (30 servings). Also on Blinkit & Zepto.',
  alternates: { canonical: '/products/10x-daytime' },
};

const gallery: GalleryImage[] = [
  { src: PRODUCT_IMAGES.front, alt: '10X Day Time — can and sachet, front view' },
  { src: PRODUCT_IMAGES.sachetsHeld, alt: 'Holding portable 10X sachets' },
  { src: PRODUCT_IMAGES.pourOffice, alt: 'Pouring 10X into a glass of water' },
  { src: PRODUCT_IMAGES.canSingle, alt: '10X Day Time can on a kitchen counter' },
  { src: PRODUCT_IMAGES.sachetsFlat, alt: '10X single-serve sachets' },
  { src: PRODUCT_IMAGES.back, alt: '10X Day Time — back panel' },
  { src: PRODUCT_IMAGES.right, alt: '10X Day Time — ingredients panel' },
  { src: PRODUCT_IMAGES.pourBeige, alt: '10X mixing into water' },
];

const productJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: '10X Day Time',
  alternateName: 'THE BRAIN BATTERY',
  description:
    'A premium brain nourishment formula designed to support calm focus, cognitive clarity, and sustained mental performance.',
  brand: { '@type': 'Brand', name: '10X' },
  image: [`${SITE_URL}/product-hero.jpg`],
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'INR',
    lowPrice: '1199',
    highPrice: '2999',
    offerCount: '2',
    availability: 'https://schema.org/InStock',
  },
};

export default function ProductPage() {
  return (
    <main id="main" className="bg-white pt-16 md:pt-[72px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      {/* ============ Gallery + Purchase ============ */}
      <section className="mx-auto max-w-7xl px-6 py-10 sm:px-10 md:px-14 md:py-14">
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 font-pt text-caption text-fg-muted">
          <Link href="/" className="inline-flex items-center gap-1 transition-colors hover:text-fg">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Home
          </Link>
          <span aria-hidden>/</span>
          <span className="text-fg">10X Day Time</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-14">
          {/* Gallery */}
          <ProductGallery images={gallery} />

          {/* Info + purchase */}
          <div className="md:py-1">
            <p className="font-quantico text-caption font-bold uppercase tracking-[0.2em] text-brand-blue">
              The Brain Battery
            </p>
            <h1 className="mt-2 font-condensed text-4xl font-black uppercase italic leading-[0.95] tracking-tight text-ink sm:text-5xl">
              10X Day Time
            </h1>

            <p className="mt-5 max-w-md font-pt text-body-lg text-fg-muted">
              A premium brain nourishment formula designed to support calm focus,
              cognitive clarity, and sustained mental performance. Built for
              creators, developers, athletes, and directors.
            </p>

            <div className="mt-7 border-t border-paper-200 pt-7">
              <PlanSelector />
            </div>

            {/* small trust line */}
            <p className="mt-5 flex items-center justify-center gap-2 font-pt text-caption text-fg-subtle">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect x="4" y="11" width="16" height="9" rx="1.5" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" />
              </svg>
              Secure checkout · Free shipping · Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* ============ Engineered with ============ */}
      <IngredientStrip />

      {/* ============ FAQ ============ */}
      <ProductFAQ />

      {/* ============ Built for high-output minds ============ */}
      <BuiltForMinds />
    </main>
  );
}
