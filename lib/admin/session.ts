import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  signSession,
  verifySession,
  type AdminSession,
} from './auth';

/**
 * Cookie-side of the admin session. Kept apart from `auth.ts` so middleware —
 * which can't touch `next/headers` — pulls in only the crypto.
 */

export async function getSession(): Promise<AdminSession | null> {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value);
}

/**
 * For pages and actions: the session, or a redirect to login. Middleware
 * already gates /admin, but a server action can be invoked directly, so
 * anything that mutates re-checks here rather than trusting the route.
 */
export async function requireSession(): Promise<AdminSession> {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  return session;
}

export async function startSession(session: Omit<AdminSession, 'exp'>): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, await signSession(session), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
