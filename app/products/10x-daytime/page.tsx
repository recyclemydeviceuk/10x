import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment } from 'react';

import ProductGallery, { type GalleryImage } from '../../../components/ProductGallery';
import BuyOptions from '../../../components/BuyOptions';
import type { CartProduct } from '../../../components/CartContext';

import { PRODUCT_IMAGES } from '../../../components/productMedia';
import ctaBg from '../../../10x-Assets/Section-2-Banner-1.png';
import logoTenx from '../../../10x-Assets/10x-available.png';
import logoBlinkit from '../../../10x-Assets/Blinkit.png';
import logoZepto from '../../../10x-Assets/Zepto.png';
import logoInstamart from '../../../10x-Assets/Instamartlogo.webp';
import logoFlipkart from '../../../10x-Assets/Flipkart Minutes.png';

export const metadata: Metadata = {
  title: '10X Daytime — The Brain Battery',
  description:
    '10X Daytime: brain nourishment for focus, clarity, and control. A precise blend of amino acids, nutrients, and nootropics. No spikes, no crashes, no noise. Buy on 10xdrink.com, Blinkit, Zepto, Instamart & Flipkart Minutes.',
  alternates: { canonical: '/products/10x-daytime' },
};

const gallery: GalleryImage[] = [
  { src: PRODUCT_IMAGES.front, alt: '10X Daytime can and sachet, front view' },
  { src: PRODUCT_IMAGES.canSingle, alt: '10X Daytime can on a kitchen counter' },
  { src: PRODUCT_IMAGES.back, alt: '10X Daytime can — back panel' },
  { src: PRODUCT_IMAGES.left, alt: '10X Daytime can — left side' },
  { src: PRODUCT_IMAGES.right, alt: '10X Daytime can — ingredients panel' },
  { src: PRODUCT_IMAGES.top, alt: '10X Daytime can — lid detail' },
  { src: PRODUCT_IMAGES.pourOffice, alt: 'Pouring 10X Daytime into a glass of water' },
  { src: PRODUCT_IMAGES.pourBeige, alt: '10X Daytime mixing into water' },
  { src: PRODUCT_IMAGES.sachetsHeld, alt: 'Holding three 10X Daytime sachets' },
  { src: PRODUCT_IMAGES.sachetsFlat, alt: '10X Daytime single-serve sachets' },
];

const product: CartProduct = {
  id: '10x-daytime',
  name: '10X Daytime',
  pack: 'Pack of 2 (60ml)',
  price: 299,
  priceLabel: '₹299.00',
  image: PRODUCT_IMAGES.front,
};

const trust = [
  {
    label: 'Brain-First',
    Icon: (p: { className?: string }) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={p.className} aria-hidden>
        <path d="M12 5a3 3 0 0 0-6 0 3 3 0 0 0-2.5 4.5A3 3 0 0 0 5 15a3 3 0 0 0 5 2.5V5Z" />
        <path d="M12 5a3 3 0 0 1 6 0 3 3 0 0 1 2.5 4.5A3 3 0 0 1 19 15a3 3 0 0 1-5 2.5V5Z" />
        <path d="M12 5v14" />
      </svg>
    ),
  },
  {
    label: 'No Harsh Stimulants',
    Icon: (p: { className?: string }) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={p.className} aria-hidden>
        <path d="M13 2 4.5 12.5H11l-1 9 4.5-5.6" />
        <path d="M3 3l18 18" />
      </svg>
    ),
  },
  {
    label: 'Delivered in Minutes',
    Icon: (p: { className?: string }) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={p.className} aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
];

type Row = { label: string; tenx: boolean; coffee: boolean; energy: boolean; pre: boolean };
const compareRows: Row[] = [
  { label: 'Brain nourishment', tenx: true, coffee: false, energy: false, pre: false },
  { label: 'Calm, controllable energy', tenx: true, coffee: false, energy: false, pre: false },
  { label: 'Focus & clarity', tenx: true, coffee: true, energy: true, pre: true },
  { label: 'No spikes', tenx: true, coffee: false, energy: false, pre: false },
  { label: 'No crash', tenx: true, coffee: false, energy: false, pre: false },
  { label: 'No jitters', tenx: true, coffee: false, energy: false, pre: false },
  { label: 'No harsh stimulants', tenx: true, coffee: false, energy: false, pre: false },
];

function Tick({ on }: { on: boolean }) {
  if (on) {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent text-ink">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M5 12.5 10 17.5 19 7" />
        </svg>
      </span>
    );
  }
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-paper-300 text-fg-subtle">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <line x1="6" y1="6" x2="18" y2="18" />
        <line x1="18" y1="6" x2="6" y2="18" />
      </svg>
    </span>
  );
}

/* ---------------- Icons & content for rich sections ---------------- */
type IconProps = { className?: string };

function PowerUpChevrons({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 64" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <polyline points="6 24 24 8 42 24" />
      <polyline points="6 40 24 24 42 40" />
      <polyline points="6 56 24 40 42 56" />
    </svg>
  );
}
function TargetIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" />
    </svg>
  );
}
function WavesIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M3 9c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2" />
      <path d="M3 15c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2" />
    </svg>
  );
}
function BoltOffIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M13 2 4.5 12.5H11l-1 9 4.5-5.6" /><path d="M3 3l18 18" />
    </svg>
  );
}
function PacketIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M9 3.5l1.5 2 1.5-2 1.5 2 1.5-2" /><rect x="6.5" y="5.5" width="11" height="15" rx="1" /><path d="M6.5 9.5h11" />
    </svg>
  );
}
function StirIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M21 12a9 9 0 1 1-2.64-6.36" /><polyline points="21 4 21 9 16 9" />
    </svg>
  );
}
function GlassIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M6 4h12l-1.4 15a2 2 0 0 1-2 1.8H9.4a2 2 0 0 1-2-1.8L6 4Z" /><path d="M6.5 10h11" />
    </svg>
  );
}
function AtomIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <circle cx="12" cy="12" r="1.5" />
      <ellipse cx="12" cy="12" rx="10" ry="4.5" />
      <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(120 12 12)" />
    </svg>
  );
}
function DropletIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" /><path d="M9.5 14a2.5 2.5 0 0 0 2.5 2.5" />
    </svg>
  );
}
function BrainIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M12 5a3 3 0 0 0-6 0 3 3 0 0 0-2.5 4.5A3 3 0 0 0 5 15a3 3 0 0 0 5 2.5V5Z" />
      <path d="M12 5a3 3 0 0 1 6 0 3 3 0 0 1 2.5 4.5A3 3 0 0 1 19 15a3 3 0 0 1-5 2.5V5Z" />
      <path d="M12 5v14" />
    </svg>
  );
}
function Stars({ className }: IconProps) {
  return (
    <span className={`flex ${className ?? ''}`} aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7Z" />
        </svg>
      ))}
    </span>
  );
}

const benefits = [
  { title: 'Sharper Focus', Icon: TargetIcon, body: 'Lock into deep work with a clear, steady mind — without the nervous edge.' },
  { title: 'Calm Energy', Icon: WavesIcon, body: 'Expansive, controllable energy your brain can regulate all day long.' },
  { title: 'Zero Crash', Icon: BoltOffIcon, body: 'No spike, no slump — just consistent output from morning to evening.' },
];

const steps = [
  { n: '01', title: 'Tear & Pour', Icon: PacketIcon, body: 'Open one 60ml sachet of 10X Daytime.' },
  { n: '02', title: 'Add & Mix', Icon: StirIcon, body: 'Stir it into a glass of water until fully blended.' },
  { n: '03', title: 'Drink & Go', Icon: GlassIcon, body: 'Sip and feel the focus kick in — no crash later.' },
];

const inside = [
  { title: 'Amino Acids', Icon: AtomIcon, body: 'Building blocks for focus & mood.' },
  { title: 'Nutrients', Icon: DropletIcon, body: 'Recognizable, bioavailable forms.' },
  { title: 'Nootropics', Icon: BrainIcon, body: 'Studied support for clarity.' },
];

const reviews = [
  { quote: 'Real focus without the 3pm crash. It’s my go-to before deep work.', name: 'Aarav S.', role: 'Founder' },
  { quote: 'Clean energy, zero jitters — I feel calm and switched on at the same time.', name: 'Meera K.', role: 'Designer' },
  { quote: 'Finally something that supports my brain instead of frying it.', name: 'Kabir R.', role: 'Athlete' },
];

const faqs = [
  { q: 'What is 10X Daytime?', a: '10X Daytime is brain nourishment — a precise blend of amino acids, nutrients, and nootropics designed for focus, clarity, and control. It supports the brain rather than overriding it.' },
  { q: 'Is it an energy drink?', a: 'No. Energy drinks and coffee force a spike with harsh stimulants, then a crash. 10X uses ingredients your body already recognizes to deliver calm, controllable energy.' },
  { q: 'How do I use it?', a: 'Tear open one 60ml sachet, mix it into a glass of water, and drink. Each pack contains two sachets.' },
  { q: 'What’s inside?', a: 'Amino acids, nutrients, and nootropics in more effective, bioavailable forms. No harsh stimulants and no unnecessary additives.' },
  { q: 'Where can I buy it?', a: 'On 10xdrink.com and via quick-commerce — Blinkit, Zepto, Swiggy Instamart, and Flipkart Minutes.' },
];

const retailerLogos = [
  { src: logoTenx, name: '10xdrink.com' },
  { src: logoBlinkit, name: 'Blinkit' },
  { src: logoZepto, name: 'Zepto' },
  { src: logoInstamart, name: 'Swiggy Instamart' },
  { src: logoFlipkart, name: 'Flipkart Minutes' },
];

const productJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: '10X Daytime',
  description:
    'Brain nourishment for focus, clarity, and control. A precise blend of amino acids, nutrients, and nootropics. No spikes, no crashes, no noise.',
  brand: { '@type': 'Brand', name: '10X' },
  offers: {
    '@type': 'Offer',
    price: '299',
    priceCurrency: 'INR',
    availability: 'https://schema.org/InStock',
  },
};

export default function ProductPage() {
  return (
    <main id="main" className="bg-paper pt-16 md:pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      {/* ============ Top: gallery + info ============ */}
      <section className="mx-auto max-w-7xl px-6 py-10 sm:px-10 md:px-14 md:py-14">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 font-pt text-caption text-fg-muted">
          <Link href="/#collection" className="inline-flex items-center gap-1 transition-colors hover:text-fg">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Shop
          </Link>
          <span aria-hidden>/</span>
          <span className="text-fg">10X Daytime</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-14">
          {/* Gallery */}
          <ProductGallery images={gallery} />

          {/* Info */}
          <div className="md:py-2">
            <p className="font-quantico text-caption font-bold uppercase tracking-[0.18em] text-brand-blue">
              The Brain Battery
            </p>
            <h1 className="mt-2 font-condensed text-[clamp(2.25rem,5vw,3.5rem)] font-black uppercase italic leading-[0.95] tracking-tight text-fg">
              10X Daytime
            </h1>

            {/* Rating */}
            <div className="mt-3 flex items-center gap-2">
              <span className="flex text-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7Z" />
                  </svg>
                ))}
              </span>
              <span className="font-pt text-caption text-fg-muted">4.8 · 2,150+ reviews</span>
            </div>

            {/* Price */}
            <div className="mt-5 flex items-baseline gap-3">
              <span className="font-quantico text-[2rem] font-bold leading-none text-ink">₹299</span>
              <span className="font-quantico text-body text-fg-subtle line-through">₹399</span>
              <span className="bg-accent/15 px-2 py-1 font-quantico text-[10px] font-bold uppercase tracking-wider text-brand-blue">
                Save 25%
              </span>
            </div>
            <p className="mt-1 font-pt text-body-sm text-fg-muted">Pack of 2 · 60ml sachets</p>

            <p className="mt-5 max-w-md font-pt text-body-lg text-fg-muted">
              Brain nourishment for focus, clarity, and control — a precise blend of
              amino acids, nutrients, and nootropics. No spikes. No crashes. No noise.
            </p>

            {/* Buy options */}
            <div className="mt-7 border-t border-paper-200 pt-7">
              <BuyOptions product={product} />
            </div>

            {/* Trust row */}
            <div className="mt-8 grid grid-cols-3 gap-px overflow-hidden border border-paper-200 bg-paper-200">
              {trust.map(({ label, Icon }) => (
                <div key={label} className="flex flex-col items-center gap-2 bg-white px-3 py-5 text-center">
                  <Icon className="h-6 w-6 text-brand-blue" />
                  <span className="font-quantico text-[10px] font-bold uppercase tracking-wider text-fg">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ Benefits band ============ */}
      <section className="relative overflow-hidden text-white" style={{ backgroundColor: '#0821D2' }}>
        <PowerUpChevrons className="pointer-events-none absolute -right-8 bottom-0 h-72 w-56 text-white/[0.06]" />
        <div className="relative mx-auto max-w-6xl px-6 py-16 sm:px-10 md:px-14 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-quantico text-caption font-bold uppercase tracking-[0.2em] text-accent">
              The Daytime Difference
            </p>
            <h2 className="mt-3 font-condensed text-[clamp(1.75rem,4.5vw,3rem)] font-black uppercase italic leading-[0.95] tracking-tight">
              Switched On. Not Wired.
            </h2>
          </div>
          <div className="mt-12 grid gap-10 sm:grid-cols-3 md:gap-12">
            {benefits.map(({ title, body, Icon }) => (
              <div key={title} className="text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center border-2 border-accent text-accent">
                  <Icon className="h-8 w-8" />
                </span>
                <h3 className="mt-6 font-quantico text-body-lg font-bold uppercase tracking-wide">{title}</h3>
                <p className="mx-auto mt-3 max-w-xs font-pt text-body text-white/80">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ How to use ============ */}
      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 md:px-14 md:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-quantico text-caption font-bold uppercase tracking-[0.2em] text-brand-blue">
              How To Use
            </p>
            <h2 className="mt-3 font-condensed text-[clamp(2rem,4.5vw,3.25rem)] font-black uppercase italic leading-[0.95] tracking-tight text-fg">
              Ready In Seconds
            </h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3 md:gap-8">
            {steps.map(({ n, title, body, Icon }) => (
              <div key={n} className="relative overflow-hidden border border-paper-200 bg-white p-8 md:p-9">
                <span aria-hidden className="absolute right-3 top-1 font-condensed text-[4.5rem] font-black italic leading-none text-paper-100">
                  {n}
                </span>
                <span className="relative flex h-14 w-14 items-center justify-center border-2 border-brand-blue text-brand-blue">
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="relative mt-6 font-quantico text-body-lg font-bold uppercase tracking-wide text-fg">{title}</h3>
                <p className="relative mt-3 font-pt text-body text-fg-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ What's inside ============ */}
      <section className="bg-paper-100">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 md:px-14 md:py-28">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-quantico text-caption font-bold uppercase tracking-[0.2em] text-brand-blue">
                Inside Every Sachet
              </p>
              <h2 className="mt-3 font-condensed text-[clamp(2rem,4.5vw,3.25rem)] font-black uppercase italic leading-[0.95] tracking-tight text-fg">
                A Precise Blend
              </h2>
            </div>
            <Link
              href="/formulation"
              className="inline-flex cursor-pointer items-center gap-1.5 font-quantico text-caption font-bold uppercase tracking-wider text-brand-blue transition-opacity hover:opacity-70"
            >
              Explore the formulation
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {inside.map(({ title, body, Icon }) => (
              <div key={title} className="flex items-center gap-4 border border-paper-200 bg-white p-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-accent text-brand-blue">
                  <Icon className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-quantico text-body-sm font-bold uppercase tracking-wide text-fg">{title}</p>
                  <p className="mt-0.5 font-pt text-caption text-fg-muted">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Comparison table ============ */}
      <section className="bg-paper-100">
        <div className="mx-auto max-w-5xl px-6 py-20 sm:px-10 md:px-14 md:py-28">
          <div className="max-w-2xl">
            <p className="font-quantico text-caption font-bold uppercase tracking-[0.2em] text-brand-blue">
              Why 10X
            </p>
            <h2 className="mt-3 font-condensed text-[clamp(2rem,4.5vw,3.25rem)] font-black uppercase italic leading-[0.95] tracking-tight text-fg">
              Not Another Energy Hit
            </h2>
            <p className="mt-4 font-pt text-body-lg text-fg-muted">
              Coffee, energy drinks and pre-workout force a spike, then a crash. 10X
              supports the brain instead.
            </p>
          </div>

          <div className="mt-12 overflow-x-auto">
            <div className="grid min-w-[620px] grid-cols-[1.6fr_1fr_1fr_1fr_1fr] bg-white shadow-card">
              {/* Header */}
              <div className="border-b border-paper-200" />
              <div className="flex items-center justify-center border-b border-paper-200 bg-ink px-3 py-5 text-center font-condensed text-body-lg font-black italic text-accent">
                10X
              </div>
              <div className="flex items-center justify-center border-b border-paper-200 px-3 py-5 text-center font-quantico text-caption font-bold uppercase tracking-wide text-fg-muted">
                Coffee
              </div>
              <div className="flex items-center justify-center border-b border-paper-200 px-3 py-5 text-center font-quantico text-caption font-bold uppercase tracking-wide text-fg-muted">
                Energy Drinks
              </div>
              <div className="flex items-center justify-center border-b border-paper-200 px-3 py-5 text-center font-quantico text-caption font-bold uppercase tracking-wide text-fg-muted">
                Pre-Workout
              </div>

              {/* Rows */}
              {compareRows.map((row, i) => {
                const last = i === compareRows.length - 1;
                return (
                  <Fragment key={row.label}>
                    <div className={`flex items-center px-4 py-4 font-pt text-body-sm text-fg ${last ? '' : 'border-b border-paper-200'}`}>
                      {row.label}
                    </div>
                    <div className={`flex items-center justify-center bg-ink px-3 py-4 ${last ? '' : 'border-b border-white/10'}`}>
                      <Tick on={row.tenx} />
                    </div>
                    <div className={`flex items-center justify-center px-3 py-4 ${last ? '' : 'border-b border-paper-200'}`}>
                      <Tick on={row.coffee} />
                    </div>
                    <div className={`flex items-center justify-center px-3 py-4 ${last ? '' : 'border-b border-paper-200'}`}>
                      <Tick on={row.energy} />
                    </div>
                    <div className={`flex items-center justify-center px-3 py-4 ${last ? '' : 'border-b border-paper-200'}`}>
                      <Tick on={row.pre} />
                    </div>
                  </Fragment>
                );
              })}
            </div>
          </div>
          <p className="mt-4 font-pt text-caption text-fg-subtle">
            Based on typical mass-market stimulant products.
          </p>
        </div>
      </section>

      {/* ============ Reviews ============ */}
      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 md:px-14 md:py-28">
          <div className="flex flex-col items-center gap-3 text-center">
            <Stars className="text-accent" />
            <p className="font-condensed text-[clamp(2.5rem,6vw,4rem)] font-black italic leading-none text-fg">4.8</p>
            <p className="font-quantico text-caption font-bold uppercase tracking-widest text-fg-muted">
              Out of 5 · 2,150+ reviews
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {reviews.map((r) => (
              <figure key={r.name} className="flex flex-col border border-paper-200 bg-white p-7">
                <span aria-hidden className="font-condensed text-[3rem] font-black italic leading-[0.6] text-accent">&ldquo;</span>
                <Stars className="mt-2 text-accent" />
                <blockquote className="mt-4 flex-1 font-pt text-body text-fg">{r.quote}</blockquote>
                <figcaption className="mt-5 font-quantico text-caption font-bold uppercase tracking-wide text-fg">
                  {r.name} <span className="text-fg-muted">· {r.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="bg-paper-100">
        <div className="mx-auto max-w-3xl px-6 py-20 sm:px-10 md:px-14 md:py-28">
          <div className="text-center">
            <p className="font-quantico text-caption font-bold uppercase tracking-[0.2em] text-brand-blue">FAQ</p>
            <h2 className="mt-3 font-condensed text-[clamp(2rem,4.5vw,3.25rem)] font-black uppercase italic leading-[0.95] tracking-tight text-fg">
              Questions, Answered
            </h2>
          </div>
          <div className="mt-10 border-t border-paper-200">
            {faqs.map((f) => (
              <details key={f.q} className="group border-b border-paper-200">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-quantico text-body font-bold uppercase tracking-wide text-fg">
                  {f.q}
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-paper-300 text-brand-blue transition-transform duration-200 group-open:rotate-45">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </span>
                </summary>
                <p className="pb-6 font-pt text-body text-fg-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Closing — available across India ============ */}
      <section className="relative overflow-hidden bg-ink text-white">
        <Image src={ctaBg} alt="" fill sizes="100vw" className="object-cover object-center opacity-25" />
        <div aria-hidden className="absolute inset-0 bg-ink/55" />
        <div className="relative z-10 mx-auto max-w-5xl px-6 py-20 text-center sm:px-10 md:px-14 md:py-28">
          <PowerUpChevrons className="mx-auto h-11 w-9 text-accent" />
          <p className="mt-6 font-quantico text-caption font-bold uppercase tracking-[0.2em] text-accent">
            Where To Get It
          </p>
          <h2 className="mt-3 font-condensed text-[clamp(2rem,5vw,3.5rem)] font-black uppercase italic leading-[0.95] tracking-tight">
            Available Across India
          </h2>
          <p className="mx-auto mt-4 max-w-lg font-pt text-body-lg text-white/85">
            10X Daytime ships fast from 10xdrink.com and every major quick-commerce
            app — delivered to your door in minutes.
          </p>

          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-5">
            {retailerLogos.map((r) => (
              <div
                key={r.name}
                className="flex h-16 items-center justify-center overflow-hidden border border-white/15 bg-white px-4"
              >
                <span className="relative h-7 w-full">
                  <Image src={r.src} alt={r.name} fill sizes="140px" className="object-contain" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
