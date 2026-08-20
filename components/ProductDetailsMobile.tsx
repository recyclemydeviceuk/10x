'use client';

import { useProductContent } from './ProductContentContext';

// Pick an icon for a benefit by keyword so the copy stays the source of truth.
function BenefitIcon({ label }: { label: string }) {
  const l = label.toLowerCase();
  const common = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  if (l.includes('shaker') || l.includes('cup')) {
    return (
      <svg {...common}>
        <path d="M7 8h10l-1 12a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1L7 8Z" />
        <path d="M6 8h12M8 8l.5-3.5A1 1 0 0 1 9.5 3.5h5a1 1 0 0 1 1 .9L16 8" />
        <path d="M8 12h8" />
      </svg>
    );
  }
  if (l.includes('sugar')) {
    return (
      <svg {...common}>
        <path d="M12 3s5 5.5 5 9a5 5 0 0 1-10 0c0-3.5 5-9 5-9Z" />
        <line x1="4" y1="4" x2="20" y2="20" />
      </svg>
    );
  }
  if (l.includes('energy') || l.includes('calm')) {
    return (
      <svg {...common}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    );
  }
  if (l.includes('protection') || l.includes('resilience')) {
    return (
      <svg {...common}>
        <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    );
  }
  // focus / cognitive / clarity → target
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.4" />
      <line x1="12" y1="2" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="2" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="22" y2="12" />
    </svg>
  );
}

// Mobile-only. Renders the product description and benefit grid below the
// Engineered With carousel, mirroring screen 2 of the design. On desktop this
// content lives inside the purchase panel instead (see ProductPurchase).
export default function ProductDetailsMobile() {
  const { product } = useProductContent();

  // Nothing to describe until the catalogue answers.
  if (!product) return null;
  const sf = product.storefront;
  const benefits = sf.benefits;

  return (
    <section aria-label="Product details" className="bg-white dark:bg-paper md:hidden">
      <div className="mx-auto max-w-2xl px-6 pb-10 pt-8 sm:px-10">
        {/* Description */}
        <div className="rounded-xl border border-paper-200 bg-paper-50 dark:bg-paper-200 p-5">
          <p className="type-b2 text-fg-muted">{product.description}</p>
          {sf.perfectFor ? (
            <p className="mt-3 type-b2 text-fg-muted">
              <span className="type-k mb-1 block text-ink dark:text-white">
                Perfect for
              </span>
              {sf.perfectFor}
            </p>
          ) : null}
        </div>

        {/* Benefits — 2×2 icon grid */}
        {benefits.length > 0 && (
        <ul className="mt-5 grid grid-cols-2 overflow-hidden rounded-xl border border-paper-200">
          {benefits.map((b: string, i: number) => (
            <li
              key={b}
              className={`flex items-center gap-3 p-4 ${
                i % 2 === 0 ? 'border-r border-paper-200' : ''
              } ${i >= 2 ? 'border-t border-paper-200' : ''}`}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15 text-ink dark:text-white">
                <BenefitIcon label={b} />
              </span>
              <span className="type-b2 leading-tight text-fg">{b}</span>
            </li>
          ))}
        </ul>
        )}
      </div>
    </section>
  );
}
