'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { useAuth } from './AuthContext';

function PersonIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export default function AccountMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex cursor-pointer items-center gap-1 px-2 py-2 font-quantico text-body-sm font-bold uppercase tracking-[0.12em] text-white transition-colors hover:text-accent md:px-2.5"
      >
        <PersonIcon />
        <span className="hidden max-w-[14ch] truncate sm:inline">Hi, {firstName}</span>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-60 overflow-hidden border border-paper-200 bg-white text-ink shadow-elevated"
        >
          <div className="border-b border-paper-200 px-4 py-3">
            <p className="font-quantico text-body-sm font-bold uppercase tracking-wide text-ink">
              {user?.name}
            </p>
            {user?.email && (
              <p className="mt-0.5 truncate font-pt text-caption text-fg-muted">{user.email}</p>
            )}
          </div>
          <ul className="py-1">
            {[
              { label: 'My Account', href: '/account' },
              { label: 'Orders', href: '/account/orders' },
              { label: 'Addresses', href: '/account/addresses' },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  role="menuitem"
                  className="block px-4 py-2.5 font-pt text-body-sm text-fg transition-colors hover:bg-paper-100 hover:text-brand-blue"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              logout();
              setOpen(false);
              router.push('/');
            }}
            className="block w-full border-t border-paper-200 px-4 py-3 text-left font-quantico text-caption font-bold uppercase tracking-wider text-danger transition-colors hover:bg-paper-100"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
