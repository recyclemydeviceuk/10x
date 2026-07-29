import Link from 'next/link';
import { notFound } from 'next/navigation';

import RoleForm from '@/components/admin/RoleForm';
import { PageHeader, StatusPill } from '@/components/admin/ui';
import { can, SUPER_ADMIN_ROLE_ID } from '@/lib/admin/permissions';
import { countMembers, getRole } from '@/lib/admin/roles';
import { getCurrentRole } from '@/lib/admin/session';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id === 'new') return { title: 'New role' };
  const role = getRole(id);
  return { title: role ? role.name : 'Role' };
}

export default async function RoleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const current = await getCurrentRole();
  const mayEdit = can(current, 'team.roles');

  const isNew = id === 'new';
  const role = isNew ? undefined : getRole(id);
  if (!isNew && !role) notFound();

  const isSuper = role?.id === SUPER_ADMIN_ROLE_ID;
  const members = role ? countMembers(role.id) : 0;

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/roles"
          className="inline-flex cursor-pointer items-center gap-1.5 font-quantico text-[10px] font-bold uppercase tracking-[0.14em] text-fg-muted transition-colors hover:text-ink"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Roles &amp; team
        </Link>

        <div className="mt-4">
          <PageHeader
            title={isNew ? 'New role' : (role?.name ?? 'Role')}
            subtitle={
              isSuper
                ? 'Provisioned from the server environment. It holds every capability, including any added later, and can’t be narrowed here.'
                : isNew
                  ? 'Grant only what the job needs. You can widen it later without anyone signing out.'
                  : `${members} ${members === 1 ? 'person holds' : 'people hold'} this role. Changes apply the next time they load a page.`
            }
            actions={
              isSuper ? (
                <StatusPill signal="good" label="Full access" />
              ) : !mayEdit ? (
                <StatusPill signal="neutral" label="Read only" />
              ) : undefined
            }
          />
        </div>
      </div>

      <RoleForm
        role={
          role
            ? {
                id: role.id,
                name: role.name,
                description: role.description,
                capabilities: role.capabilities,
              }
            : null
        }
        readOnly={isSuper || !mayEdit}
      />
    </div>
  );
}
