import Link from 'next/link';

import RoleActions from '@/components/admin/RoleActions';
import TeamTable from '@/components/admin/TeamTable';
import {
  Avatar,
  ButtonLink,
  PageHeader,
  Panel,
  StatusPill,
} from '@/components/admin/ui';
import { fullDate, initials } from '@/lib/admin/format';
import { CAPABILITY_GROUPS, SUPER_ADMIN_ROLE_ID } from '@/lib/admin/permissions';
import { countMembers, listRoles, listTeam } from '@/lib/admin/roles';
import { getCurrentRole } from '@/lib/admin/session';
import { can } from '@/lib/admin/permissions';

export const metadata = { title: 'Roles & team' };

export default async function RolesPage() {
  const role = await getCurrentRole();
  const roles = listRoles();
  const team = listTeam();

  const mayEditRoles = can(role, 'team.roles');
  const mayAssign = can(role, 'team.assign');
  const mayInvite = can(role, 'team.invite');
  const mayRemove = can(role, 'team.remove');

  const totalCapabilities = CAPABILITY_GROUPS.reduce(
    (sum, g) => sum + g.capabilities.length,
    0,
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Roles & team"
        subtitle="Access is granted one action at a time, not one page at a time — so someone can move an order along without ever seeing revenue."
        actions={
          mayEditRoles && (
            <ButtonLink href="/admin/roles/new" tone="primary">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                <path d="M12 5v14M5 12h14" />
              </svg>
              New role
            </ButtonLink>
          )
        }
      />

      {/* Roles */}
      <div className="grid gap-px bg-paper-200 md:grid-cols-2 xl:grid-cols-3">
        {roles.map((r) => {
          const members = countMembers(r.id);
          const isSuper = r.id === SUPER_ADMIN_ROLE_ID;
          const count = isSuper ? totalCapabilities : r.capabilities.length;

          return (
            <article key={r.id} className="flex flex-col bg-white p-6">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-quantico text-base font-bold uppercase tracking-[0.06em] text-ink">
                  {r.name}
                </h2>
                {isSuper ? (
                  <StatusPill signal="good" label="Full access" />
                ) : r.system ? (
                  <StatusPill signal="neutral" label="Built in" />
                ) : (
                  <StatusPill signal="progress" label="Custom" />
                )}
              </div>

              <p className="type-b2 mt-3 flex-1 text-fg-muted">{r.description}</p>

              <dl className="mt-5 flex items-center gap-6 border-t border-paper-100 pt-4">
                <div>
                  <dt className="font-nebula text-[9px] font-bold uppercase tracking-[0.14em] text-fg-subtle">
                    Capabilities
                  </dt>
                  <dd className="mt-1 font-quantico text-sm font-bold text-ink">
                    {count}
                    <span className="text-fg-subtle">/{totalCapabilities}</span>
                  </dd>
                </div>
                <div>
                  <dt className="font-nebula text-[9px] font-bold uppercase tracking-[0.14em] text-fg-subtle">
                    People
                  </dt>
                  <dd className="mt-1 font-quantico text-sm font-bold text-ink">{members}</dd>
                </div>
                <div>
                  <dt className="font-nebula text-[9px] font-bold uppercase tracking-[0.14em] text-fg-subtle">
                    Created
                  </dt>
                  <dd className="type-b2 mt-1 text-fg-muted">{fullDate(r.createdAt)}</dd>
                </div>
              </dl>

              <div className="mt-5 flex items-center gap-2">
                <ButtonLink href={`/admin/roles/${r.id}`} className="flex-1">
                  {isSuper || !mayEditRoles ? 'View' : 'Edit'}
                </ButtonLink>
                {mayEditRoles && !r.system && (
                  <RoleActions roleId={r.id} roleName={r.name} members={members} />
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Team */}
      <Panel
        title="Who has access"
        bodyClassName=""
        action={
          <span className="type-b2 text-fg-subtle">
            {team.length} {team.length === 1 ? 'person' : 'people'}
          </span>
        }
      >
        <TeamTable
          members={team.map((m) => ({
            ...m,
            roleName: roles.find((r) => r.id === m.roleId)?.name ?? 'Unknown',
            avatar: initials(m.name),
            isSuper: m.roleId === SUPER_ADMIN_ROLE_ID,
          }))}
          roles={roles.map((r) => ({ id: r.id, name: r.name }))}
          canAssign={mayAssign}
          canRemove={mayRemove}
          canInvite={mayInvite}
        />
      </Panel>

      <p className="type-b2 max-w-2xl text-fg-subtle">
        Super Admin is provisioned from a key in the server environment, not from
        this screen. It always holds every capability and can&rsquo;t be edited or
        deleted here — that&rsquo;s what guarantees a way back in if a role is
        saved wrong.
      </p>
    </div>
  );
}
