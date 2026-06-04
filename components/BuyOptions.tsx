'use client';

import Image, { type StaticImageData } from 'next/image';
import { useState } from 'react';

import { useCart, type CartProduct } from './CartContext';

import tenx from '../10x-Assets/10x-available.png';
import blinkit from '../10x-Assets/Blinkit.png';
import zepto from '../10x-Assets/Zepto.png';
import instamart from '../10x-Assets/Instamartlogo.webp';
import flipkart from '../10x-Assets/Flipkart Minutes.png';

type Retailer = {
  id: string;
  name: string;
  logo: StaticImageData;
  url?: string;
  scale?: string;
};

const RETAILERS: Retailer[] = [
  { id: '10xdrink', name: '10xdrink.com', logo: tenx, scale: 'scale-[1.35]' },
  { id: 'blinkit', name: 'Blinkit', logo: blinkit, url: 'https://blinkit.com/' },
  { id: 'zepto', name: 'Zepto', logo: zepto, url: 'https://www.zepto.in/' },
  { id: 'instamart', name: 'Swiggy Instamart', logo: instamart, url: 'https://www.swiggy.com/instamart' },
  { id: 'flipkart', name: 'Flipkart Minutes', logo: flipkart, url: 'https://www.flipkart.com/' },
];

const gradient = 'linear-gradient(90deg, #000204 0%, #02063A 35%, #0821D2 100%)';

export default function BuyOptions({ product }: { product: CartProduct }) {
  const { addItem, open } = useCart();
  const [selectedId, setSelectedId] = useState('10xdrink');
  const [copied, setCopied] = useState(false);

  const selected = RETAILERS.find((r) => r.id === selectedId) ?? RETAILERS[0];

  async function copyLink() {
    if (!selected.url) return;
    try {
      await navigator.clipboard.writeText(selected.url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div>
      <p className="font-quantico text-caption font-bold uppercase tracking-[0.16em] text-fg-muted">
        Where to buy
      </p>

      {/* Retailer logos */}
      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
        {RETAILERS.map((r) => {
          const isActive = r.id === selectedId;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => {
                setSelectedId(r.id);
                setCopied(false);
              }}
              aria-pressed={isActive}
              aria-label={r.name}
              className={`flex h-16 cursor-pointer items-center justify-center overflow-hidden border bg-white px-3 transition-colors ${
                isActive
                  ? 'border-brand-blue ring-1 ring-brand-blue'
                  : 'border-paper-200 hover:border-paper-300'
              }`}
            >
              <span className="relative h-7 w-full">
                <Image
                  src={r.logo}
                  alt={r.name}
                  fill
                  sizes="120px"
                  className="object-contain"
                />
              </span>
            </button>
          );
        })}
      </div>

      {/* Action area */}
      <div className="mt-5">
        {selected.id === '10xdrink' ? (
          <>
            <button
              type="button"
              onClick={() => {
                addItem(product, 1);
                open();
              }}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 px-8 py-4 font-quantico text-body-sm font-bold uppercase tracking-[0.18em] text-white shadow-elevated transition hover:opacity-90"
              style={{ background: gradient }}
            >
              Add to Cart · {product.priceLabel}
            </button>
            <p className="mt-2.5 text-center font-pt text-caption text-fg-muted">
              Ships from 10xdrink.com — fast, fresh delivery.
            </p>
          </>
        ) : (
          <>
            <p className="mb-2 font-pt text-body-sm text-fg-muted">
              Buy 10X Daytime on <span className="font-bold text-fg">{selected.name}</span>:
            </p>
            <div className="flex items-stretch border border-paper-200">
              <input
                readOnly
                value={selected.url}
                aria-label={`${selected.name} link`}
                onFocus={(e) => e.currentTarget.select()}
                className="min-w-0 flex-1 truncate bg-paper-50 px-3 py-3 font-pt text-body-sm text-fg outline-none"
              />
              <button
                type="button"
                onClick={copyLink}
                className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 bg-ink px-4 font-quantico text-caption font-bold uppercase tracking-wider text-white transition-colors hover:bg-ink-900"
              >
                {copied ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M5 12.5 10 17.5 19 7" />
                    </svg>
                    Copied
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <rect x="9" y="9" width="11" height="11" rx="1.5" />
                      <path d="M5 15V5a1.5 1.5 0 0 1 1.5-1.5H15" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
            <a
              href={selected.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex cursor-pointer items-center gap-1.5 font-quantico text-caption font-bold uppercase tracking-wider text-brand-blue transition-opacity hover:opacity-70"
            >
              Open {selected.name}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M7 17 17 7M9 7h8v8" />
              </svg>
            </a>
          </>
        )}
      </div>
    </div>
  );
}
