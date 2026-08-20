import type { Metadata } from 'next';

import Hero from '@/components/Hero';
import HeroMobile from '@/components/HeroMobile';
import WhatItIs from '@/components/WhatItIs';
import WhatPeopleSay from '@/components/WhatPeopleSay';
import BeforeYouAsk from '@/components/BeforeYouAsk';
import BuyBox from '@/components/BuyBox';
import {
  cadenceLabel,
  getStoreSettings,
  loadProduct,
  pickTier,
  type CatalogProduct,
  type CatalogTier,
} from '@/lib/catalog';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://10xdrink.com';

export const metadata: Metadata = {
  // Absolute — the layout's "%s | 10X" template would otherwise append a second
  // "| 10X" to a title that already ends in the brand.
  title: { absolute: '10X — The Brain Battery | Fuel Better Thinking' },
  description:
    'THE BRAIN BATTERY — whole-food nutrition designed to support focused thinking, controlled energy, and clear execution. Made with pumpkin seeds, sesame seeds, edamame, matcha, spinach & almonds. One simple daily protocol.',
  keywords: [
    '10X drink',
    'brain battery',
    'fuel better thinking',
    'focus drink',
    'mental performance',
    'productivity drink',
    'nootropic drink',
    'matcha focus drink',
    'cognitive support drink India',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: '10X',
    title: '10X — The Brain Battery | Fuel Better Thinking',
    description:
      'Whole-food nutrition for focused thinking, controlled energy, and clear execution. One simple daily protocol.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '10X — The Brain Battery',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@10xdrink',
    title: '10X — The Brain Battery',
    description:
      'Whole-food nutrition for focused thinking, controlled energy, and clear execution.',
    images: ['/og-image.jpg'],
  },
};

/**
 * Product structured data, priced from the catalogue.
 *
 * A price baked into the page keeps being served by Google long after someone
 * changes the real one, so the offer is only published when we actually know
 * it — no catalogue, no offer.
 */
function productJsonLd(product: CatalogProduct | null, tier: CatalogTier | null) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${SITE_URL}/#product`,
    name: product?.name ?? '10X Day Time',
    alternateName: 'THE BRAIN BATTERY',
    description:
      product?.description ??
      'Whole-food nutrition designed to support focused thinking, controlled energy, and clear execution.',
    brand: { '@type': 'Brand', name: '10X' },
    category: 'Nutritional Supplement',
    image: product?.images.length ? product.images : [`${SITE_URL}/product-hero.jpg`],
    ...(product && tier
      ? {
          offers: {
            '@type': 'Offer',
            name: `${tier.name} — ${tier.packets} sticks`,
            price: String(tier.oneTimePrice),
            priceCurrency: 'INR',
            availability: tier.inStock
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
            url: `${SITE_URL}/products/${product.slug}`,
          },
        }
      : {}),
  };
}

function faqJsonLd(product: CatalogProduct | null, tier: CatalogTier | null, cadence: string) {
  const buyAnswer =
    product && tier
      ? `Order the ${tier.name} (${tier.packets} sticks) on 10xdrink.com — ₹${tier.oneTimePrice.toLocaleString('en-IN')} as a one-time purchase${
          tier.subscribePrice > 0 && tier.subscribePrice < tier.oneTimePrice
            ? `, or ₹${tier.subscribePrice.toLocaleString('en-IN')} delivered ${cadence.toLowerCase()}. Skip or cancel anytime`
            : ''
        }. Also available on Blinkit and Zepto.`
      : 'Order on 10xdrink.com, or find us on Blinkit and Zepto.';

  return {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is THE BRAIN BATTERY?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'THE BRAIN BATTERY by 10X is whole-food nutrition designed to support focused thinking, controlled energy, and clear execution — a simple daily protocol for people who rely on their minds every day.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is it made with?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Pumpkin seeds, sesame seeds, edamame, matcha, spinach, and almonds — carefully selected ingredients brought together in one simple daily protocol.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I buy 10X?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: buyAnswer,
      },
    },
  ],
  };
}

/** The pack the homepage quotes a price for — the one on sale, from the DB. */
const FEATURED_SLUG = '10x-daytime';

export default async function HomePage() {
  // The buy block's prices come from the catalogue, so the homepage and the
  // checkout can never disagree about what something costs.
  const [result, settings] = await Promise.all([loadProduct(FEATURED_SLUG), getStoreSettings()]);
  const product = result.state === 'ok' ? result.product : null;
  const tier = product ? pickTier(product) : null;
  const cadence = cadenceLabel(settings.subscriptionIntervalDays);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product, tier)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(product, tier, cadence)) }}
      />
      <main id="main">
        <HeroMobile />
        <Hero />
        <WhatItIs />
        <WhatPeopleSay />
        <BeforeYouAsk />
        <BuyBox product={product} tier={tier} settings={settings} />
      </main>
    </>
  );
}
