import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://10xdrink.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/#collection`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/#benefits`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/#available-at`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.90,
    },
    {
      url: `${SITE_URL}/#pour-mix-drink`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/products/10x-daytime`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    // The two menu pages, in nav order. /hardware is left out because it is
    // still a noindexed placeholder; /our-story, /formulation and /science are
    // out too — they run on the retired blue palette and nothing links to them.
    {
      url: `${SITE_URL}/brain-fog`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/whats-in-it`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${SITE_URL}/refunds`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${SITE_URL}/shipping`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${SITE_URL}/cookies`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.3 },
    {
      url: `${SITE_URL}/design-system`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.1,
    },
  ];
}
