'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { removeRole } from '@/app/admin/(panel)/roles/actions';

/** Delete confirms once, and refuses outright while anyone still holds the role. */
export default function RoleActions({
  roleId,
  roleName,
  members,
}: {
  roleId: string;
  roleName: string;
  members: number;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState('');
  const [pending, startTransition] = useTransition();

  if (message) {
    return (
      <p role="alert" className="type-b2 flex-1 text-danger">
        {message}
      </p>
    );
  }

  if (confirming) {
    return (
      <span className="flex items-center gap-3">
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const result = await removeRole(roleId);
              if (!result.ok) setMessage(result.message ?? 'Could not delete.');
              else router.refresh();
            })
          }
          className="cursor-pointer whitespace-nowrap font-quantico text-[10px] font-bold uppercase tracking-[0.12em] text-danger hover:opacity-70"
        >
          {pending ? 'Deleting…' : 'Confirm'}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="cursor-pointer font-quantico text-[10px] font-bold uppercase tracking-[0.12em] text-fg-muted hover:text-ink"
        >
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      aria-label={`Delete the ${roleName} role`}
      className="cursor-pointer border border-paper-300 bg-white px-3 py-2.5 font-quantico text-[10px] font-bold uppercase tracking-[0.12em] text-fg-muted transition-colors hover:border-danger hover:text-danger"
    >
      Delete
    </button>
  );
}
