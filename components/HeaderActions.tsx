'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import CartButton from './CartButton';
import AccountMenu from './AccountMenu';
import { useAuth } from './AuthContext';

export default function HeaderActions() {
  const { isLoggedIn } = useAuth();
  const pathname = usePathname();
  const next = pathname && pathname !== '/login' && pathname !== '/register'
    ? pathname
    : '/';

  // Avoid hydration mismatch — render a fixed-width placeholder until we know.
  if (isLoggedIn === null) {
    return <div aria-hidden className="h-11 w-24 md:h-12" />;
  }

  if (!isLoggedIn) {
    return (
      <>
        <CartButton />
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
      <CartButton />
      <AccountMenu />
    </>
  );
}
