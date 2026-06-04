'use client';

import { usePathname } from 'next/navigation';

import { useCart } from './CartContext';

function formatPrice(n: number) {
  return `₹${Math.floor(n).toLocaleString('en-IN')}`;
}

export default function FloatingCartBar() {
  const { count, totals, isOpen, open } = useCart();
  const pathname = usePathname();

  const onCheckout = !!pathname && pathname.startsWith('/checkout');
  const visible = count > 0 && !isOpen && !onCheckout;

  return (
    <div
      className={`fixed inset-x-0 bottom-4 z-[9990] flex justify-center px-4 transition-all duration-300 ease-out md:bottom-6 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-[180%] opacity-0'
      }`}
      aria-hidden={!visible}
    >
      <button
        type="button"
        onClick={open}
        aria-label={`View cart, ${count} ${count === 1 ? 'item' : 'items'}, ${formatPrice(totals.grandTotal)}`}
        className="flex w-full max-w-md cursor-pointer items-center justify-between gap-4 rounded-full px-4 py-3 text-white shadow-elevated transition-opacity hover:opacity-95 md:px-5"
        style={{ background: 'linear-gradient(90deg, #000204 0%, #02063A 35%, #0821D2 100%)' }}
      >
        <span className="flex items-center gap-3">
          <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-accent px-1 font-quantico text-[10px] font-bold leading-none text-ink">
              {count > 99 ? '99+' : count}
            </span>
          </span>
          <span className="text-left leading-tight">
            <span className="block font-quantico text-[10px] font-bold uppercase tracking-wider text-white/65">
              {count} {count === 1 ? 'item' : 'items'}
            </span>
            <span className="block font-quantico text-body font-bold">{formatPrice(totals.grandTotal)}</span>
          </span>
        </span>
        <span className="flex items-center gap-1.5 pr-1 font-quantico text-body-sm font-bold uppercase tracking-wider text-accent">
          View Cart
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </span>
      </button>
    </div>
  );
}
