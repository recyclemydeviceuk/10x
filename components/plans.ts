// =========================================================
// 10X DAY TIME — THE BRAIN BATTERY
// Pricing model: three pack tiers priced off the 10-pack
// unit rate (₹1,199 per 10 sticks = MRP). Larger packs are
// discounted on the Subscribe & Save plan:
//   Single Pack       — 10 sticks · ₹1,199 (one-time only)
//   Core Daily Pack   — 30 sticks · MRP ₹3,597 → ₹3,299 (Save ₹298 | ~8.3% Off)
//   Performance Stack — 60 sticks · MRP ₹7,194 → ₹5,999 (Save ₹1,195 | ~16.6% Off)
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
  /** Larger packs can be subscribed; the single trial pack cannot. */
  subscribable: boolean;
  /** Recurring price (≈15% off the one-time price). */
  subscriptionPrice?: number;
  subscriptionLabel?: string;
};

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
    subscribable: false,
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

export const TIER_LIST: Tier[] = [TIERS.single, TIERS.core, TIERS.performance];

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
// ENGINEERED WITH — whole-food ingredients
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
