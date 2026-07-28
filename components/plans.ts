// =========================================================
// 10X DAY TIME — THE BRAIN BATTERY
//
// ONLY THE 10-PACK IS ON SALE RIGHT NOW. The 30 and 60 pack
// tiers are kept here so they can be switched back on later,
// but `available: false` keeps them out of every selector,
// price display and structured-data offer on the site — the
// single source of truth is `TIER_LIST` below.
//
//   Single Pack       — 10 sticks · ₹1,199 one-time
//                       · ₹1,049 every 4 weeks (Save ₹150)
//   Core Daily Pack   — 30 sticks · not on sale
//   Performance Stack — 60 sticks · not on sale
// =========================================================

export type TierId = 'single' | 'core' | 'performance';

export type Tier = {
  id: TierId;
  name: string;
  tagline: string;
  packets: string;
  /** One-time price. */
  price: number;
  priceLabel: string;
  benefits: string[];
  badge?: string;
  /** Whether this pack can be subscribed to (delivered every 4 weeks). */
  subscribable: boolean;
  /** Recurring price, charged every 4 weeks. */
  subscriptionPrice?: number;
  subscriptionLabel?: string;
  /** Off-sale tiers stay defined but never reach the UI. See TIER_LIST. */
  available: boolean;
};

/** How often a subscription ships / bills. */
export const SUBSCRIPTION_CADENCE = 'Every 4 weeks';

/** Must stay visible next to the subscribe option — never buried in terms. */
export const SUBSCRIPTION_NOTE = 'Skip or cancel anytime, no login required.';

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export const TIERS: Record<TierId, Tier> = {
  single: {
    id: 'single',
    name: 'Single Pack',
    tagline: 'Calm Focus Energy for High Performance',
    packets: '10 Stick Packets',
    price: 1199,
    priceLabel: inr(1199),
    benefits: ['Sustained focus support', 'Calm energy delivery', 'Zero Sugar'],
    subscribable: true,
    subscriptionPrice: 1049,
    subscriptionLabel: inr(1049),
    available: true,
  },
  core: {
    id: 'core',
    name: 'Core Daily Pack',
    tagline: 'The Brain Battery (Most Popular)',
    packets: '30 Stick Packets',
    price: 3597,
    priceLabel: inr(3597),
    benefits: [
      'Priority focus support',
      'Calm energy delivery',
      'Free Shaker Cup Included',
      'Zero Sugar',
    ],
    badge: 'Most Popular',
    subscribable: true,
    subscriptionPrice: 3299,
    subscriptionLabel: inr(3299),
    available: false,
  },
  performance: {
    id: 'performance',
    name: 'Performance Stack',
    tagline: 'Maximum Cognitive Resilience',
    packets: '60 Stick Packets',
    price: 7194,
    priceLabel: inr(7194),
    benefits: [
      'Unrestricted cognitive support',
      'Deep focus protection',
      'Free Premium Shaker Cup',
      'Zero Sugar',
    ],
    subscribable: true,
    subscriptionPrice: 5999,
    subscriptionLabel: inr(5999),
    available: false,
  },
};

/** Savings on the Subscribe & Save price vs the one-time MRP. */
export function tierSavings(tier: Tier) {
  if (!tier.subscribable || tier.subscriptionPrice == null) return null;
  const amount = tier.price - tier.subscriptionPrice;
  const pctLabel = `${((amount / tier.price) * 100).toFixed(1)}%`;
  return { amount, amountLabel: inr(amount), pctLabel };
}

// Product copy — shared by the desktop purchase panel and the mobile details
// block so the wording stays in one place.
export const PRODUCT_DESCRIPTION =
  'Premium brain nourishment formula designed to support calm focus, cognitive clarity, and sustained mental performance.';
export const PRODUCT_PERFECT_FOR = 'Creators, developers, athletes, and directors.';

/**
 * Every pack that is actually on sale. Selectors, price displays and the
 * Product structured data all read from here, so flipping a tier's
 * `available` flag is the only change needed to put it back on sale.
 */
export const TIER_LIST: Tier[] = [TIERS.single, TIERS.core, TIERS.performance].filter(
  (t) => t.available,
);

/** The pack a visitor lands on when nothing else is specified. */
export const DEFAULT_TIER_ID: TierId = TIER_LIST[0].id;

/**
 * Map a `?pack=` value (e.g. "10") or a raw TierId to a TierId. Anything
 * unrecognised — or pointing at a pack that is no longer on sale, such as an
 * old `?pack=30` link — falls back to the default pack.
 */
export function tierIdFromPack(pack?: string | string[] | null): TierId {
  const value = Array.isArray(pack) ? pack[0] : pack;
  const byPack: Record<string, TierId> = {
    '10': 'single',
    single: 'single',
    '30': 'core',
    core: 'core',
    '60': 'performance',
    performance: 'performance',
  };
  const id = value ? byPack[value] : undefined;
  return id && TIERS[id].available ? id : DEFAULT_TIER_ID;
}

// What gets handed to the checkout popup.
export type CheckoutSelection = {
  productName: string;
  tierName: string;
  packets: string;
  isSubscription: boolean;
  price: number;
  priceLabel: string;
};

export function buildSelection(tier: Tier, subscribe: boolean): CheckoutSelection {
  const isSubscription = subscribe && tier.subscribable;
  const price = isSubscription ? tier.subscriptionPrice ?? tier.price : tier.price;
  return {
    productName: `10X Day Time — ${tier.name}`,
    tierName: tier.name,
    packets: tier.packets,
    isSubscription,
    price,
    priceLabel: inr(price),
  };
}

// ---------------------------------------------------------
// MADE WITH — whole-food ingredients
// ---------------------------------------------------------
export type Ingredient = { name: string; note: string; image: string };

export const INGREDIENT_DETAILS: Ingredient[] = [
  {
    name: 'Pumpkin Seeds',
    note: 'Magnesium & zinc',
    image: 'https://res.cloudinary.com/dpq1nvxmd/image/upload/v1781943818/Pumpkin_seeds_b1c6br.jpg',
  },
  {
    name: 'Sesame Seeds',
    note: 'Healthy fats',
    image: 'https://res.cloudinary.com/dpq1nvxmd/image/upload/v1781943818/Sesame_seeds_cp1bjs.jpg',
  },
  {
    name: 'Edamame',
    note: 'Plant protein',
    image: 'https://res.cloudinary.com/dpq1nvxmd/image/upload/v1781943818/Edamame_d6jpnf.jpg',
  },
  {
    name: 'Matcha',
    note: 'Calm focus',
    image: 'https://res.cloudinary.com/dpq1nvxmd/image/upload/v1781943818/Matcha_ut6tyq.jpg',
  },
  {
    name: 'Spinach',
    note: 'Iron & folate',
    image: 'https://res.cloudinary.com/dpq1nvxmd/image/upload/v1781943818/Spinach_nxagb4.jpg',
  },
  {
    name: 'Almonds',
    note: 'Vitamin E',
    image: 'https://res.cloudinary.com/dpq1nvxmd/image/upload/v1781943818/Almonds_scdozw.jpg',
  },
];

export const INGREDIENTS = INGREDIENT_DETAILS.map((i) => i.name);

// ---------------------------------------------------------
// The brand promise — three pillars
// ---------------------------------------------------------
export const PILLARS = [
  'Focused Thinking',
  'Controlled Energy',
  'Clear Execution',
] as const;
