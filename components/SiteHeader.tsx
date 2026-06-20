'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import logo from '../10x-Assets/10xLogo.webp';

const PRODUCT_HREF = '/products/10x-daytime';

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[9999] w-full bg-white transition-shadow duration-300 ${
        scrolled ? 'shadow-card' : 'border-b border-paper-200'
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
      </div>
    </header>
  );
}
