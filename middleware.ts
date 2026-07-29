import { NextResponse, type NextRequest } from 'next/server';

import { SESSION_COOKIE, verifySession } from '@/lib/admin/auth';

/**
 * Gate for the admin panel. Everything under /admin needs a valid signed
 * session except the login page itself; an expired or forged cookie is
 * indistinguishable from no cookie at all.
 */
export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);
  const isLoginRoute = pathname === '/admin/login';

  if (isLoginRoute) {
    // Already signed in? Don't make them log in twice.
    if (session) return NextResponse.redirect(new URL('/admin', request.url));
    return NextResponse.next();
  }

  if (!session) {
    const login = new URL('/admin/login', request.url);
    // Send them back where they were headed once they're in.
    if (pathname !== '/admin') login.searchParams.set('next', `${pathname}${search}`);
    const response = NextResponse.redirect(login);
    // Clear the stale cookie so the browser stops sending it.
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
