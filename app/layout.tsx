import type { Metadata, Viewport } from 'next';
import { quantico, nebulaSans, ptSans, ptSansCaption } from './fonts';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import ImageProtection from '../components/ImageProtection';
import { CheckoutProvider } from '../components/CheckoutContext';
import CheckoutModal from '../components/CheckoutModal';
import './globals.css';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://10xdrink.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: '10X — The Brain Battery | Fuel Better Thinking',
    template: '%s | 10X',
  },
  description:
    '10X is THE BRAIN BATTERY — engineered nutrition designed to support focused thinking, controlled energy, and clear execution. Engineered with pumpkin seeds, sesame seeds, edamame, matcha, spinach & almonds. Available on 10xdrink.com, Blinkit & Zepto.',
  keywords: [
    '10X drink',
    'brain battery',
    'fuel better thinking',
    'focus drink',
    'mental performance',
    'productivity drink',
    'nootropic drink',
    'matcha focus drink',
    'clarity drink',
    'cognitive support drink',
    'brain support drink India',
  ],
  authors: [{ name: '10X Formulas' }],
  creator: '10X Formulas',
  publisher: '10X Formulas',
  applicationName: '10X',
  category: 'Health & Wellness',
  referrer: 'strict-origin-when-cross-origin',
  formatDetection: { email: false, address: false, telephone: false },
  alternates: {
    canonical: '/',
    languages: {
      'en-IN': '/en-IN',
      'en-US': '/en-US',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    alternateLocale: ['en_US', 'en_GB'],
    url: SITE_URL,
    siteName: '10X',
    title: '10X — The Brain Battery | Fuel Better Thinking',
    description:
      'Engineered nutrition designed to support focused thinking, controlled energy, and clear execution. One simple daily protocol.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '10X — The Brain Battery',
        type: 'image/jpeg',
      },
      {
        url: '/og-image-square.jpg',
        width: 800,
        height: 800,
        alt: '10X Daytime',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@10xdrink',
    creator: '@10xdrink',
    title: '10X — The Brain Battery',
    description:
      'Engineered nutrition for focused thinking, controlled energy, and clear execution.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0E1A' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: '10X Formulas',
  alternateName: '10X',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description:
    '10X makes THE BRAIN BATTERY — engineered nutrition designed to support focused thinking, controlled energy, and clear execution.',
  sameAs: [
    'https://www.instagram.com/10xdrink',
    'https://www.facebook.com/10xdrink',
    'https://www.twitter.com/10xdrink',
    'https://www.youtube.com/@10xdrink',
    'https://www.linkedin.com/company/10xdrink',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@10xdrink.com',
    availableLanguage: ['en-IN', 'en-US'],
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IN',
  },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: '10X',
  url: SITE_URL,
  description: 'THE BRAIN BATTERY — Fuel Better Thinking. Engineered nutrition for focus, energy, and execution.',
  publisher: {
    '@type': 'Organization',
    name: '10X Formulas',
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
  isAccessibleForFree: true,
  inLanguage: 'en-IN',
};

const fontClasses = [
  quantico.variable,
  nebulaSans.variable,
  ptSans.variable,
  ptSansCaption.variable,
].join(' ');

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr" className={fontClasses} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:font-bold focus:text-ink"
        >
          Skip to main content
        </a>
        <ImageProtection />
        <CheckoutProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
          <CheckoutModal />
        </CheckoutProvider>
      </body>
    </html>
  );
}
