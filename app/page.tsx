import type { Metadata } from 'next';

import Hero from '../components/Hero';
import AvailableAt from '../components/AvailableAt';
import Benefits from '../components/Benefits';
import PourMixDrink from '../components/PourMixDrink';
import TakeCharge from '../components/TakeCharge';
import Collection from '../components/Collection';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://10xdrink.com';

export const metadata: Metadata = {
  title: '10X — The Brain Battery | Zero Sugar Energy Drink for Focus & Productivity',
  description:
    'The Brain Battery — India\'s pocket-sized zero-sugar, zero-calorie brain nourishment for peak focus & energy. Available on Blinkit, Zepto, Swiggy Instamart & Flipkart Minutes. Scientifically formulated nootropic energy drink.',
  keywords: [
    '10X drink',
    'brain battery',
    'brain nourishment',
    'energy drink India',
    'zero sugar energy drink',
    'zero calorie energy',
    'focus drink',
    'nootropic drink',
    'lime charge',
    'productivity drink',
    'brain energy supplement',
    'mental focus supplement',
    'Indian energy drink online',
    'buy energy drink India',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: '10X',
    title: '10X — The Brain Battery | Zero Sugar Energy Drink',
    description:
      'Pocket-sized brain nourishment that revitalizes energy and focus. Zero sugar, zero calories, controllable energy. Available on all major quick commerce platforms.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '10X — The Brain Battery Energy Drink',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@10xdrink',
    title: '10X — The Brain Battery',
    description:
      'Pocket-sized brain nourishment. Zero sugar, zero calories, controllable energy for peak focus.',
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
    'Pocket-sized brain nourishment engineered for peak focus and energy. Zero sugar, zero calories. Pack of 2 (60ml each). Scientifically formulated with nootropic ingredients.',
  brand: {
    '@type': 'Brand',
    name: '10X',
    description: '10X Formulas - Brain Nourishment',
  },
  category: 'Energy Drink',
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
      reviewBody: 'Best energy drink for focus and productivity!',
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
        text: '10X is a pocket-sized, zero-sugar, zero-calorie brain nourishment drink engineered to revitalize focus and energy. It\'s available on Blinkit, Zepto, Swiggy Instamart, and Flipkart Minutes.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is 10X suitable for everyone?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '10X is designed for adults looking to optimize their focus and energy. It contains zero sugar and zero calories, making it a healthier alternative to traditional energy drinks.',
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
        text: '10X is formulated with scientifically-selected nootropic ingredients that cross the blood-brain barrier to optimize brain function. Zero sugar, zero calories.',
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
