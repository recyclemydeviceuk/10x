'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import CartButton from './CartButton';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';

function LogoutIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

export default function HeaderActions() {
  const { isLoggedIn, logout, user } = useAuth();
  const { count } = useCart();
  const pathname = usePathname();
  const next = pathname && pathname !== '/login' && pathname !== '/register'
    ? pathname
    : '/';

  // Avoid hydration mismatch — render a fixed-width placeholder until we know
  if (isLoggedIn === null) {
    return <div aria-hidden className="h-11 w-24 md:h-12" />;
  }

  if (!isLoggedIn) {
    return (
      <>
        {count > 0 && <CartButton />}
        <Link
          href={`/login?next=${encodeURIComponent(next)}`}
          className="inline-flex cursor-pointer items-center justify-center border-2 border-accent bg-transparent px-7 py-2.5 font-quantico text-caption font-bold uppercase tracking-[0.18em] text-accent transition-colors hover:bg-accent hover:text-ink md:px-9 md:py-3 md:text-body-sm"
        >
          Login
        </Link>
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={logout}
        aria-label={user ? `Sign out (${user.name})` : 'Sign out'}
        title={user ? `Sign out (${user.name})` : 'Sign out'}
        className="flex h-11 w-11 cursor-pointer items-center justify-center text-white transition-opacity hover:opacity-80 md:h-12 md:w-12"
      >
        <LogoutIcon />
      </button>

      <CartButton />
    </>
  );
}
