// =========================================================
// The catalogue, from the API.
//
// Products, packs, prices, stock and the store's shipping rules
// all come from the same database the admin panel edits and the
// checkout prices against — so what the page shows is what the
// customer is charged.
//
// Every fetch degrades to `null`/defaults rather than throwing:
// a product page that can't reach the API still renders its
// copy, it just can't take an order (the purchase panel says so).
// =========================================================

import type { SocialLink } from '@/lib/social-icons';
import { api } from '@/lib/api/storefront';

export type CatalogTier = {
  id: string;
  name: string;
  packets: number;
  oneTimePrice: number;
  subscribePrice: number;
  inStock: boolean;
  stock: number;
  /** True when what's left is at or under the panel's alert threshold. */
  lowStock: boolean;
};

export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  images: string[];
  /** Photography for the dark and black looks; empty means reuse `images`. */
  imagesDark: string[];
  video: string;
  seo: { title: string; description: string };
  storefront: {
    kicker: string;
    subscriptionNote: string;
    priceNote: string;
    subscribePriceNote: string;
    ctaLabel: string;
    perfectFor: string;
    benefits: string[];
  };
  tiers: CatalogTier[];
};

export type StoreSettings = {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  /** 'free' waives delivery on every order; 'priced' uses the two numbers below. */
  deliveryMode: 'free' | 'priced' | 'live';
  freeShippingOver: number;
  flatShipping: number;
  codEnabled: boolean;
  /** Days between subscription deliveries. Drives every cadence label. */
  subscriptionIntervalDays: number;
  /** Footer social links, in order, from the admin panel. */
  socialLinks?: SocialLink[];
};

/**
 * Used for the first paint only, before the API answers.
 *
 * These are the SERVER's own defaults, kept in step deliberately — they are
 * not an independent opinion about shipping. Anything the customer is actually
 * charged comes from the API.
 */
export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: '10X',
  supportEmail: 'support@10xdrink.com',
  supportPhone: '',
  deliveryMode: 'priced',
  freeShippingOver: 999,
  flatShipping: 49,
  codEnabled: true,
  subscriptionIntervalDays: 28,
};

export async function getProduct(slug: string): Promise<CatalogProduct | null> {
  const result = await api<{ product: CatalogProduct }>(`/api/v1/products/${slug}`, {
    auth: false,
  });
  return result.ok ? result.data.product : null;
}

export async function getProducts(): Promise<CatalogProduct[]> {
  const result = await api<{ products: CatalogProduct[] }>('/api/v1/products', {
    auth: false,
  });
  return result.ok ? result.data.products : [];
}

export async function getStoreSettings(): Promise<StoreSettings> {
  const result = await api<{ settings: StoreSettings }>('/api/v1/settings', {
    auth: false,
  });
  return result.ok ? result.data.settings : DEFAULT_STORE_SETTINGS;
}

/* ------------------------------------------------------- product page */

/**
 * How a product page load ended.
 *
 * The three cases are deliberately distinct: a missing product is a 404, an
 * unreachable API is a "try again", and neither may be rendered as a product
 * with no price. Collapsing them is how a storefront ends up quietly showing a
 * price that came from nowhere.
 */
export type ProductResult =
  | { state: 'ok'; product: CatalogProduct }
  | { state: 'missing' }
  | { state: 'unavailable' };

export async function loadProduct(slug: string): Promise<ProductResult> {
  const result = await api<{ product: CatalogProduct }>(`/api/v1/products/${slug}`, {
    auth: false,
  });
  if (result.ok) return { state: 'ok', product: result.data.product };
  return { state: result.status === 404 ? 'missing' : 'unavailable' };
}

/** The pack a visitor lands on: the `?pack=` one if it exists and is in stock. */
export function pickTier(product: CatalogProduct, pack?: string | string[] | null): CatalogTier | null {
  const wanted = Array.isArray(pack) ? pack[0] : pack;
  const byPack = wanted
    ? product.tiers.find((t) => t.id === wanted || String(t.packets) === wanted)
    : undefined;
  return byPack ?? product.tiers.find((t) => t.inStock) ?? product.tiers[0] ?? null;
}

/** "Every 4 weeks" from the store's own interval. */
export function cadenceLabel(days: number): string {
  if (days % 7 === 0) {
    const weeks = days / 7;
    return weeks === 1 ? 'Every week' : `Every ${weeks} weeks`;
  }
  return days === 1 ? 'Every day' : `Every ${days} days`;
}
