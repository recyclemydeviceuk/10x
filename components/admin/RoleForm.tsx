'use client';

import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';

import { saveRole, type RoleFormState } from '@/app/admin/(panel)/roles/actions';
import type { CapabilityId } from '@/lib/admin/permissions';

import CapabilityMatrix from './CapabilityMatrix';
import { Panel } from './ui';

const FIELD =
  'w-full border border-paper-300 bg-white px-4 py-3 font-pt text-[15px] text-ink outline-none transition-colors placeholder:text-fg-subtle focus:border-ink read-only:cursor-default read-only:bg-paper-50 read-only:text-fg-muted';

function SaveBar({ isNew, readOnly }: { isNew: boolean; readOnly: boolean }) {
  const { pending } = useFormStatus();
  if (readOnly) return null;

  return (
    <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 border-t border-paper-200 bg-white/95 px-6 py-4 backdrop-blur">
      <button
        type="submit"
        disabled={pending}
        className="inline-flex cursor-pointer items-center gap-2 bg-ink px-6 py-3 font-quantico text-[11px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-ink-900 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? 'Saving…' : isNew ? 'Create role' : 'Save changes'}
      </button>
    </div>
  );
}

export default function RoleForm({
  role,
  readOnly,
}: {
  role: { id: string; name: string; description: string; capabilities: CapabilityId[] } | null;
  readOnly: boolean;
}) {
  const router = useRouter();
  const [state, formAction] = useActionState<RoleFormState, FormData>(saveRole, {
    status: 'idle',
  });

  // A new role gets its own URL once it exists, so a refresh doesn't recreate it.
  useEffect(() => {
    if (state.status === 'saved' && !role && state.roleId) {
      router.replace(`/admin/roles/${state.roleId}`);
    }
  }, [state, role, router]);

  return (
    <form action={formAction} className="space-y-6">
      {role && <input type="hidden" name="id" value={role.id} />}

      <Panel title="The role">
        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <label
              htmlFor="role-name"
              className="mb-2 block font-nebula text-[10px] font-bold uppercase tracking-[0.16em] text-fg-subtle"
            >
              Name
            </label>
            <input
              id="role-name"
              name="name"
              required
              readOnly={readOnly}
              defaultValue={role?.name ?? ''}
              placeholder="e.g. Warehouse"
              className={FIELD}
            />
          </div>
          <div>
            <label
              htmlFor="role-description"
              className="mb-2 block font-nebula text-[10px] font-bold uppercase tracking-[0.16em] text-fg-subtle"
            >
              What this role is for
            </label>
            <input
              id="role-description"
              name="description"
              readOnly={readOnly}
              defaultValue={role?.description ?? ''}
              placeholder="One line, so the next person understands it"
              className={FIELD}
            />
          </div>
        </div>

        {state.status === 'error' && (
          <p role="alert" className="mt-4 border-l-2 border-danger bg-paper-50 py-2 pl-3 font-pt text-[14px] text-danger">
            {state.error}
          </p>
        )}
        {state.status === 'saved' && (
          <p role="status" className="mt-4 font-pt text-[14px] text-[#4EA310]">
            Saved. It applies the next time anyone holding it loads a page.
          </p>
        )}
      </Panel>

      <Panel bodyClassName="px-6 pt-6 pb-0">
        <CapabilityMatrix
          defaultSelected={role?.capabilities ?? ['overview.view']}
          readOnly={readOnly}
        />
        <SaveBar isNew={!role} readOnly={readOnly} />
      </Panel>
    </form>
  );
}
