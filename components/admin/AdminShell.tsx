'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';

import logo from '@/10x-Assets/10xLogo.webp';

/**
 * The panel's frame.
 *
 * A solid ink rail — no gradients, no translucency — with the active item as a
 * solid green block. Nav is grouped under quiet section labels so nine
 * destinations still read as three ideas, and each item is filtered by the
 * capabilities the signed-in role actually holds.
 */

type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
  /** Hidden unless the role holds at least one of these. */
  any: string[];
  badge?: number;
};

type NavSection = { label: string; items: NavItem[] };

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

function buildNav(queryCount: number): NavSection[] {
  return [
    {
      label: 'Trade',
      items: [
        { label: 'Overview', href: '/admin', any: ['overview.view'], icon: <Icon d="M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6v-9h-6v9Zm0-16v5h6V4h-6Z" /> },
        { label: 'Orders', href: '/admin/orders', any: ['orders.view'], icon: <Icon d="M5 8h14l-1 12H6L5 8Zm4 0V6a3 3 0 0 1 6 0v2" /> },
        { label: 'Payments', href: '/admin/payments', any: ['payments.view'], icon: <Icon d="M3 8h18M3 8v9a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8M3 8l1-3h16l1 3M7 14h4" /> },
      ],
    },
    {
      label: 'People',
      items: [
        { label: 'Customers', href: '/admin/customers', any: ['customers.view'], icon: <Icon d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-8 8a8 8 0 0 1 16 0" /> },
        { label: 'Subscriptions', href: '/admin/subscriptions', any: ['subscriptions.view'], icon: <Icon d="M4 12a8 8 0 0 1 13.7-5.6M20 12a8 8 0 0 1-13.7 5.6M17 3v4h-4M7 21v-4h4" /> },
        { label: 'Queries', href: '/admin/queries', any: ['queries.view'], badge: queryCount, icon: <Icon d="M21 12a8 8 0 0 1-11.7 7.1L4 20.5l1.4-5.3A8 8 0 1 1 21 12Z" /> },
      ],
    },
    {
      label: 'Control',
      items: [
        { label: 'Roles & team', href: '/admin/roles', any: ['team.view'], icon: <Icon d="M16 20v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 9v-1a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /> },
        { label: 'Settings', href: '/admin/settings', any: ['settings.view', 'database.view'], icon: <Icon d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8-3a8 8 0 0 0-.2-1.7l2-1.5-2-3.4-2.3 1a8 8 0 0 0-3-1.7L14 2h-4l-.5 2.7a8 8 0 0 0-3 1.7l-2.3-1-2 3.4 2 1.5a8.2 8.2 0 0 0 0 3.4l-2 1.5 2 3.4 2.3-1a8 8 0 0 0 3 1.7L10 22h4l.5-2.7a8 8 0 0 0 3-1.7l2.3 1 2-3.4-2-1.5c.13-.55.2-1.12.2-1.7Z" /> },
      ],
    },
  ];
}

function isActive(pathname: string, href: string): boolean {
  if (href === '/admin') return pathname === '/admin';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminShell({
  children,
  user,
  roleName,
  capabilities,
  isSuperAdmin,
  queryCount = 0,
  signOut,
}: {
  children: ReactNode;
  user: { name: string; email: string };
  roleName: string;
  capabilities: string[];
  isSuperAdmin: boolean;
  queryCount?: number;
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

  const held = new Set(capabilities);
  const sections = buildNav(queryCount)
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) => isSuperAdmin || item.any.some((c) => held.has(c)),
      ),
    }))
    .filter((section) => section.items.length > 0);

  const rail = (
    <div className="flex h-full flex-col bg-ink">
      {/* Brand */}
      <div className="flex h-[72px] shrink-0 items-center gap-3 border-b border-white/10 px-6">
        <Link href="/admin" className="flex cursor-pointer items-center gap-3">
          <Image
            src={logo}
            alt="10X"
            width={120}
            height={48}
            priority
            // Knocked out to pure white so the mark holds on the ink rail.
            style={{ filter: 'brightness(0) invert(1)' }}
            className="h-5 w-auto"
          />
          <span className="border-l border-white/20 pl-3 font-nebula text-[9px] font-bold uppercase tracking-[0.22em] text-white/45">
            Admin
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav aria-label="Admin" className="flex-1 overflow-y-auto py-6">
        {sections.map((section) => (
          <div key={section.label} className="mb-7 last:mb-0">
            <p className="px-6 pb-2.5 font-nebula text-[9px] font-bold uppercase tracking-[0.22em] text-white/30">
              {section.label}
            </p>
            <ul className="space-y-0.5 px-3">
              {section.items.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setDrawerOpen(false)}
                      aria-current={active ? 'page' : undefined}
                      className={`flex cursor-pointer items-center gap-3 px-3 py-2.5 font-quantico text-[11px] font-bold uppercase tracking-[0.13em] transition-colors ${
                        active
                          ? 'bg-accent text-ink'
                          : 'text-white/60 hover:bg-white/[0.07] hover:text-white'
                      }`}
                    >
                      {item.icon}
                      <span className="flex-1">{item.label}</span>
                      {item.badge ? (
                        <span
                          className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 font-quantico text-[10px] font-bold ${
                            active ? 'bg-ink text-accent' : 'bg-accent text-ink'
                          }`}
                        >
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Who you are */}
      <div className="shrink-0 border-t border-white/10 p-3">
        <div className="flex items-center gap-3 px-3 py-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 font-quantico text-[10px] font-bold text-white">
            {user.name
              .split(' ')
              .slice(0, 2)
              .map((p) => p[0])
              .join('')}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-quantico text-[11px] font-bold uppercase tracking-[0.08em] text-white">
              {user.name}
            </span>
            <span className="block truncate font-nebula text-[10px] tracking-wide text-accent">
              {roleName}
            </span>
          </span>
        </div>

        <Link
          href="/"
          className="mt-1 flex cursor-pointer items-center gap-3 px-3 py-2.5 font-quantico text-[11px] font-bold uppercase tracking-[0.13em] text-white/50 transition-colors hover:bg-white/[0.07] hover:text-white"
        >
          <Icon d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6v6M20 4l-9 9" />
          View store
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-paper-50">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] lg:block">{rail}</aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 cursor-pointer bg-ink/50"
          />
          <div className="absolute inset-y-0 left-0 w-[272px]">{rail}</div>
        </div>
      )}

      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between gap-4 border-b border-paper-200 bg-white px-5 sm:px-8 lg:px-10">
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

            <span className="flex items-center gap-2.5 border border-paper-200 px-3 py-1.5">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#4EA310]" />
              <span className="font-nebula text-[10px] font-bold uppercase tracking-[0.16em] text-ink">
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
                {roleName}
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
