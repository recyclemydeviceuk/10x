'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useAuth } from './account/AuthContext';
import { useTheme } from './ThemeProvider';
import logo from '../10x-Assets/10xLogo.webp';

const PRODUCT_HREF = '/products/10x-daytime';

const NAV = [
  { label: 'Brain Fog', href: '/brain-fog' },
  { label: "What's In It?", href: '/whats-in-it' },
];

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggle: toggleTheme } = useTheme();
  const { isAuthed } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[10002] w-full transition-all duration-300 ${
          menuOpen
            ? 'bg-ink'
            : scrolled
              ? 'bg-white shadow-card dark:bg-paper dark:shadow-none'
              : 'bg-white border-b border-paper-200 dark:bg-paper dark:border-none'
        }`}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-8 md:h-[72px] md:px-14">
          {/* Home uses a document navigation deliberately. If a visitor keeps
              a tab open across a Vercel deployment, a cached Next.js RSC
              transition can reference the previous build and fail until a
              reload. This makes the logo click perform that clean reload. */}
          <a href="/" aria-label="10X — Home" className="relative z-[10001] flex cursor-pointer items-center">
            <Image
              src={logo}
              alt="10X — The Brain Battery"
              width={120}
              height={48}
              priority
              style={{ filter: menuOpen || theme !== 'light' ? 'brightness(100)' : 'brightness(0)' }}
              className="h-6 w-auto transition-all duration-300 md:h-8"
            />
          </a>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-8">
              {NAV.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="cursor-pointer font-quantico text-body-sm font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:text-accent-pressed dark:text-white dark:hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                theme === 'light'
                  ? 'Switch to dark mode'
                  : theme === 'dark'
                    ? 'Switch to black mode'
                    : 'Switch to light mode'
              }
              title={`Theme: ${theme}`}
              className="relative flex h-9 w-9 cursor-pointer items-center justify-center text-ink transition-colors hover:text-accent dark:text-white dark:hover:text-accent md:h-10 md:w-10"
            >
              {/* Sun — shown in dark mode (tap for black) */}
              <svg
                width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className={`absolute transition-all duration-300 ${theme === 'dark' ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
                aria-hidden
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
              {/* Moon — shown in light mode (tap for dark) */}
              <svg
                width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className={`absolute transition-all duration-300 ${theme === 'light' ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
                aria-hidden
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
              {/* Filled circle — shown in black mode (tap for light) */}
              <svg
                width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className={`absolute transition-all duration-300 ${theme === 'black' ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
                aria-hidden
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3a9 9 0 010 18z" fill="currentColor" stroke="none" />
              </svg>
            </button>

            {/* Account */}
            <Link
              href="/account"
              aria-label={isAuthed ? 'My account' : 'Sign in'}
              className={`relative flex h-9 w-9 items-center justify-center text-ink transition-colors hover:text-accent dark:text-white dark:hover:text-accent md:h-10 md:w-10 ${
                menuOpen ? 'scale-0 opacity-0 md:scale-100 md:opacity-100' : ''
              }`}
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {isAuthed && (
                <span
                  aria-hidden
                  className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent ring-2 ring-white dark:ring-paper"
                />
              )}
            </Link>

            {/* The cart lives in the floating bar (see FloatingCart), not here. */}

            <Link
              href={PRODUCT_HREF}
              /* Hidden below sm: with cart and account icons added, five
                 controls don't fit a 375px bar. The mobile menu carries this
                 CTA at full size instead. */
              className={`hidden cursor-pointer items-center gap-2 whitespace-nowrap bg-accent px-5 py-2 font-quantico text-[11px] font-bold uppercase tracking-[0.14em] text-ink transition-all hover:bg-accent-hover sm:inline-flex md:px-8 md:py-3 md:text-body-sm ${
                menuOpen ? 'scale-0 opacity-0 md:scale-100 md:opacity-100' : ''
              }`}
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
              className="relative z-[10001] -mr-1 flex h-10 w-10 cursor-pointer items-center justify-center md:hidden"
            >
              <div className="relative h-[18px] w-[22px]">
                {/* Top line */}
                <span
                  className={`absolute left-0 top-0 h-[2px] w-full bg-current transition-all duration-300 ease-in-out ${
                    menuOpen ? 'top-[8px] rotate-45 text-white' : 'text-ink dark:text-white'
                  }`}
                />
                {/* Middle line */}
                <span
                  className={`absolute left-0 top-[8px] h-[2px] w-full bg-current transition-all duration-200 ${
                    menuOpen ? 'scale-x-0 opacity-0 text-white' : 'text-ink dark:text-white'
                  }`}
                />
                {/* Bottom line */}
                <span
                  className={`absolute bottom-0 left-0 h-[2px] w-full bg-current transition-all duration-300 ease-in-out ${
                    menuOpen ? 'bottom-[8px] -rotate-45 text-white' : 'text-ink dark:text-white'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen mobile menu overlay */}
      <div
        id="mobile-nav"
        aria-hidden={!menuOpen}
        className={`fixed inset-0 z-[10000] bg-ink transition-all duration-500 ease-in-out md:hidden ${
          menuOpen
            ? 'visible opacity-100'
            : 'invisible opacity-0'
        }`}
      >
        <nav aria-label="Primary" className="flex h-full flex-col justify-center px-8">
          <ul className="space-y-2">
            {NAV.map((item, i) => (
              <li
                key={item.label}
                className={`transition-all duration-500 ease-out ${
                  menuOpen
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: menuOpen ? `${150 + i * 80}ms` : '0ms' }}
              >
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block cursor-pointer py-4 font-quantico text-3xl font-bold italic text-white transition-colors hover:text-accent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {/* Account gets its own row on mobile */}
            {[
              { label: isAuthed ? 'My Account' : 'Sign In', href: '/account' },
            ].map((item, i) => (
              <li
                key={item.href}
                className={`transition-all duration-500 ease-out ${
                  menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
                style={{
                  transitionDelay: menuOpen ? `${150 + (NAV.length + i) * 80}ms` : '0ms',
                }}
              >
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block cursor-pointer py-4 font-quantico text-3xl font-bold italic text-white transition-colors hover:text-accent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li
              className={`transition-all duration-500 ease-out ${
                menuOpen
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: menuOpen ? `${150 + (NAV.length + 1) * 80}ms` : '0ms' }}
            >
              <Link
                href={PRODUCT_HREF}
                onClick={() => setMenuOpen(false)}
                className="mt-4 inline-flex cursor-pointer items-center gap-3 bg-accent px-8 py-4 font-quantico text-lg font-bold italic text-ink transition-colors hover:bg-accent-hover"
              >
                Order Now
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </li>
          </ul>

          {/* Bottom tagline */}
          <p
            className={`mt-16 text-[13px] text-white/30 transition-all duration-500 ease-out ${
              menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: menuOpen ? '450ms' : '0ms' }}
          >
            The Brain Battery
          </p>
        </nav>
      </div>
    </>
  );
}
