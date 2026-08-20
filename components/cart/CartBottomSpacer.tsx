'use client';

import { usePathname } from 'next/navigation';

import { useCart } from './CartContext';

/**
 * Keeps the fixed bottom bars off the footer's links.
 *
 * This renders INSIDE the footer, not after it. An element placed after the
 * footer sits on the page background — which is white in light mode — so it
 * showed up as a bright band under the black footer. Inside, it inherits the
 * footer's own background and simply makes it taller.
 *
 * Height tracks whichever bar is actually on screen:
 *   · cart page  — the sticky checkout CTA, mobile only
 *   · checkout / account — no bar, no spacer
 *   · everywhere else — the floating cart bar, all breakpoints
 */
const FLOW_ROUTES = ['/cart', '/checkout', '/account'];

export default function CartBottomSpacer() {
  const pathname = usePathname();
  const { line, loading } = useCart();

  if (loading || !line) return null;

  const inFlow = FLOW_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (!inFlow) return <div aria-hidden className="h-24" />;
  if (pathname === '/cart') return <div aria-hidden className="h-24 lg:h-0" />;
  return null;
}
