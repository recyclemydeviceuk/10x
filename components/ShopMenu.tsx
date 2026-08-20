'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { PRODUCT_IMAGES } from './productMedia';
import { useTheme } from './ThemeProvider';
const NIGHT_IMG =
  'https://res.cloudinary.com/dyxxkrq8r/image/upload/v1780496210/Night_Time_qhfuds.jpg';

export default function ShopMenu() {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const pathname = usePathname();
  const { theme } = useTheme();
  const daytimeImg = theme === 'dark' ? PRODUCT_IMAGES.front.dark : PRODUCT_IMAGES.front.light;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  function openNow() {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpen(true);
  }

  function scheduleClose() {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), 140);
  }

  return (
    <div
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className={`relative inline-flex items-center gap-1.5 px-2 py-2 font-quantico text-body-sm font-bold uppercase tracking-[0.14em] transition-colors md:px-3 ${
          open ? 'text-accent' : 'text-white hover:text-accent'
        }`}
      >
        Shop
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
        <span
          aria-hidden
          className={`absolute inset-x-2 -bottom-0.5 h-[2px] origin-left bg-accent transition-transform duration-200 md:inset-x-3 ${
            open ? 'scale-x-100' : 'scale-x-0'
          }`}
        />
      </button>

      {/* Mega panel */}
      <div
        className={`absolute left-0 top-full z-50 mt-2 origin-top-left transition-all duration-200 ${
          open
            ? 'visible translate-y-0 opacity-100'
            : 'invisible -translate-y-2 opacity-0'
        }`}
      >
        <div className="w-[min(92vw,360px)] border border-paper-200 bg-white dark:bg-paper p-2.5 text-ink dark:text-white shadow-elevated dark:shadow-none">
          <p className="mb-2 px-1 font-quantico text-[10px] font-bold uppercase tracking-[0.18em] text-fg-subtle">
            Shop 10X
          </p>
          <div className="space-y-1.5">
            {/* Daytime — available */}
            <Link
              href="/products/10x-daytime"
              className="group flex items-center gap-3 border border-paper-200 p-2 transition-colors hover:border-accent dark:hover:border-accent hover:bg-paper-50"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-paper-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={daytimeImg}
                  alt="10X Daytime"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <span className="flex-1 font-quantico text-body-sm font-bold uppercase tracking-wide text-ink dark:text-white">
                10X Daytime
              </span>
              <span className="inline-flex shrink-0 items-center gap-1 font-quantico text-[10px] font-bold uppercase tracking-wider text-accent dark:text-accent">
                Shop Now
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="transition-transform group-hover:translate-x-0.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </Link>

            {/* Nighttime — upcoming */}
            <div className="flex cursor-default items-center gap-3 border border-paper-200 p-2">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-paper-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={NIGHT_IMG}
                  alt="10X Nighttime"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <span className="flex-1 font-quantico text-body-sm font-bold uppercase tracking-wide text-ink dark:text-white">
                10X Nighttime
              </span>
              <span className="shrink-0 font-quantico text-[10px] font-bold uppercase tracking-wider text-fg-subtle">
                Upcoming
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
