import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://10xdrink.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/*.js',
          '/*.css',
          '/*.webp',
          '/*.png',
          '/*.jpg',
          '/*.jpeg',
          '/*.svg',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/design-system',
          '/design-system/',
          '/*.php',
          '/.env',
          '/.next/',
          '/private/',
        ],
        crawlDelay: 0.5,
      },
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
    ],
    sitemap: [
      `${SITE_URL}/sitemap.xml`,
    ],
    host: SITE_URL,
  };
}
