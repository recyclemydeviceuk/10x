// =========================================================
// 10X — STATIC BRAND CONTENT
//
// What is left here is page furniture: the ingredient strip and
// the three pillars. It is copy, not catalogue.
//
// EVERYTHING about what is sold — packs, prices, SKUs, stock,
// images, hero copy — comes from the database via lib/catalog.ts.
// Nothing in this file may describe a product or a price again:
// a price in the repo is a price nobody chose, and it will
// disagree with the checkout the first time someone edits the
// real one in the admin panel.
// =========================================================

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
