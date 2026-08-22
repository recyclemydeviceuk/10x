'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { inr } from '@/lib/store/types';

import { useTheme } from '@/components/ThemeProvider';
import { useCart } from './CartContext';

/**
 * Floating cart bar — the quick-commerce pattern.
 *
 * Sits at the bottom centre on every page and follows the customer around, so
 * a filled cart is never more than one tap away. It hides itself once they're
 * inside the purchase flow, where the cart is already the subject of the page
 * and a floating copy of it would just be in the way.
 */

/** Routes that ARE the cart flow — the bar has nothing to add on these. */
const HIDDEN_ON = ['/cart', '/checkout', '/account'];

export default function FloatingCart() {
  const pathname = usePathname();
  const { line, itemCount, total, loading } = useCart();
  const [mounted, setMounted] = useState(false);
  // Every hook runs on every render, BEFORE any early return. Calling one
  // after `return null` changes the hook order the moment the bar hides
  // (e.g. stepping into /checkout) — React then throws, and production
  // shows the generic "something went wrong" card.
  const { theme } = useTheme();

  // Drives the entrance transition — without a frame at the start state the
  // bar would snap in rather than rise.
  useEffect(() => {
    if (line) {
      const id = window.requestAnimationFrame(() => setMounted(true));
      return () => window.cancelAnimationFrame(id);
    }
    setMounted(false);
  }, [line]);

  const inPurchaseFlow = HIDDEN_ON.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  // Clearance for the footer is handled by CartBottomSpacer, which renders
  // inside the footer so it inherits its background.
  if (loading || !line || inPurchaseFlow) return null;

  // The cart line carries the product's own photo from the catalogue, in both
  // looks — so the thumbnail matches the theme and the pack that ships.
  const thumb = (theme === 'light' ? line?.image : line?.imageDark || line?.image) || '';

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[9990] flex justify-center px-4 pb-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
      aria-live="polite"
    >
      {/* Frosted pill. The surface is deliberately translucent — the blur is
          what sells it, so the background stays low-opacity and the border
          supplies the edge the fill no longer does. */}
      <Link
        href="/cart"
        className={`pointer-events-auto flex w-full max-w-[20.5rem] items-center gap-2.5 rounded-full border border-black/[0.06] bg-white/60 p-1.5 shadow-elevated backdrop-blur-2xl backdrop-saturate-150 transition-all duration-300 ease-out-expo hover:bg-white/75 dark:border-white/[0.14] dark:bg-[#111318]/55 dark:hover:bg-[#111318]/70 ${
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}
      >
        {/* Thumb + count */}
        <span className="relative shrink-0">
          {/* paper-200 is a CSS variable, so it can't take a /opacity modifier. */}
          <span className="block h-9 w-9 overflow-hidden rounded-full bg-white dark:bg-paper">
            {thumb ? (
              <Image
                src={thumb}
                alt=""
                width={36}
                height={36}
                className="h-full w-full object-contain"
              />
            ) : null}
          </span>
          <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 font-quantico text-[10px] font-bold leading-none text-ink">
            {itemCount}
          </span>
        </span>

        {/* Copy */}
        <span className="min-w-0 flex-1 pl-0.5">
          <span className="block truncate font-quantico text-[9px] font-bold uppercase tracking-[0.16em] text-fg-muted">
            {line.isSubscription ? 'Subscription' : `${itemCount} ${itemCount > 1 ? 'packs' : 'pack'}`}
          </span>
          <span className="mt-px block truncate font-quantico text-body-sm font-bold leading-tight text-fg">
            {inr(total)}
            {line.isSubscription && (
              <span className="font-pt text-[10px] font-normal text-fg-muted"> / cycle</span>
            )}
          </span>
        </span>

        {/* CTA */}
        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-accent px-4 py-2.5 font-quantico text-[10px] font-bold uppercase tracking-[0.12em] text-ink">
          View Cart
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </span>
      </Link>
    </div>
  );
}
