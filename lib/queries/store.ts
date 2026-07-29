import type { CustomerQuery, QueryStatus, QueryTopic } from './types';

/**
 * Query store.
 *
 * IN-MEMORY, ON PURPOSE — this project has no database yet. It holds submitted
 * queries for the life of the server process, which is enough to run the whole
 * storefront → admin flow locally and to review the screens.
 *
 * IT IS NOT PRODUCTION STORAGE. On a serverless host each instance gets its own
 * copy and a restart empties it, so a customer's question could vanish. Before
 * this goes live, swap the four functions below for a table (and ideally have
 * `create` also send a notification email). Nothing outside this file needs to
 * change — the storefront action and every admin screen go through these.
 */

// Survives hot reloads in dev, which would otherwise reset the array on every
// edit and make the panel look like it lost data.
const globalForQueries = globalThis as unknown as { __10xQueries?: CustomerQuery[] };

const SEED: CustomerQuery[] = [
  {
    id: 'qry_004',
    reference: 'Q-1043',
    topic: 'subscription',
    name: 'Kavya Nair',
    email: 'kavya.nair@gmail.com',
    phone: '+91 97440 88213',
    message:
      'I paused my subscription last month while I was travelling. I’m back now — will it restart on its own, or do I need to do something? I don’t want to miss a cycle.',
    status: 'new',
    submittedAt: '2026-07-29T09:41:00+05:30',
  },
  {
    id: 'qry_003',
    reference: 'Q-1042',
    topic: 'product',
    name: 'Arjun Sethi',
    email: 'arjun.sethi@work.co',
    message:
      'Is it safe to take this alongside a morning coffee, or is that doubling up on the caffeine? I usually have one cup around 9am and I don’t want to overdo it.',
    status: 'new',
    submittedAt: '2026-07-28T21:15:00+05:30',
  },
  {
    id: 'qry_002',
    reference: 'Q-1041',
    topic: 'bulk',
    name: 'Priya Deshmukh',
    email: 'priya.desh@gmail.com',
    phone: '+91 90280 61345',
    message:
      'We’re a 40-person studio in Pune and we’d like to keep 10X in the office pantry. Do you do a bulk rate, and can it be billed monthly on a single invoice?',
    status: 'open',
    submittedAt: '2026-07-27T14:02:00+05:30',
  },
  {
    id: 'qry_001',
    reference: 'Q-1040',
    topic: 'order',
    name: 'Vikram Shah',
    email: 'vikram@shahandco.in',
    orderReference: '10X-2048',
    message:
      'Tracking says delivered but nothing arrived at reception. Could you check the AWB and tell me who signed for it?',
    status: 'answered',
    submittedAt: '2026-07-25T11:30:00+05:30',
    answeredAt: '2026-07-25T16:48:00+05:30',
    answeredBy: 'Store Admin',
    reply:
      'Checked with Bluedart — it was signed for by the building’s front desk at 2:10pm on the 24th under the name “Ramesh”. Worth asking there first; if it doesn’t turn up by tomorrow, tell us and we’ll send a replacement at no cost.',
  },
];

function db(): CustomerQuery[] {
  if (!globalForQueries.__10xQueries) {
    globalForQueries.__10xQueries = [...SEED];
  }
  return globalForQueries.__10xQueries;
}

/** Newest first — an inbox reads top-down. */
export function listQueries(
  options: { status?: QueryStatus | 'all'; query?: string } = {},
): CustomerQuery[] {
  const { status = 'all', query } = options;
  const needle = query?.trim().toLowerCase();

  return db()
    .filter((q) => {
      if (status !== 'all' && q.status !== status) return false;
      if (!needle) return true;
      return [q.reference, q.name, q.email, q.message, q.orderReference]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(needle));
    })
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

export function getQuery(id: string): CustomerQuery | undefined {
  return db().find((q) => q.id === id || q.reference.toLowerCase() === id.toLowerCase());
}

export function countByStatus(status: QueryStatus | 'all'): number {
  if (status === 'all') return db().length;
  return db().filter((q) => q.status === status).length;
}

export type NewQuery = {
  topic: QueryTopic;
  name: string;
  email: string;
  phone?: string;
  orderReference?: string;
  message: string;
  /** Injected by the caller so this module stays free of Date.now(). */
  submittedAt: string;
};

export function createQuery(input: NewQuery): CustomerQuery {
  const rows = db();
  // Sequential rather than random so the reference is easy to read out loud.
  const nextNumber =
    rows.reduce((max, q) => Math.max(max, Number(q.reference.replace('Q-', '')) || 0), 1040) + 1;

  const query: CustomerQuery = {
    id: `qry_${String(nextNumber)}`,
    reference: `Q-${nextNumber}`,
    status: 'new',
    ...input,
  };

  rows.unshift(query);
  return query;
}

export function updateQuery(
  id: string,
  changes: Partial<Pick<CustomerQuery, 'status' | 'reply' | 'answeredAt' | 'answeredBy'>>,
): CustomerQuery | undefined {
  const query = getQuery(id);
  if (!query) return undefined;
  Object.assign(query, changes);
  return query;
}
