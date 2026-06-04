'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

import { useAuth } from '../../components/AuthContext';

type IconProps = { className?: string };

function GridIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
function BagIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M6 7h12l-1 13H7L6 7Z" /><path d="M9 7a3 3 0 0 1 6 0" />
    </svg>
  );
}
function PinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M12 21s7-6.4 7-11a7 7 0 0 0-14 0c0 4.6 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
function PersonIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}

const NAV = [
  { label: 'Dashboard', href: '/account', Icon: GridIcon },
  { label: 'Orders', href: '/account/orders', Icon: BagIcon },
  { label: 'Addresses', href: '/account/addresses', Icon: PinIcon },
  { label: 'Profile', href: '/account/profile', Icon: PersonIcon },
];

export default function AccountLayout({ children }: { children: ReactNode }) {
  const { isLoggedIn, user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn === false) router.replace('/login?next=/account');
  }, [isLoggedIn, router]);

  if (isLoggedIn !== true) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center pt-16 md:pt-20">
        <p className="font-pt text-body text-fg-muted">Loading your account…</p>
      </div>
    );
  }

  return (
    <main id="main" className="bg-paper-100 pt-16 md:pt-20">
      {/* Header band */}
      <div className="relative overflow-hidden text-white" style={{ background: 'linear-gradient(120deg, #000204 0%, #02063A 40%, #0821D2 100%)' }}>
        <svg viewBox="0 0 48 64" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="pointer-events-none absolute -right-4 top-1/2 h-44 w-32 -translate-y-1/2 text-accent/10">
          <polyline points="6 24 24 8 42 24" /><polyline points="6 40 24 24 42 40" /><polyline points="6 56 24 40 42 56" />
        </svg>
        <div className="relative mx-auto flex max-w-6xl items-center gap-5 px-6 py-10 sm:px-10 md:px-14 md:py-14">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center border-2 border-accent font-condensed text-[1.75rem] font-black italic text-accent">
            {(user?.name?.[0] ?? '1').toUpperCase()}
          </span>
          <div>
            <p className="font-quantico text-caption font-bold uppercase tracking-[0.18em] text-accent">My Account</p>
            <h1 className="mt-1 font-condensed text-[clamp(1.75rem,4vw,2.75rem)] font-black uppercase italic leading-none tracking-tight">
              Hi, {user?.name?.split(' ')[0] || 'there'}
            </h1>
            <p className="mt-1 font-pt text-body-sm text-white/70">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-10 sm:px-10 md:grid-cols-[230px_1fr] md:px-14 md:py-14">
        <aside>
          <nav aria-label="Account" className="flex gap-2 overflow-x-auto md:flex-col md:gap-1.5">
            {NAV.map(({ label, href, Icon }) => {
              const active = href === '/account' ? pathname === '/account' : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex shrink-0 items-center gap-3 border-l-2 px-4 py-3 font-quantico text-body-sm font-bold uppercase tracking-wide transition-colors ${
                    active ? 'border-accent bg-white text-brand-blue' : 'border-transparent text-fg-muted hover:bg-white hover:text-ink'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => { logout(); router.push('/'); }}
              className="flex shrink-0 items-center gap-3 border-l-2 border-transparent px-4 py-3 text-left font-quantico text-body-sm font-bold uppercase tracking-wide text-danger transition-colors hover:bg-white"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign Out
            </button>
          </nav>
        </aside>

        <section className="min-w-0">{children}</section>
      </div>
    </main>
  );
}
