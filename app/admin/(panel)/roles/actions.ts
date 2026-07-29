'use server';

import { revalidatePath } from 'next/cache';

import { requireCapability } from '@/lib/admin/session';
import {
  assignRole,
  createRole,
  deleteRole,
  inviteMember,
  removeMember,
  updateRole,
} from '@/lib/admin/roles';

export type RoleFormState = { status: 'idle' | 'error' | 'saved'; error?: string; roleId?: string };

function capabilitiesFrom(formData: FormData): string[] {
  return formData.getAll('capabilities').map(String);
}

export async function saveRole(
  _state: RoleFormState,
  formData: FormData,
): Promise<RoleFormState> {
  await requireCapability('team.roles');

  const id = String(formData.get('id') ?? '');
  const name = String(formData.get('name') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const capabilities = capabilitiesFrom(formData);

  if (name.length < 2) return { status: 'error', error: 'Give the role a name.' };
  if (capabilities.length === 0) {
    return {
      status: 'error',
      error: 'A role with no capabilities can sign in and see nothing — grant at least one.',
    };
  }

  if (id) {
    updateRole(id, { name, description, capabilities });
    revalidatePath('/admin/roles');
    revalidatePath(`/admin/roles/${id}`);
    return { status: 'saved', roleId: id };
  }

  const role = createRole({
    name,
    description,
    capabilities,
    createdAt: new Date().toISOString().slice(0, 10),
  });
  revalidatePath('/admin/roles');
  return { status: 'saved', roleId: role.id };
}

export async function removeRole(id: string): Promise<{ ok: boolean; message?: string }> {
  await requireCapability('team.roles');
  const result = deleteRole(id);

  if (result.ok) {
    revalidatePath('/admin/roles');
    return { ok: true };
  }

  const message =
    result.reason === 'system'
      ? 'Built-in roles can’t be deleted.'
      : result.reason === 'in-use'
        ? `${result.members} ${result.members === 1 ? 'person holds' : 'people hold'} this role. Move them first.`
        : 'That role no longer exists.';
  return { ok: false, message };
}

export async function setMemberRole(memberId: string, roleId: string): Promise<void> {
  await requireCapability('team.assign');
  assignRole(memberId, roleId);
  revalidatePath('/admin/roles');
}

export async function invite(
  _state: RoleFormState,
  formData: FormData,
): Promise<RoleFormState> {
  await requireCapability('team.invite');

  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const roleId = String(formData.get('roleId') ?? '');

  if (name.length < 2) return { status: 'error', error: 'Who are you inviting?' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { status: 'error', error: 'That doesn’t look like an email address.' };
  }
  if (!roleId) return { status: 'error', error: 'Pick a role for them.' };

  inviteMember({ name, email, roleId, invitedAt: new Date().toISOString().slice(0, 10) });
  revalidatePath('/admin/roles');
  return { status: 'saved' };
}

export async function revokeMember(memberId: string): Promise<void> {
  await requireCapability('team.remove');
  removeMember(memberId);
  revalidatePath('/admin/roles');
}
