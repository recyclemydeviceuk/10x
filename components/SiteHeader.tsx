'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import logo from '../10x-Assets/10xLogo.webp';

const PRODUCT_HREF = '/products/10x-daytime';

/**
 * Primary navigation. "The Hardware" points at a placeholder page — the copy
 * for it lands separately, so only that page's contents need swapping in.
 */
const NAV = [
  { label: 'The Hardware', href: '/hardware' },
  { label: 'FAQ', href: '/#before-you-ask' },
  { label: 'Shop', href: PRODUCT_HREF },
];

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu on navigation and on Escape.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[9999] w-full bg-white transition-shadow duration-300 ${
        scrolled || menuOpen ? 'shadow-card' : 'border-b border-paper-200'
      }`}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-8 md:h-[72px] md:px-14">
        <Link href="/" aria-label="10X — Home" className="flex cursor-pointer items-center">
          <Image
            src={logo}
            alt="10X — The Brain Battery"
            width={120}
            height={48}
            priority
            // White artwork on transparent bg → brightness(0) renders it solid black for the white header
            style={{ filter: 'brightness(0)' }}
            className="h-6 w-auto md:h-8"
          />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {NAV.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="cursor-pointer font-quantico text-body-sm font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:text-accent-pressed"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={PRODUCT_HREF}
            className="inline-flex cursor-pointer items-center gap-2 bg-accent px-5 py-2 font-quantico text-[11px] font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-accent-hover md:px-8 md:py-3 md:text-body-sm"
          >
            Order Now
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="hidden sm:block">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>

          {/* Hamburger — mobile only */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="-mr-1 flex h-10 w-10 cursor-pointer items-center justify-center text-ink md:hidden"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
              {menuOpen ? (
                <>
                  <line x1="5" y1="5" x2="19" y2="19" />
                  <line x1="19" y1="5" x2="5" y2="19" />
                </>
              ) : (
                <>
                  <line x1="3.5" y1="7" x2="20.5" y2="7" />
                  <line x1="3.5" y1="12" x2="20.5" y2="12" />
                  <line x1="3.5" y1="17" x2="20.5" y2="17" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav panel */}
      <nav
        id="mobile-nav"
        aria-label="Primary"
        hidden={!menuOpen}
        className="border-t border-paper-200 bg-white md:hidden"
      >
        <ul className="mx-auto max-w-7xl px-4 py-2 sm:px-8">
          {NAV.map((item) => (
            <li key={item.label} className="border-b border-paper-200 last:border-b-0">
              <Link
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block cursor-pointer py-4 font-quantico text-body-sm font-bold uppercase tracking-[0.14em] text-ink"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
