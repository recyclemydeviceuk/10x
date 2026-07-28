import type { Metadata } from 'next';

import Hero from '../components/Hero';
import HeroMobile from '../components/HeroMobile';
import WhatItIs from '../components/WhatItIs';
import WhatPeopleSay from '../components/WhatPeopleSay';
import BeforeYouAsk from '../components/BeforeYouAsk';
import BuyBox from '../components/BuyBox';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://10xdrink.com';

export const metadata: Metadata = {
  title: '10X — The Brain Battery | Fuel Better Thinking',
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

const productJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  '@id': `${SITE_URL}/#product`,
  name: '10X Day Time',
  alternateName: 'THE BRAIN BATTERY',
  description:
    'Whole-food nutrition designed to support focused thinking, controlled energy, and clear execution. Made with pumpkin seeds, sesame seeds, edamame, matcha, spinach, and almonds.',
  brand: {
    '@type': 'Brand',
    name: '10X',
  },
  category: 'Nutritional Supplement',
  image: [`${SITE_URL}/product-hero.jpg`],
  // Only the 10-pack is on sale, so it is the only offer we publish.
  offers: {
    '@type': 'Offer',
    name: 'Single Pack — 10 sticks',
    price: '1199',
    priceCurrency: 'INR',
    availability: 'https://schema.org/InStock',
    url: `${SITE_URL}/products/10x-daytime`,
  },
};

const faqJsonLd = {
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
        text: 'Order the Single Pack (10 sticks) on 10xdrink.com — ₹1,199 as a one-time purchase, or ₹1,049 delivered every 4 weeks. Skip or cancel anytime, no login required. Also available on Blinkit and Zepto.',
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <main id="main">
        <HeroMobile />
        <Hero />
        <WhatItIs />
        <WhatPeopleSay />
        <BeforeYouAsk />
        <BuyBox />
      </main>
    </>
  );
}
