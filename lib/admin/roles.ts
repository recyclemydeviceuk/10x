import {
  ALL_CAPABILITIES,
  SUPER_ADMIN_ROLE_ID,
  type CapabilityId,
} from './permissions';

/**
 * Roles and the people holding them.
 *
 * IN-MEMORY like the other stores — this is the UI layer. When the backend
 * lands, these six functions become queries and nothing above them changes.
 *
 * Super admin is seeded, not created in the panel: it comes from a key in the
 * server environment. It can't be edited or deleted here, which is what stops
 * an admin from removing their own last route back in.
 */

export type Role = {
  id: string;
  name: string;
  description: string;
  capabilities: CapabilityId[];
  /** Seeded roles can be edited but not deleted; super admin, neither. */
  system?: boolean;
  createdAt: string;
};

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  roleId: string;
  status: 'active' | 'invited' | 'suspended';
  lastActiveAt: string | null;
  invitedAt: string;
};

const globalForRoles = globalThis as unknown as {
  __10xRoles?: Role[];
  __10xTeam?: TeamMember[];
};

const SEED_ROLES: Role[] = [
  {
    id: SUPER_ADMIN_ROLE_ID,
    name: 'Super Admin',
    description:
      'Everything, always. Created from the key in the server environment — not from this panel, and it can’t be edited or deleted here.',
    capabilities: ALL_CAPABILITIES,
    system: true,
    createdAt: '2026-01-01',
  },
  {
    id: 'operations',
    name: 'Operations',
    description: 'Packs and ships. Moves orders along and talks to Shiprocket, but never sees a key or a refund.',
    capabilities: [
      'overview.view',
      'orders.view',
      'orders.status',
      'orders.shiprocket',
      'orders.export',
      'customers.view',
      'customers.contact',
      'subscriptions.view',
      'queries.view',
    ],
    system: true,
    createdAt: '2026-02-10',
  },
  {
    id: 'support',
    name: 'Support',
    description: 'Answers customers. Reads orders and subscriptions, replies to queries, can skip or pause a plan.',
    capabilities: [
      'overview.view',
      'orders.view',
      'customers.view',
      'customers.contact',
      'subscriptions.view',
      'subscriptions.skip',
      'subscriptions.pause',
      'payments.view',
      'payments.receipt',
      'queries.view',
      'queries.reply',
      'queries.close',
    ],
    system: true,
    createdAt: '2026-02-10',
  },
  {
    id: 'finance',
    name: 'Finance',
    description: 'Owns the money. Sees revenue, issues refunds and exports the ledger; no access to fulfilment or keys.',
    capabilities: [
      'overview.view',
      'overview.revenue',
      'orders.view',
      'customers.view',
      'subscriptions.view',
      'subscriptions.cancel',
      'payments.view',
      'payments.receipt',
      'payments.refund',
      'payments.export',
      'database.view',
    ],
    system: true,
    createdAt: '2026-02-10',
  },
  {
    id: 'read-only',
    name: 'Read only',
    description: 'Can look at everything operational and change nothing. Useful for an accountant or an advisor.',
    capabilities: [
      'overview.view',
      'overview.revenue',
      'orders.view',
      'customers.view',
      'subscriptions.view',
      'payments.view',
      'queries.view',
    ],
    createdAt: '2026-06-18',
  },
];

const SEED_TEAM: TeamMember[] = [
  {
    id: 'usr_01',
    name: 'Store Admin',
    email: 'admin@10xdrink.com',
    roleId: SUPER_ADMIN_ROLE_ID,
    status: 'active',
    lastActiveAt: '2026-07-29T10:05:00+05:30',
    invitedAt: '2026-01-01',
  },
  {
    id: 'usr_02',
    name: 'Rhea Kapoor',
    email: 'rhea@10xdrink.com',
    roleId: 'operations',
    status: 'active',
    lastActiveAt: '2026-07-29T09:12:00+05:30',
    invitedAt: '2026-02-14',
  },
  {
    id: 'usr_03',
    name: 'Imran Qureshi',
    email: 'imran@10xdrink.com',
    roleId: 'support',
    status: 'active',
    lastActiveAt: '2026-07-28T18:40:00+05:30',
    invitedAt: '2026-03-02',
  },
  {
    id: 'usr_04',
    name: 'Devika Menon',
    email: 'devika@10xdrink.com',
    roleId: 'finance',
    status: 'active',
    lastActiveAt: '2026-07-26T11:20:00+05:30',
    invitedAt: '2026-04-19',
  },
  {
    id: 'usr_05',
    name: 'Sanjay Pillai',
    email: 'sanjay@shahandco.in',
    roleId: 'read-only',
    status: 'invited',
    lastActiveAt: null,
    invitedAt: '2026-07-24',
  },
];

function roleDb(): Role[] {
  if (!globalForRoles.__10xRoles) globalForRoles.__10xRoles = SEED_ROLES.map((r) => ({ ...r }));
  return globalForRoles.__10xRoles;
}

function teamDb(): TeamMember[] {
  if (!globalForRoles.__10xTeam) globalForRoles.__10xTeam = SEED_TEAM.map((m) => ({ ...m }));
  return globalForRoles.__10xTeam;
}

/* ----------------------------------------------------------------- roles */

export function listRoles(): Role[] {
  // Super admin first, then everything else by name.
  return [...roleDb()].sort((a, b) => {
    if (a.id === SUPER_ADMIN_ROLE_ID) return -1;
    if (b.id === SUPER_ADMIN_ROLE_ID) return 1;
    return a.name.localeCompare(b.name);
  });
}

export function getRole(id: string): Role | undefined {
  return roleDb().find((r) => r.id === id);
}

export function countMembers(roleId: string): number {
  return teamDb().filter((m) => m.roleId === roleId).length;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
}

export function createRole(input: {
  name: string;
  description: string;
  capabilities: CapabilityId[];
  createdAt: string;
}): Role {
  const base = slugify(input.name) || 'role';
  let id = base;
  let n = 2;
  while (roleDb().some((r) => r.id === id)) id = `${base}-${n++}`;

  const role: Role = {
    id,
    name: input.name.trim(),
    description: input.description.trim(),
    // Drop anything not in the catalogue — a stale id would silently grant nothing.
    capabilities: input.capabilities.filter((c) => ALL_CAPABILITIES.includes(c)),
    createdAt: input.createdAt,
  };
  roleDb().push(role);
  return role;
}

export function updateRole(
  id: string,
  changes: Partial<Pick<Role, 'name' | 'description' | 'capabilities'>>,
): Role | undefined {
  // Super admin holds everything by definition; nothing here may narrow it.
  if (id === SUPER_ADMIN_ROLE_ID) return getRole(id);
  const role = getRole(id);
  if (!role) return undefined;

  if (changes.name !== undefined) role.name = changes.name.trim();
  if (changes.description !== undefined) role.description = changes.description.trim();
  if (changes.capabilities) {
    role.capabilities = changes.capabilities.filter((c) => ALL_CAPABILITIES.includes(c));
  }
  return role;
}

export type DeleteRoleResult =
  | { ok: true }
  | { ok: false; reason: 'system' | 'missing' | 'in-use'; members?: number };

export function deleteRole(id: string): DeleteRoleResult {
  const role = getRole(id);
  if (!role) return { ok: false, reason: 'missing' };
  if (role.system) return { ok: false, reason: 'system' };

  const members = countMembers(id);
  // Deleting a role out from under someone would leave them with no
  // capabilities and no explanation — make it an explicit reassignment first.
  if (members > 0) return { ok: false, reason: 'in-use', members };

  globalForRoles.__10xRoles = roleDb().filter((r) => r.id !== id);
  return { ok: true };
}

/* ------------------------------------------------------------------ team */

export function listTeam(): TeamMember[] {
  return [...teamDb()].sort((a, b) => a.name.localeCompare(b.name));
}

export function assignRole(memberId: string, roleId: string): TeamMember | undefined {
  const member = teamDb().find((m) => m.id === memberId);
  if (!member || !getRole(roleId)) return undefined;
  member.roleId = roleId;
  return member;
}

export function inviteMember(input: {
  name: string;
  email: string;
  roleId: string;
  invitedAt: string;
}): TeamMember {
  const member: TeamMember = {
    id: `usr_${String(teamDb().length + 1).padStart(2, '0')}`,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    roleId: input.roleId,
    status: 'invited',
    lastActiveAt: null,
    invitedAt: input.invitedAt,
  };
  teamDb().push(member);
  return member;
}

export function removeMember(memberId: string): boolean {
  const member = teamDb().find((m) => m.id === memberId);
  // The seeded super admin is the way back in — it can't be removed here.
  if (!member || member.roleId === SUPER_ADMIN_ROLE_ID) return false;
  globalForRoles.__10xTeam = teamDb().filter((m) => m.id !== memberId);
  return true;
}
