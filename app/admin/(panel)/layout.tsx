import type { Metadata } from 'next';

import AdminShell from '@/components/admin/AdminShell';
import { SUPER_ADMIN_ROLE_ID } from '@/lib/admin/permissions';
import { getCurrentRole, requireSession } from '@/lib/admin/session';
import { countByStatus } from '@/lib/queries/store';

import { logout } from '../actions';

export const metadata: Metadata = {
  // `template` here replaces the storefront's "%s | 10X" for everything in the panel.
  title: { default: '10X Admin', template: '%s — 10X Admin' },
  robots: { index: false, follow: false },
};

/**
 * Everything behind the login lives in this group. `/admin/login` sits outside
 * it so the sign-in screen doesn't render the rail it hasn't earned yet.
 */
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  // Middleware already gated this route; re-reading here gives the shell the
  // signed-in user and keeps the page honest if the matcher ever changes.
  const session = await requireSession();
  const role = await getCurrentRole();
  const waiting = countByStatus('new');

  return (
    <AdminShell
      user={{ name: session.name, email: session.email }}
      roleName={role?.name ?? 'No role'}
      capabilities={role?.capabilities ?? []}
      isSuperAdmin={role?.id === SUPER_ADMIN_ROLE_ID}
      queryCount={waiting}
      signOut={
        <form action={logout}>
          <button
            type="submit"
            className="flex h-9 cursor-pointer items-center gap-2 border border-paper-300 bg-white px-3 font-quantico text-[10px] font-bold uppercase tracking-[0.12em] text-ink transition-colors hover:border-ink"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M15 17l5-5-5-5M20 12H9M13 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7" />
            </svg>
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </form>
      }
    >
      {children}
    </AdminShell>
  );
}
