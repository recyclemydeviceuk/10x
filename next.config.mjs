import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  turbopack: {
    root: __dirname,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    /**
     * Where product photography may be loaded from.
     *
     * next/image REFUSES any host not listed here, and it fails as a runtime
     * error on the page rather than a broken image — so this list has to cover
     * every bucket the catalogue might serve, not just the one configured
     * today. It covers:
     *   - Cloudinary, which hosts the static brand photography
     *   - any S3 bucket in any region, virtual-hosted or path-style, which is
     *     what the admin panel uploads to
     *   - an explicit CDN host, when one is put in front of the bucket
     */
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '*.s3.amazonaws.com' },
      { protocol: 'https', hostname: '*.s3.*.amazonaws.com' },
      { protocol: 'https', hostname: 's3.*.amazonaws.com' },
      { protocol: 'https', hostname: '*.cloudfront.net' },
      ...(process.env.NEXT_PUBLIC_MEDIA_HOST
        ? [{ protocol: 'https', hostname: process.env.NEXT_PUBLIC_MEDIA_HOST }]
        : []),
    ],
  },
  async headers() {
    const isProd = process.env.NODE_ENV === 'production';
    return [
      {
        source: '/(.*)',
        headers: [
          // In dev, prevent the browser from caching navigation documents
          // (avoids stale HTML during rapid iteration). No effect in prod.
          ...(isProd ? [] : [{ key: 'Cache-Control', value: 'no-store, must-revalidate' }]),
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=3600' },
          { key: 'Content-Type', value: 'application/xml' },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=3600' },
          { key: 'Content-Type', value: 'text/plain' },
        ],
      },
      {
        source: '/site.webmanifest',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=3600' },
          { key: 'Content-Type', value: 'application/manifest+json' },
        ],
      },
      // Long-lived immutable caching only in production (assets are content-hashed).
      // In dev this would pin stale CSS/JS in the browser, so skip it.
      ...(isProd
        ? [
            {
              source: '/:path*.(js|css|webp|png|jpg|jpeg|svg|woff|woff2|ttf|eot)',
              headers: [
                { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
              ],
            },
          ]
        : []),
      {
        source: '/:path*.(html)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400' },
        ],
      },
    ];
  },
};

export default nextConfig;
