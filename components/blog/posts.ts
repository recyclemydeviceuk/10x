import type { StaticImageData } from 'next/image';

import imgHikers from '../../10x-Assets/Section-2-Banner-1.png';
import { PRODUCT_IMAGES } from '../productMedia';

const imgHands = PRODUCT_IMAGES.pourBeige;
const imgTravel = PRODUCT_IMAGES.canSingle;
const imgCan = PRODUCT_IMAGES.front;

export type BlogBlock = { type: 'h' | 'p'; text: string };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  category: string;
  readTime: string;
  image: string | StaticImageData;
  body: BlogBlock[];
};

export const posts: BlogPost[] = [
  {
    slug: 'brain-nourishment-not-override',
    title: 'Brain Nourishment, Not Override',
    excerpt:
      'Coffee and energy drinks force the brain with stimulants. 10X takes the opposite path — here’s why that matters.',
    date: '2026-05-28',
    category: 'The Science',
    readTime: '4 min read',
    image: imgCan,
    body: [
      { type: 'p', text: 'Most “energy” products work by overriding your brain. Caffeine and other stimulants push the system into a heightened state — useful for an hour, costly for the rest of the day.' },
      { type: 'h', text: 'Override has a price' },
      { type: 'p', text: 'A spike is always followed by a crash. The higher the artificial peak, the deeper the slump that follows — and the more “noise” you carry: jitters, restlessness, and a foggy comedown.' },
      { type: 'h', text: 'Support is a different model' },
      { type: 'p', text: '10X is built around nourishment instead of force. A precise blend of amino acids, nutrients, and nootropics gives the brain the raw inputs it uses to perform — in forms your body already recognises from everyday food.' },
      { type: 'p', text: 'The result is calm, controllable energy you can regulate, with no spike and no crash to recover from.' },
    ],
  },
  {
    slug: 'why-you-crash-after-coffee',
    title: 'Why You Crash After Coffee',
    excerpt:
      'The 3pm slump isn’t a willpower problem — it’s chemistry. Here’s what’s happening and how to avoid it.',
    date: '2026-05-20',
    category: 'Focus',
    readTime: '5 min read',
    image: imgHands,
    body: [
      { type: 'p', text: 'You felt sharp at 9am. By mid-afternoon you’re foggy, irritable, and reaching for another cup. Sound familiar?' },
      { type: 'h', text: 'The spike-and-crash cycle' },
      { type: 'p', text: 'Stimulants create a short, steep peak in alertness. But what goes up must come down — and the crash often leaves you below where you started, which is why the second coffee never quite works.' },
      { type: 'h', text: 'Break the cycle' },
      { type: 'p', text: 'Instead of chasing another spike, give the brain steady inputs it can use across the whole day. 10X is designed for usable output that lasts — no harsh stimulants, no spikes, no crashes.' },
    ],
  },
  {
    slug: 'three-inputs-your-brain-needs',
    title: 'The 3 Inputs Your Brain Actually Needs',
    excerpt:
      'Amino acids, nutrients, and nootropics — what each one does, and why the form matters as much as the ingredient.',
    date: '2026-05-12',
    category: 'Formulation',
    readTime: '6 min read',
    image: imgTravel,
    body: [
      { type: 'p', text: '10X is a focused formula. Every ingredient earns its place, and they fall into three families.' },
      { type: 'h', text: 'Amino acids' },
      { type: 'p', text: 'The building blocks your brain uses to make neurotransmitters — the chemistry behind focus and a steady mood.' },
      { type: 'h', text: 'Nutrients' },
      { type: 'p', text: 'Vitamins and minerals your body already recognises from everyday food, delivered in more effective, bioavailable forms that actually absorb.' },
      { type: 'h', text: 'Nootropics' },
      { type: 'p', text: 'Studied compounds that support clarity and cognition — chosen to nourish the brain, never to override it.' },
      { type: 'p', text: 'Nothing excessive. No harsh stimulants, no unnecessary additives — simple, real, and well understood.' },
    ],
  },
  {
    slug: 'energy-you-can-control',
    title: 'Energy You Can Control',
    excerpt:
      'Calm and switched-on at the same time? That’s the goal. Here’s what “controllable energy” really means.',
    date: '2026-05-04',
    category: 'Performance',
    readTime: '4 min read',
    image: imgHikers,
    body: [
      { type: 'p', text: 'The best energy doesn’t feel like a rush. It feels like clarity — a quiet, locked-in state where the next step is obvious.' },
      { type: 'h', text: 'Calm and switched on' },
      { type: 'p', text: 'Nervous, jittery energy puts you in a briefly heightened state and then drops you. Controllable energy is expansive and steady — your brain stays in the driver’s seat.' },
      { type: 'h', text: 'Built for the whole day' },
      { type: 'p', text: '10X Daytime is designed for focus, clarity, and control from morning through evening, with no spike and no crash to manage.' },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}
