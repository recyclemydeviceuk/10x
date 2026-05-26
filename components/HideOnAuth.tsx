'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

const AUTH_PREFIXES = ['/login', '/register'];

export default function HideOnAuth({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const onAuthRoute = AUTH_PREFIXES.some((p) =>
    pathname === p || pathname?.startsWith(`${p}/`),
  );
  if (onAuthRoute) return null;
  return <>{children}</>;
}
