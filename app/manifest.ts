import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '10X — The Brain Battery | Zero Sugar Energy Drink',
    short_name: '10X',
    description:
      'Pocket-sized brain nourishment — zero sugar, zero calories. Revitalize your focus and energy. Available on Blinkit, Zepto, Swiggy Instamart & Flipkart Minutes.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#ffffff',
    theme_color: '#06189E',
    screenshots: [
      {
        src: '/screenshot-small.png',
        sizes: '192x192',
        form_factor: 'narrow',
        type: 'image/png',
      },
      {
        src: '/screenshot-large.png',
        sizes: '512x512',
        form_factor: 'wide',
        type: 'image/png',
      },
    ],
    icons: [
      {
        src: '/favicon.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/favicon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/favicon.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['health', 'shopping'],
  };
}
