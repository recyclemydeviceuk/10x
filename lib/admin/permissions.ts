/**
 * The capability catalogue.
 *
 * One switch per action, not per page — so a packer can move an order along
 * without seeing revenue, and a finance role can refund without touching the
 * Shiprocket credentials. Every guarded thing in the panel names a capability
 * from this list; nothing is gated on a role name, because role names change
 * and capabilities don't.
 *
 * Adding a feature means adding its capability here first. That's deliberate:
 * it keeps the roles screen honest, since it renders from this catalogue rather
 * than from a hand-maintained list.
 */

export type CapabilityId = string;

export type Capability = {
  id: CapabilityId;
  label: string;
  /** What granting it actually lets someone do. */
  detail: string;
  /** Destructive or money-moving — flagged in the UI. */
  sensitive?: boolean;
};

export type CapabilityGroup = {
  key: string;
  label: string;
  detail: string;
  /** Nav route this group guards, if any. */
  href?: string;
  capabilities: Capability[];
};

export const CAPABILITY_GROUPS: CapabilityGroup[] = [
  {
    key: 'overview',
    label: 'Overview',
    detail: 'The dashboard and its numbers.',
    href: '/admin',
    capabilities: [
      { id: 'overview.view', label: 'See the dashboard', detail: 'Open the overview at all.' },
      { id: 'overview.revenue', label: 'See revenue figures', detail: 'Money on the tiles and charts. Without it the dashboard shows counts only.' },
    ],
  },
  {
    key: 'orders',
    label: 'Orders',
    detail: 'The order list, detail and fulfilment.',
    href: '/admin/orders',
    capabilities: [
      { id: 'orders.view', label: 'View orders', detail: 'Browse the list and open an order.' },
      { id: 'orders.status', label: 'Change order status', detail: 'Move an order between pending, packed, dispatched and delivered.' },
      { id: 'orders.shiprocket', label: 'Push to Shiprocket', detail: 'Create the shipment and pull the AWB.' },
      { id: 'orders.cancel', label: 'Cancel an order', detail: 'Stop an order before it ships.', sensitive: true },
      { id: 'orders.export', label: 'Export orders', detail: 'Download the list as a file.' },
    ],
  },
  {
    key: 'customers',
    label: 'Customers',
    detail: 'Customer records and their history.',
    href: '/admin/customers',
    capabilities: [
      { id: 'customers.view', label: 'View customers', detail: 'Browse the list and open a profile.' },
      { id: 'customers.contact', label: 'See contact details', detail: 'Email, phone and address. Without it these are masked.' },
      { id: 'customers.edit', label: 'Edit a customer', detail: 'Correct a name, phone or address.' },
      { id: 'customers.delete', label: 'Delete a customer', detail: 'Erase the record and its history.', sensitive: true },
      { id: 'customers.export', label: 'Export customers', detail: 'Download the list as a file.', sensitive: true },
    ],
  },
  {
    key: 'subscriptions',
    label: 'Subscriptions',
    detail: 'Recurring plans and their mandates.',
    href: '/admin/subscriptions',
    capabilities: [
      { id: 'subscriptions.view', label: 'View subscriptions', detail: 'See the list and next charges.' },
      { id: 'subscriptions.skip', label: 'Skip a cycle', detail: 'Push the next charge on by one cycle.' },
      { id: 'subscriptions.pause', label: 'Pause and resume', detail: 'Hold billing without ending the plan.' },
      { id: 'subscriptions.cancel', label: 'Cancel a subscription', detail: 'Revoke the customer’s mandate. Not undoable from here.', sensitive: true },
    ],
  },
  {
    key: 'payments',
    label: 'Payments',
    detail: 'Transactions, receipts and refunds.',
    href: '/admin/payments',
    capabilities: [
      { id: 'payments.view', label: 'View transactions', detail: 'See the payment history.' },
      { id: 'payments.receipt', label: 'Download receipts', detail: 'Generate a customer receipt PDF.' },
      { id: 'payments.refund', label: 'Issue refunds', detail: 'Send money back to a customer.', sensitive: true },
      { id: 'payments.export', label: 'Export transactions', detail: 'Download the ledger as a file.' },
    ],
  },
  {
    key: 'queries',
    label: 'Queries',
    detail: 'Questions sent from the storefront.',
    href: '/admin/queries',
    capabilities: [
      { id: 'queries.view', label: 'View queries', detail: 'Read what customers have asked.' },
      { id: 'queries.reply', label: 'Reply to queries', detail: 'Record an answer and mark it answered.' },
      { id: 'queries.close', label: 'Close and reopen', detail: 'Move a query out of the queue.' },
      { id: 'queries.delete', label: 'Delete a query', detail: 'Remove it entirely.', sensitive: true },
    ],
  },
  {
    key: 'team',
    label: 'Roles & team',
    detail: 'Who has access, and to what.',
    href: '/admin/roles',
    capabilities: [
      { id: 'team.view', label: 'View roles and team', detail: 'See who has access and which role they hold.' },
      { id: 'team.roles', label: 'Create and edit roles', detail: 'Define a role and the capabilities it carries.', sensitive: true },
      { id: 'team.invite', label: 'Invite people', detail: 'Add someone to the panel.', sensitive: true },
      { id: 'team.assign', label: 'Assign roles', detail: 'Change which role a person holds.', sensitive: true },
      { id: 'team.remove', label: 'Remove access', detail: 'Revoke someone’s access entirely.', sensitive: true },
    ],
  },
  {
    key: 'settings',
    label: 'Settings & integrations',
    detail: 'Keys and configuration for connected services.',
    href: '/admin/settings',
    capabilities: [
      { id: 'settings.view', label: 'View settings', detail: 'See the integrations page. Secrets stay masked.' },
      { id: 'settings.reveal', label: 'Reveal secrets', detail: 'Unmask a stored key or token.', sensitive: true },
      { id: 'settings.razorpay', label: 'Edit Razorpay', detail: 'Change the key id, secret and webhook secret.', sensitive: true },
      { id: 'settings.shiprocket', label: 'Edit Shiprocket', detail: 'Change the credentials, channel and pickup location.', sensitive: true },
      { id: 'settings.store', label: 'Edit store details', detail: 'Support email, GST number, dispatch address.' },
    ],
  },
  {
    key: 'database',
    label: 'Database & backups',
    detail: 'The connection and the backup archive.',
    href: '/admin/settings#database',
    capabilities: [
      { id: 'database.view', label: 'View database status', detail: 'Connection health and backup history.' },
      { id: 'database.connection', label: 'Edit the connection', detail: 'Change the MongoDB URI.', sensitive: true },
      { id: 'database.schedule', label: 'Change the backup schedule', detail: 'How often an automatic backup runs.' },
      { id: 'database.run', label: 'Run a backup now', detail: 'Take an on-demand snapshot.' },
      { id: 'database.download', label: 'Download a backup', detail: 'Pull an archive containing every record.', sensitive: true },
      { id: 'database.restore', label: 'Restore from a backup', detail: 'Overwrite live data with an archive.', sensitive: true },
    ],
  },
];

/** Flat list — handy for "grant everything" and for validating stored roles. */
export const ALL_CAPABILITIES: CapabilityId[] = CAPABILITY_GROUPS.flatMap((g) =>
  g.capabilities.map((c) => c.id),
);

export function capabilityById(id: CapabilityId): Capability | undefined {
  for (const group of CAPABILITY_GROUPS) {
    const found = group.capabilities.find((c) => c.id === id);
    if (found) return found;
  }
  return undefined;
}

export function groupForCapability(id: CapabilityId): CapabilityGroup | undefined {
  return CAPABILITY_GROUPS.find((g) => g.capabilities.some((c) => c.id === id));
}

/**
 * Super admin is not a row of checkboxes — it's an escape hatch that always
 * holds everything, so a mis-saved role can never lock everyone out.
 */
export const SUPER_ADMIN_ROLE_ID = 'super-admin';

export function can(
  role: { id: string; capabilities: CapabilityId[] } | null,
  capability: CapabilityId,
): boolean {
  if (!role) return false;
  if (role.id === SUPER_ADMIN_ROLE_ID) return true;
  return role.capabilities.includes(capability);
}

/** True when the role can reach a nav group at all. */
export function canSeeGroup(
  role: { id: string; capabilities: CapabilityId[] } | null,
  group: CapabilityGroup,
): boolean {
  if (!role) return false;
  if (role.id === SUPER_ADMIN_ROLE_ID) return true;
  return group.capabilities.some((c) => role.capabilities.includes(c.id));
}
