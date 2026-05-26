import type { Metadata } from 'next';

import Hero from '../components/Hero';
import AvailableAt from '../components/AvailableAt';
import Benefits from '../components/Benefits';
import PourMixDrink from '../components/PourMixDrink';
import TakeCharge from '../components/TakeCharge';
import Collection from '../components/Collection';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://10xdrink.com';

export const metadata: Metadata = {
  title: '10X — The Brain Battery | Brain-First Performance',
  description:
    'The Brain Battery — pocket-sized brain nourishment from a brain-first performance company. A precise blend of amino acids, nutrients, and nootropics designed for focus, clarity, and control. Available on Blinkit, Zepto, Swiggy Instamart & Flipkart Minutes.',
  keywords: [
    '10X drink',
    'brain battery',
    'brain nourishment',
    'brain-first performance',
    'nootropic drink',
    'focus drink',
    'clarity drink',
    'lime charge',
    'productivity drink',
    'amino acids drink',
    'cognitive support drink',
    'mental performance drink',
    'brain support drink India',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: '10X',
    title: '10X — The Brain Battery | Brain-First Performance',
    description:
      'Pocket-sized brain nourishment. A precise blend of amino acids, nutrients, and nootropics — designed for focus, clarity, and control. No spikes. No crashes. No override. Available on all major quick commerce platforms.',
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
      'Pocket-sized brain nourishment. A precise blend of amino acids, nutrients, and nootropics — designed for focus, clarity, and control.',
    images: ['/og-image.jpg'],
  },
};

const productJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  '@id': `${SITE_URL}/#product`,
  name: '10X Lime Charge',
  alternateName: '10X Brain Battery',
  description:
    'Pocket-sized brain nourishment — a precise blend of amino acids, nutrients, and nootropics designed for focus, clarity, and control. Pack of 2 (60ml each). No harsh stimulants. No unnecessary additives.',
  brand: {
    '@type': 'Brand',
    name: '10X',
    description: '10X Formulas — A Brain-First Performance Company',
  },
  category: 'Nutritional Supplement',
  gtin: process.env.NEXT_PUBLIC_PRODUCT_GTIN || '8906103000000',
  image: [
    `${SITE_URL}/product-hero.jpg`,
    `${SITE_URL}/product-side.jpg`,
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '2150',
    bestRating: '5',
    worstRating: '1',
  },
  review: [
    {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
      },
      author: {
        '@type': 'Person',
        name: 'Customer',
      },
      reviewBody: 'Real brain nourishment — clean focus and clarity without the spikes and crashes.',
    },
  ],
  aggregateOffer: {
    '@type': 'AggregateOffer',
    priceCurrency: 'INR',
    lowPrice: '299',
    highPrice: '399',
    offerCount: '4',
    offers: [
      {
        '@type': 'Offer',
        name: 'Blinkit',
        url: 'https://blinkit.com',
        price: '299',
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          name: 'Blinkit',
        },
      },
      {
        '@type': 'Offer',
        name: 'Zepto',
        url: 'https://zepto.in',
        price: '299',
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          name: 'Zepto',
        },
      },
      {
        '@type': 'Offer',
        name: 'Swiggy Instamart',
        url: 'https://instamart.swiggy.com',
        price: '349',
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          name: 'Swiggy Instamart',
        },
      },
      {
        '@type': 'Offer',
        name: 'Flipkart Minutes',
        url: 'https://flipkart.com',
        price: '399',
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          name: 'Flipkart',
        },
      },
    ],
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is 10X Brain Battery?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '10X is The Brain Battery — pocket-sized brain nourishment from a brain-first performance company. A precise blend of amino acids, nutrients, and nootropics designed for focus, clarity, and control. It is not an energy drink; it supports the brain rather than overriding it.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is 10X an energy drink?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. 10X is brain nourishment, not an energy drink. Coffee, energy drinks, and nicotine override the brain with stimulants — leading to spikes, crashes, and noise. 10X uses ingredients your body already recognizes from everyday foods, in more effective forms, to support the brain naturally.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where can I buy 10X?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '10X Lime Charge is available on Blinkit, Zepto, Swiggy Instamart, and Flipkart Minutes for quick delivery across India.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does 10X contain?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '10X is a precise blend of amino acids, nutrients, and nootropics — ingredients your body already recognizes from everyday foods, used here in more effective, bioavailable forms. No harsh stimulants. No unnecessary additives. Simple, real, and well understood.',
      },
    },
  ],
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: SITE_URL,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <main id="main">
        <Hero />
        <AvailableAt />
        <Benefits />
        <PourMixDrink />
        <TakeCharge />
        <Collection />
      </main>
    </>
  );
}
