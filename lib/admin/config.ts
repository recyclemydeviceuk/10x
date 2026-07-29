/**
 * Connected-service configuration and the backup archive.
 *
 * UI LAYER ONLY. Secrets here are placeholders shaped like the real thing so
 * the screens can be built and reviewed; nothing is read by the app and nothing
 * is written anywhere.
 *
 * When the backend lands, three rules matter more than the shape of this file:
 *   1. A secret goes to the browser MASKED. `masked` below is what ships; the
 *      full value is only ever returned by an explicit, capability-checked
 *      reveal — and that reveal should be logged.
 *   2. Writes are capability-checked on the server, never on the strength of a
 *      hidden button.
 *   3. A backup archive contains every customer record. Its download URL must
 *      be short-lived and single-use, not a guessable path.
 */

export type SecretField = {
  key: string;
  label: string;
  /** What actually ships to the browser. */
  masked: string;
  hint?: string;
  /** Whether the value has ever been set. */
  configured: boolean;
  updatedAt?: string;
};

export type PlainField = {
  key: string;
  label: string;
  value: string;
  hint?: string;
};

export type Integration = {
  key: string;
  name: string;
  detail: string;
  status: 'connected' | 'not-connected' | 'attention';
  statusDetail: string;
  /** Capability required to change anything here. */
  editCapability: string;
  mode?: { value: 'test' | 'live'; label: string };
  secrets: SecretField[];
  fields: PlainField[];
  lastCheckedAt?: string;
};

export const INTEGRATIONS: Integration[] = [
  {
    key: 'razorpay',
    name: 'Razorpay',
    detail: 'Takes the payment and holds the recurring mandates.',
    status: 'connected',
    statusDetail: 'Capturing payments normally',
    editCapability: 'settings.razorpay',
    mode: { value: 'live', label: 'Live mode' },
    secrets: [
      { key: 'razorpay.key_id', label: 'Key ID', masked: 'rzp_live_••••••••4Xq2', hint: 'Starts rzp_live_ or rzp_test_', configured: true, updatedAt: '2026-06-02T11:15:00+05:30' },
      { key: 'razorpay.key_secret', label: 'Key secret', masked: '••••••••••••••••••••', hint: 'Shown once by Razorpay — rotate it if it ever leaves the dashboard', configured: true, updatedAt: '2026-06-02T11:15:00+05:30' },
      { key: 'razorpay.webhook_secret', label: 'Webhook secret', masked: '••••••••••••3f1c', hint: 'Verifies that a webhook really came from Razorpay', configured: true, updatedAt: '2026-06-02T11:16:00+05:30' },
    ],
    fields: [
      { key: 'razorpay.webhook_url', label: 'Webhook URL', value: 'https://10xdrink.com/api/webhooks/razorpay', hint: 'Paste this into the Razorpay dashboard' },
    ],
    lastCheckedAt: '2026-07-29T10:18:00+05:30',
  },
  {
    key: 'shiprocket',
    name: 'Shiprocket',
    detail: 'Pushes paid orders and pulls back the AWB and delivery status.',
    status: 'connected',
    statusDetail: 'Last sync completed cleanly',
    editCapability: 'settings.shiprocket',
    secrets: [
      { key: 'shiprocket.password', label: 'API password', masked: '••••••••••••', hint: 'The password for the API user, not your login', configured: true, updatedAt: '2026-05-21T09:40:00+05:30' },
      { key: 'shiprocket.token', label: 'Access token', masked: 'eyJhbGci••••••••', hint: 'Refreshed automatically every 10 days', configured: true, updatedAt: '2026-07-29T10:05:00+05:30' },
    ],
    fields: [
      { key: 'shiprocket.email', label: 'API user email', value: 'ops@10xdrink.com' },
      { key: 'shiprocket.channel_id', label: 'Channel ID', value: '4821990' },
      { key: 'shiprocket.pickup', label: 'Pickup location', value: 'Bengaluru — Dollars Colony', hint: 'Must match a pickup name registered in Shiprocket' },
    ],
    lastCheckedAt: '2026-07-29T10:05:00+05:30',
  },
  {
    key: 'razorpay-subscriptions',
    name: 'Razorpay Subscriptions',
    detail: 'UPI Autopay and e-mandate for the every-4-weeks plan.',
    status: 'not-connected',
    statusDetail: 'Recurring orders cannot be charged yet',
    editCapability: 'settings.razorpay',
    secrets: [
      { key: 'razorpay.plan_id', label: 'Plan ID', masked: '', hint: 'Create the plan in Razorpay, then paste its id', configured: false },
    ],
    fields: [],
  },
  {
    key: 'mail',
    name: 'Email provider',
    detail: 'Sends order confirmations, query replies and sign-in codes.',
    status: 'attention',
    statusDetail: 'Not connected — sign-in codes are not reaching customers',
    editCapability: 'settings.store',
    secrets: [
      { key: 'mail.api_key', label: 'API key', masked: '', configured: false },
    ],
    fields: [
      { key: 'mail.from', label: 'From address', value: 'support@10xdrink.com' },
    ],
  },
];

/* -------------------------------------------------------------- database */

export type BackupSchedule = 'off' | 'daily' | 'weekly' | 'monthly';

export type Backup = {
  id: string;
  takenAt: string;
  /** Bytes. */
  size: number;
  trigger: 'scheduled' | 'manual';
  status: 'complete' | 'running' | 'failed';
  collections: number;
  documents: number;
};

export const DATABASE = {
  provider: 'MongoDB Atlas',
  cluster: 'tenx-prod-0',
  region: 'ap-south-1 · Mumbai',
  status: 'connected' as const,
  uriMasked: 'mongodb+srv://tenx_app:••••••••@tenx-prod-0.••••.mongodb.net/tenx',
  sizeBytes: 42_318_912,
  collections: 9,
  documents: 18_442,
  lastCheckedAt: '2026-07-29T10:20:00+05:30',
};

export const BACKUP_SCHEDULE: {
  frequency: BackupSchedule;
  day: string;
  time: string;
  retention: number;
  nextRunAt: string;
} = {
  frequency: 'weekly',
  day: 'Sunday',
  time: '02:00',
  retention: 8,
  nextRunAt: '2026-08-02T02:00:00+05:30',
};

export const BACKUPS: Backup[] = [
  { id: 'bkp_2026_07_26', takenAt: '2026-07-26T02:00:00+05:30', size: 42_318_912, trigger: 'scheduled', status: 'complete', collections: 9, documents: 18_402 },
  { id: 'bkp_2026_07_19', takenAt: '2026-07-19T02:00:00+05:30', size: 41_902_080, trigger: 'scheduled', status: 'complete', collections: 9, documents: 17_988 },
  { id: 'bkp_2026_07_14', takenAt: '2026-07-14T16:32:00+05:30', size: 41_641_984, trigger: 'manual', status: 'complete', collections: 9, documents: 17_733 },
  { id: 'bkp_2026_07_12', takenAt: '2026-07-12T02:00:00+05:30', size: 41_517_056, trigger: 'scheduled', status: 'complete', collections: 9, documents: 17_640 },
  { id: 'bkp_2026_07_05', takenAt: '2026-07-05T02:00:00+05:30', size: 40_894_464, trigger: 'scheduled', status: 'complete', collections: 9, documents: 17_115 },
];

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB'];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(1)} ${units[unit]}`;
}
