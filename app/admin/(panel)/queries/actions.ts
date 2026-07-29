'use server';

import { revalidatePath } from 'next/cache';

import { requireSession } from '@/lib/admin/session';
import { updateQuery } from '@/lib/queries/store';
import type { QueryStatus } from '@/lib/queries/types';

export type ReplyState = { status: 'idle' | 'error' | 'saved'; error?: string };

/**
 * Records the reply against the query and marks it answered.
 *
 * NOTE: this does not email the customer yet — there's no mail provider wired
 * up. Until there is, whoever answers here still has to send the actual email.
 */
export async function replyToQuery(
  _state: ReplyState,
  formData: FormData,
): Promise<ReplyState> {
  const session = await requireSession();

  const id = String(formData.get('id') ?? '');
  const reply = String(formData.get('reply') ?? '').trim();

  if (reply.length < 10) {
    return { status: 'error', error: 'Write a little more before saving.' };
  }

  const updated = updateQuery(id, {
    reply,
    status: 'answered',
    answeredAt: new Date().toISOString(),
    answeredBy: session.name,
  });

  if (!updated) return { status: 'error', error: 'That query no longer exists.' };

  revalidatePath('/admin/queries');
  revalidatePath(`/admin/queries/${id}`);
  return { status: 'saved' };
}

export async function setQueryStatus(id: string, status: QueryStatus): Promise<void> {
  await requireSession();
  updateQuery(id, { status });
  revalidatePath('/admin/queries');
  revalidatePath(`/admin/queries/${id}`);
}
