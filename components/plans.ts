// =========================================================
// 10X — THE BRAIN BATTERY
// Single source of truth for purchase plans, ingredients, and audience.
// Per the 10X website strategy: two purchase options only.
//   1. One-Time Purchase  — ₹1,199 · 10 servings
//   2. Monthly Subscription — ₹2,999/mo · 30 servings (preferred)
// =========================================================

export type PlanId = 'one-time' | 'subscription';

export type Plan = {
  id: PlanId;
  /** Marketing label shown above the price (e.g. "Most Popular"). */
  badge?: string;
  /** Protocol name — used by the subscription card. */
  kicker?: string;
  /** Savings line for the subscription. */
  save?: string;
  name: string;
  servings: string;
  /** Numeric price used for order math (taxes inclusive, shipping free). */
  price: number;
  /** Customer-facing price label. */
  priceLabel: string;
  /** Optional billing cadence suffix (e.g. "/ month"). */
  cadence?: string;
  includes: string[];
  cta: string;
  /** True for the visually-emphasised, preferred option. */
  featured?: boolean;
};

export const PLANS: Record<PlanId, Plan> = {
  'one-time': {
    id: 'one-time',
    name: 'One-Time Purchase',
    servings: '10 Servings Included',
    price: 1199,
    priceLabel: '₹1,199',
    includes: [
      'Pure 10X Performance',
      '10 Portable Daily Sachets',
      'Free Courier Dispatch Included',
    ],
    cta: 'Buy Now',
  },
  subscription: {
    id: 'subscription',
    badge: 'Most Popular',
    kicker: 'Continuous Flow Protocol',
    save: 'Save ₹597 every month',
    name: 'Monthly Subscription',
    servings: '30 Servings Monthly',
    price: 2999,
    priceLabel: '₹2,999',
    cadence: '/ month',
    includes: [
      'Free Shipping',
      'Cancel Anytime',
      'Never Run Out',
      'VIP Membership Status',
    ],
    cta: 'Subscribe & Save',
    featured: true,
  },
};

export const PLAN_LIST: Plan[] = [PLANS['one-time'], PLANS.subscription];

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
// WHO IT'S FOR — people who rely on their minds every day
// ---------------------------------------------------------
export const AUDIENCE = [
  'Entrepreneurs',
  'Professionals',
  'Creators',
  'Builders',
  'Students',
  'Leaders',
  'Thinkers',
  'Problem Solvers',
  'Decision Makers',
] as const;

// ---------------------------------------------------------
// The brand promise — three pillars
// ---------------------------------------------------------
export const PILLARS = [
  'Focused Thinking',
  'Controlled Energy',
  'Clear Execution',
] as const;
