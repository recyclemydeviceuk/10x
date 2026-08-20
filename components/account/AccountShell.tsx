'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';

import Avatar from './Avatar';
import AuthModal from './AuthModal';
import { useAuth } from './AuthContext';

const NAV = [
  {
    href: '/account',
    label: 'Dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="3" y="3" width="7" height="9" />
        <rect x="14" y="3" width="7" height="5" />
        <rect x="14" y="12" width="7" height="9" />
        <rect x="3" y="16" width="7" height="5" />
      </svg>
    ),
  },
  {
    href: '/account/orders',
    label: 'Orders',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M6 7h12l-1 13H7L6 7Z" />
        <path d="M9 7a3 3 0 0 1 6 0" />
      </svg>
    ),
  },
  {
    href: '/account/subscriptions',
    label: 'Subscription',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M21 12a9 9 0 1 1-3-6.7" />
        <polyline points="21 3 21 9 15 9" />
      </svg>
    ),
  },
  {
    href: '/account/addresses',
    label: 'Addresses',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    href: '/account/profile',
    label: 'Profile',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

/** What signing in actually gets you — shown on the signed-out screen. */
const PERKS = [
  {
    label: 'Track every order',
    sub: 'Live status from dispatch to your door',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="1" y="3" width="15" height="13" />
        <path d="M16 8h4l3 3v5h-7V8Z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    label: 'Manage your subscription',
    sub: 'Cancel or restart in one tap',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M21 12a9 9 0 1 1-3-6.7" />
        <polyline points="21 3 21 9 15 9" />
      </svg>
    ),
  },
  {
    label: 'Faster checkout',
    sub: 'Saved addresses, no retyping',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
];

/**
 * Account shell — sidebar nav plus the auth wall.
 *
 * Signed out, the whole section is replaced by a sign-in prompt rather than
 * redirected away: a customer who lands here from an order email should see
 * what this page is and be one click from getting in.
 */
export default function AccountShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { customer, loading, isAuthed, signOut } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  if (loading) {
    return (
      <main id="main" className="min-h-[70vh] bg-paper">
        <div className="mx-auto max-w-6xl px-6 pb-20 pt-28 sm:px-10 md:px-14 md:pt-36">
          <div className="h-9 w-52 animate-pulse bg-paper-200" />
          <div className="mt-8 h-72 w-full animate-pulse bg-paper-200" />
        </div>
      </main>
    );
  }

  /* ------------------------------------------------------- signed out */
  if (!isAuthed) {
    return (
      <main id="main" className="bg-paper">
        <div className="mx-auto max-w-md px-6 pb-24 pt-28 sm:px-10 md:pt-36">
          {/* One panel rather than centred text floating in the page — the
              account section is built from bordered blocks, and the signed-out
              state should look like it belongs to the same screen. */}
          <div className="border-2 border-paper-200">
            <div className="p-7 sm:p-9">
              <p className="font-quantico text-caption font-bold uppercase tracking-[0.2em] text-accent">
                My Account
              </p>
              <h1 className="mt-3 font-condensed text-[clamp(2.25rem,7vw,3rem)] font-black uppercase italic leading-[0.88] tracking-tight text-fg">
                Sign In
              </h1>
              <span aria-hidden className="mt-4 block h-1 w-12 bg-accent" />

              <p className="mt-5 font-pt text-body text-fg-muted">
                Everything you&rsquo;ve ordered, in one place.
              </p>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setAuthOpen(true);
                }}
                className="mt-7 flex min-h-[54px] w-full cursor-pointer items-center justify-center bg-accent px-6 py-4 font-quantico text-body-sm font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-accent-hover"
              >
                Sign In
              </button>

              <p className="mt-4 text-center font-pt text-body-sm text-fg-muted">
                New here?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setAuthOpen(true);
                  }}
                  className="cursor-pointer font-bold text-accent underline decoration-accent/40 underline-offset-4 transition-opacity hover:opacity-70"
                >
                  Create an account
                </button>
              </p>
            </div>

            {/* What the account is actually for. Three concrete lines beat one
                vague sentence about "managing" things. */}
            <ul className="divide-y divide-paper-200 border-t-2 border-paper-200 bg-paper-50 dark:bg-paper-200">
              {PERKS.map((perk) => (
                <li key={perk.label} className="flex items-center gap-4 px-7 py-4 sm:px-9">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center text-accent-pressed dark:text-accent">
                    {perk.icon}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-quantico text-caption font-bold uppercase tracking-[0.12em] text-fg">
                      {perk.label}
                    </span>
                    <span className="mt-0.5 block font-pt text-caption text-fg-muted">
                      {perk.sub}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <AuthModal
          open={authOpen}
          onClose={() => setAuthOpen(false)}
          initialMode={authMode}
        />
      </main>
    );
  }

  /* -------------------------------------------------------- signed in */
  return (
    <main id="main" className="bg-paper">
      <div className="mx-auto max-w-6xl px-5 pb-24 pt-24 sm:px-10 sm:pt-28 md:px-14 md:pt-36">
        {/* Greeting */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4 sm:gap-5">
            <Avatar
              name={customer?.name ?? ''}
              src={customer?.avatarUrl}
              className="h-14 w-14 text-base sm:h-16 sm:w-16 sm:text-lg"
            />
            <div className="min-w-0">
              <p className="font-quantico text-caption font-bold uppercase tracking-[0.2em] text-accent">
                My Account
              </p>
              <h1 className="mt-1.5 truncate font-condensed text-[clamp(1.75rem,5vw,2.75rem)] font-black uppercase italic leading-[0.95] tracking-tight text-fg">
                {customer?.name?.split(' ')[0] || 'Welcome'}
              </h1>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              signOut();
              router.push('/');
            }}
            className="shrink-0 cursor-pointer font-quantico text-body-sm font-bold uppercase tracking-[0.12em] text-fg-muted underline decoration-paper-300 underline-offset-4 transition-colors hover:text-danger"
          >
            Sign out
          </button>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-6 sm:mt-9 sm:gap-8 lg:grid-cols-[220px_1fr] lg:gap-12">
          {/* Nav — a pill rail on mobile (no visible scrollbar, faded edges so
              the cut-off pill reads as "swipe for more"), sidebar on desktop. */}
          <nav aria-label="Account" className="lg:sticky lg:top-28 lg:self-start">
            <ul
              className="scrollbar-hide -mx-5 flex snap-x gap-2 overflow-x-auto scroll-px-5 px-5 [mask-image:linear-gradient(to_right,transparent,black_20px,black_calc(100%-20px),transparent)] sm:-mx-10 sm:scroll-px-10 sm:px-10 lg:mx-0 lg:flex-col lg:gap-1.5 lg:overflow-visible lg:scroll-px-0 lg:px-0 lg:[mask-image:none]"
            >
              {NAV.map((item) => {
                // Only the dashboard needs an exact match; the rest own their subtree.
                const active =
                  item.href === '/account'
                    ? pathname === '/account'
                    : pathname.startsWith(item.href);
                return (
                  <li key={item.href} className="shrink-0 snap-start">
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={`flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2.5 font-quantico text-[11px] font-bold uppercase tracking-[0.1em] transition-colors lg:w-full lg:gap-3 lg:rounded-none lg:border-2 lg:px-4 lg:py-3 lg:text-caption lg:tracking-[0.12em] ${
                        active
                          ? 'border-accent bg-accent text-ink'
                          : 'border-paper-200 text-fg-muted hover:border-fg hover:text-fg'
                      }`}
                    >
                      <span className="[&>svg]:h-4 [&>svg]:w-4 lg:[&>svg]:h-[18px] lg:[&>svg]:w-[18px]">{item.icon}</span>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </main>
  );
}
