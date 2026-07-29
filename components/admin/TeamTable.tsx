'use client';

import { useState, useTransition } from 'react';

import { invite, revokeMember, setMemberRole, type RoleFormState } from '@/app/admin/(panel)/roles/actions';
import { useActionState } from 'react';

import { Avatar, EmptyState, StatusPill, Table, Td, Th } from './ui';

type Member = {
  id: string;
  name: string;
  email: string;
  roleId: string;
  roleName: string;
  avatar: string;
  status: 'active' | 'invited' | 'suspended';
  lastActiveAt: string | null;
  isSuper: boolean;
};

const STATUS = {
  active: { signal: 'good' as const, label: 'Active' },
  invited: { signal: 'attention' as const, label: 'Invited' },
  suspended: { signal: 'bad' as const, label: 'Suspended' },
};

export default function TeamTable({
  members,
  roles,
  canAssign,
  canRemove,
  canInvite,
}: {
  members: Member[];
  roles: { id: string; name: string }[];
  canAssign: boolean;
  canRemove: boolean;
  canInvite: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState<string | null>(null);
  const [inviting, setInviting] = useState(false);
  const [state, formAction] = useActionState<RoleFormState, FormData>(invite, {
    status: 'idle',
  });

  if (members.length === 0) return <EmptyState title="Nobody has access yet" />;

  return (
    <div>
      <Table>
        <thead>
          <tr>
            <Th>Person</Th>
            <Th>Role</Th>
            <Th>Status</Th>
            <Th>Last active</Th>
            <Th align="right">Actions</Th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id} className="transition-colors hover:bg-paper-50">
              <Td className="max-w-[260px]">
                <span className="flex items-center gap-3">
                  <Avatar initials={member.avatar} />
                  <span className="min-w-0">
                    <span className="type-b2 block truncate font-bold text-ink">
                      {member.name}
                    </span>
                    <span className="type-b2 block truncate text-fg-subtle">{member.email}</span>
                  </span>
                </span>
              </Td>
              <Td>
                {canAssign && !member.isSuper ? (
                  <select
                    aria-label={`Role for ${member.name}`}
                    defaultValue={member.roleId}
                    disabled={pending}
                    onChange={(e) => {
                      const roleId = e.target.value;
                      startTransition(async () => {
                        await setMemberRole(member.id, roleId);
                      });
                    }}
                    className="cursor-pointer border border-paper-300 bg-white px-3 py-2 font-quantico text-[11px] font-bold uppercase tracking-[0.1em] text-ink outline-none transition-colors focus:border-ink"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="font-quantico text-[11px] font-bold uppercase tracking-[0.1em] text-ink">
                    {member.roleName}
                  </span>
                )}
              </Td>
              <Td>
                <StatusPill {...STATUS[member.status]} />
              </Td>
              <Td>
                <span className="type-b2 whitespace-nowrap text-fg-muted">
                  {member.lastActiveAt
                    ? new Date(member.lastActiveAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        timeZone: 'Asia/Kolkata',
                      })
                    : 'Never'}
                </span>
              </Td>
              <Td align="right">
                {member.isSuper ? (
                  <span className="type-b2 text-fg-subtle">Protected</span>
                ) : !canRemove ? (
                  <span className="type-b2 text-fg-subtle">—</span>
                ) : confirming === member.id ? (
                  <span className="flex items-center justify-end gap-3">
                    <span className="type-b2 whitespace-nowrap text-fg-muted">Revoke?</span>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() =>
                        startTransition(async () => {
                          await revokeMember(member.id);
                          setConfirming(null);
                        })
                      }
                      className="cursor-pointer font-quantico text-[10px] font-bold uppercase tracking-[0.12em] text-danger hover:opacity-70"
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirming(null)}
                      className="cursor-pointer font-quantico text-[10px] font-bold uppercase tracking-[0.12em] text-fg-muted hover:text-ink"
                    >
                      No
                    </button>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirming(member.id)}
                    className="cursor-pointer font-quantico text-[10px] font-bold uppercase tracking-[0.12em] text-fg-muted transition-colors hover:text-danger"
                  >
                    Remove
                  </button>
                )}
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {canInvite && (
        <div className="border-t border-paper-200 p-6">
          {inviting ? (
            <form action={formAction} className="grid gap-4 sm:grid-cols-[1fr_1fr_auto_auto]">
              <input
                name="name"
                placeholder="Full name"
                required
                aria-label="Full name"
                className="border border-paper-300 bg-white px-4 py-2.5 font-pt text-[14px] text-ink outline-none transition-colors focus:border-ink"
              />
              <input
                name="email"
                type="email"
                placeholder="name@10xdrink.com"
                required
                aria-label="Email"
                className="border border-paper-300 bg-white px-4 py-2.5 font-pt text-[14px] text-ink outline-none transition-colors focus:border-ink"
              />
              <select
                name="roleId"
                aria-label="Role"
                defaultValue={roles.find((r) => r.id !== 'super-admin')?.id}
                className="cursor-pointer border border-paper-300 bg-white px-3 py-2.5 font-quantico text-[11px] font-bold uppercase tracking-[0.1em] text-ink outline-none transition-colors focus:border-ink"
              >
                {roles
                  .filter((r) => r.id !== 'super-admin')
                  .map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
              </select>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="cursor-pointer bg-ink px-4 py-2.5 font-quantico text-[10px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-ink-900"
                >
                  Send invite
                </button>
                <button
                  type="button"
                  onClick={() => setInviting(false)}
                  className="cursor-pointer border border-paper-300 px-4 py-2.5 font-quantico text-[10px] font-bold uppercase tracking-[0.12em] text-ink transition-colors hover:border-ink"
                >
                  Cancel
                </button>
              </div>

              {state.status === 'error' && (
                <p role="alert" className="type-b2 text-danger sm:col-span-4">
                  {state.error}
                </p>
              )}
              {state.status === 'saved' && (
                <p role="status" className="type-b2 text-[#4EA310] sm:col-span-4">
                  Invite recorded. They&rsquo;ll get an email once a mail provider is connected.
                </p>
              )}
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setInviting(true)}
              className="inline-flex cursor-pointer items-center gap-2 border border-paper-300 bg-white px-4 py-2.5 font-quantico text-[10px] font-bold uppercase tracking-[0.12em] text-ink transition-colors hover:border-ink"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                <path d="M12 5v14M5 12h14" />
              </svg>
              Invite someone
            </button>
          )}
        </div>
      )}
    </div>
  );
}
