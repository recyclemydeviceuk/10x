import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  signSession,
  verifySession,
  type AdminSession,
} from './auth';
import { can, SUPER_ADMIN_ROLE_ID } from './permissions';
import { getRole, type Role } from './roles';

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

/**
 * The signed-in user's role, resolved from the role store.
 *
 * The session cookie carries an id, never a capability list — otherwise
 * changing a role wouldn't take effect until everyone signed out, and a
 * tampered cookie would be a privilege grant.
 */
export async function getCurrentRole(): Promise<Role | null> {
  const session = await getSession();
  if (!session) return null;
  // The env-provisioned owner is always super admin.
  const roleId = session.role === 'owner' ? SUPER_ADMIN_ROLE_ID : session.roleId ?? 'read-only';
  return getRole(roleId) ?? null;
}

/**
 * Guard for anything that mutates. Throws rather than returning false: a
 * caller that forgets to check the result still fails closed.
 */
export async function requireCapability(capability: string): Promise<void> {
  const role = await getCurrentRole();
  if (!can(role, capability)) {
    throw new Error(`Not allowed: ${capability}`);
  }
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
