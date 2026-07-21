import type { Metadata } from 'next';

import ProductGallery, { type GalleryImage } from '../../../components/ProductGallery';
import ProductPurchase from '../../../components/ProductPurchase';
import ProductDetailsMobile from '../../../components/ProductDetailsMobile';
import IngredientStrip from '../../../components/IngredientStrip';
import ProductFAQ from '../../../components/ProductFAQ';
import BuiltForMinds from '../../../components/BuiltForMinds';
import { ProductConfigProvider } from '../../../components/ProductConfigContext';
import { tierIdFromPack } from '../../../components/plans';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://10xdrink.com';

export const metadata: Metadata = {
  title: '10X Day Time — The Brain Battery | Fuel Better Thinking',
  description:
    '10X Day Time: a premium brain nourishment formula for calm focus, cognitive clarity, and sustained mental performance. Single Pack ₹1,199, Core Daily Pack ₹3,299, Performance Stack ₹5,999 — subscribe & save up to 16.6%. Also on Blinkit & Zepto.',
  alternates: { canonical: '/products/10x-daytime' },
};

const gallery: GalleryImage[] = [
  { src: 'https://res.cloudinary.com/dpq1nvxmd/image/upload/v1781960130/Day_g1dpif.png', alt: '10X Day Time — can and sachet' },
  { src: 'https://res.cloudinary.com/dpq1nvxmd/image/upload/v1781945940/ChatGPT_Image_May_29_2026_03_41_00_PM_qorlzz.png', alt: '10X Day Time — product pack' },
  { src: 'https://res.cloudinary.com/dpq1nvxmd/image/upload/v1781945944/ChatGPT_Image_May_29_2026_03_40_56_PM_bhhf11.png', alt: '10X Day Time — sachets' },
  { src: 'https://res.cloudinary.com/dpq1nvxmd/image/upload/v1781945940/ChatGPT_Image_May_29_2026_03_40_52_PM_zpxryj.png', alt: '10X Day Time — single serve' },
  { src: 'https://res.cloudinary.com/dpq1nvxmd/image/upload/v1781960130/12456_ese6aq.png', alt: '10X Day Time — product detail' },
  { src: 'https://res.cloudinary.com/dpq1nvxmd/image/upload/v1781960148/REALIFE-1_bzspe1.png', alt: '10X Day Time — in real life' },
  { src: 'https://res.cloudinary.com/dpq1nvxmd/image/upload/v1781960148/17138f45-de2c-45a6-bb6b-25a7fcd190de_w91bl4.png', alt: '10X Day Time — lifestyle' },
  { src: 'https://res.cloudinary.com/dpq1nvxmd/image/upload/v1781960148/Real-Life_bni425.png', alt: '10X Day Time — everyday use' },
  { src: 'https://res.cloudinary.com/dpq1nvxmd/image/upload/v1781960151/Life-style_tgmrx8.png', alt: '10X Day Time — lifestyle shot' },
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
    highPrice: '5999',
    offerCount: '3',
    availability: 'https://schema.org/InStock',
  },
};

export default async function ProductPage({
  searchParams,
}: {
  searchParams: Promise<{ pack?: string }>;
}) {
  const { pack } = await searchParams;
  const initialTierId = tierIdFromPack(pack);

  return (
    <main id="main" className="bg-white pt-14 md:pt-[72px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <ProductConfigProvider initialTierId={initialTierId}>
        {/* ============ Screen 1 — Gallery + Purchase (hero) ============ */}
        <section className="mx-auto max-w-7xl px-6 py-6 sm:px-10 md:px-14 md:py-14">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-14">
            {/* Gallery */}
            <ProductGallery images={gallery} />

            {/* Dynamic purchase panel */}
            <div className="md:py-1">
              <ProductPurchase />
            </div>
          </div>
        </section>

        {/* ============ Screen 2 — Engineered with + details ============ */}
        <IngredientStrip />
        <ProductDetailsMobile />

        {/* ============ Screen 3 — Built for high-output minds ============ */}
        <BuiltForMinds />

        {/* ============ Screen 4 — FAQ (last) ============ */}
        <ProductFAQ />
      </ProductConfigProvider>
    </main>
  );
}
