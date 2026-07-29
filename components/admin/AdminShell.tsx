'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';

import logo from '@/10x-Assets/10xLogo.webp';

/**
 * The panel's frame: an ink rail on the left, a thin status bar on top, and a
 * roomy canvas. The rail collapses behind a drawer below `lg` — an admin on a
 * phone is checking an order, not navigating a tree.
 */

type NavItem = { label: string; href: string; icon: ReactNode };

function Icon({ d }: { d: string }) {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="shrink-0"
    >
      <path d={d} />
    </svg>
  );
}

const NAV: NavItem[] = [
  { label: 'Overview', href: '/admin', icon: <Icon d="M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6v-9h-6v9Zm0-16v5h6V4h-6Z" /> },
  { label: 'Orders', href: '/admin/orders', icon: <Icon d="M5 8h14l-1 12H6L5 8Zm4 0V6a3 3 0 0 1 6 0v2" /> },
  { label: 'Customers', href: '/admin/customers', icon: <Icon d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-8 8a8 8 0 0 1 16 0" /> },
  { label: 'Subscriptions', href: '/admin/subscriptions', icon: <Icon d="M4 12a8 8 0 0 1 13.7-5.6M20 12a8 8 0 0 1-13.7 5.6M17 3v4h-4M7 21v-4h4" /> },
  { label: 'Payments', href: '/admin/payments', icon: <Icon d="M3 8h18M3 8v9a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8M3 8l1-3h16l1 3M7 14h4" /> },
  { label: 'Queries', href: '/admin/queries', icon: <Icon d="M21 12a8 8 0 0 1-11.7 7.1L4 20.5l1.4-5.3A8 8 0 1 1 21 12Z" /> },
];

const SECONDARY: NavItem[] = [
  { label: 'Settings', href: '/admin/settings', icon: <Icon d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8-3a8 8 0 0 0-.2-1.7l2-1.5-2-3.4-2.3 1a8 8 0 0 0-3-1.7L14 2h-4l-.5 2.7a8 8 0 0 0-3 1.7l-2.3-1-2 3.4 2 1.5a8.2 8.2 0 0 0 0 3.4l-2 1.5 2 3.4 2.3-1a8 8 0 0 0 3 1.7L10 22h4l.5-2.7a8 8 0 0 0 3-1.7l2.3 1 2-3.4-2-1.5c.13-.55.2-1.12.2-1.7Z" /> },
];

function isActive(pathname: string, href: string): boolean {
  if (href === '/admin') return pathname === '/admin';
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({
  item,
  pathname,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  onNavigate: () => void;
}) {
  const active = isActive(pathname, item.href);
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={`relative flex cursor-pointer items-center gap-3 px-6 py-2.5 font-quantico text-[11px] font-bold uppercase tracking-[0.14em] transition-colors ${
        active ? 'text-accent' : 'text-white/55 hover:text-white'
      }`}
    >
      {/* The active marker is a green edge, not a filled block — quieter, and it
          keeps the rail reading as one dark surface. */}
      <span
        aria-hidden
        className={`absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 bg-accent transition-opacity ${
          active ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {item.icon}
      {item.label}
    </Link>
  );
}

export default function AdminShell({
  children,
  user,
  signOut,
}: {
  children: ReactNode;
  user: { name: string; email: string };
  signOut: ReactNode;
}) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setDrawerOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const rail = (
    <div className="flex h-full flex-col bg-ink">
      <div className="flex h-16 items-center px-6">
        <Link href="/admin" className="flex cursor-pointer items-center gap-2.5">
          <Image
            src={logo}
            alt="10X"
            width={120}
            height={48}
            priority
            // The mark is knocked out to pure white so it holds on the ink rail
            // whatever colour the source artwork happens to be.
            style={{ filter: 'brightness(0) invert(1)' }}
            className="h-5 w-auto"
          />
          <span className="font-nebula text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">
            Admin
          </span>
        </Link>
      </div>

      <nav aria-label="Admin" className="mt-4 flex flex-1 flex-col">
        <div className="flex flex-col gap-0.5">
          {NAV.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} onNavigate={() => setDrawerOpen(false)} />
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-0.5 border-t border-white/10 pb-4 pt-4">
          {SECONDARY.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} onNavigate={() => setDrawerOpen(false)} />
          ))}
          <Link
            href="/"
            className="flex cursor-pointer items-center gap-3 px-6 py-2.5 font-quantico text-[11px] font-bold uppercase tracking-[0.14em] text-white/55 transition-colors hover:text-white"
          >
            <Icon d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6v6M20 4l-9 9" />
            View store
          </Link>
        </div>
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen bg-paper-50">
      {/* Rail — fixed on desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[236px] lg:block">{rail}</aside>

      {/* Drawer — below lg */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 cursor-pointer bg-ink/40"
          />
          <div className="absolute inset-y-0 left-0 w-[264px]">{rail}</div>
        </div>
      )}

      <div className="lg:pl-[236px]">
        {/* Status bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-paper-200 bg-paper-50/90 px-5 backdrop-blur sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              className="-ml-2 flex h-10 w-10 cursor-pointer items-center justify-center text-ink lg:hidden"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <line x1="3.5" y1="7" x2="20.5" y2="7" />
                <line x1="3.5" y1="12" x2="20.5" y2="12" />
                <line x1="3.5" y1="17" x2="20.5" y2="17" />
              </svg>
            </button>
            <span className="flex items-center gap-2">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#4EA310]" />
              <span className="font-nebula text-[10px] font-bold uppercase tracking-[0.16em] text-fg-muted">
                Shiprocket synced
              </span>
              <span className="type-b2 hidden text-fg-subtle sm:inline">10:05 AM</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-right sm:block">
              <span className="block font-quantico text-[11px] font-bold uppercase tracking-[0.1em] text-ink">
                {user.name}
              </span>
              <span className="block font-nebula text-[10px] tracking-wide text-fg-subtle">
                {user.email}
              </span>
            </span>
            {signOut}
          </div>
        </header>

        <main id="main" className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div className="mx-auto max-w-[1180px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
