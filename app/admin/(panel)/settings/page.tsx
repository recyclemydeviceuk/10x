import { Field, PageHeader, Panel, StatusPill } from '@/components/admin/ui';
import { requireSession } from '@/lib/admin/session';
import { dateTime } from '@/lib/admin/format';

export const metadata = { title: 'Settings' };

const INTEGRATIONS = [
  {
    name: 'Shiprocket',
    detail: 'Pushes paid orders, pulls AWB numbers and delivery status.',
    connected: true,
    account: 'ops@10xdrink.com',
    lastSync: '2026-07-29T10:05:00+05:30',
  },
  {
    name: 'Razorpay',
    detail: 'Captures payments and holds the recurring mandates.',
    connected: true,
    account: 'acc_QjX10XFormulas',
    lastSync: '2026-07-29T10:18:00+05:30',
  },
  {
    name: 'Razorpay Subscriptions',
    detail: 'UPI Autopay / e-mandate for the every-4-weeks plan.',
    connected: false,
    account: null,
    lastSync: null,
  },
];

export default async function SettingsPage() {
  const session = await requireSession();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        subtitle="Connections and access. Everything else lives with the thing it belongs to."
      />

      <Panel title="Integrations" bodyClassName="">
        <ul className="divide-y divide-paper-100">
          {INTEGRATIONS.map((integration) => (
            <li
              key={integration.name}
              className="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-quantico text-sm font-bold uppercase tracking-[0.08em] text-ink">
                    {integration.name}
                  </h3>
                  <StatusPill
                    signal={integration.connected ? 'good' : 'attention'}
                    label={integration.connected ? 'Connected' : 'Not connected'}
                  />
                </div>
                <p className="type-b2 mt-1.5 max-w-md text-fg-muted">{integration.detail}</p>
                {integration.account && (
                  <p className="type-b2 mt-1 text-fg-subtle">
                    {integration.account}
                    {integration.lastSync && <> · last sync {dateTime(integration.lastSync)}</>}
                  </p>
                )}
              </div>

              <button
                type="button"
                className="shrink-0 cursor-pointer border border-paper-300 bg-white px-4 py-2.5 font-quantico text-[10px] font-bold uppercase tracking-[0.12em] text-ink transition-colors hover:border-ink"
              >
                {integration.connected ? 'Sync now' : 'Connect'}
              </button>
            </li>
          ))}
        </ul>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Your account">
          <dl className="space-y-4">
            <Field label="Name">{session.name}</Field>
            <Field label="Email">{session.email}</Field>
            <Field label="Role">
              <span className="capitalize">{session.role}</span>
            </Field>
            <Field label="Session expires">{dateTime(new Date(session.exp * 1000).toISOString())}</Field>
          </dl>
        </Panel>

        <Panel title="Access">
          <p className="type-b2 text-fg-muted">
            Admin credentials are held in environment variables, not in the database —
            there is no sign-up, no password reset, and no way to escalate from the
            storefront into this panel.
          </p>
          <dl className="mt-5 space-y-4 border-t border-paper-100 pt-5">
            <Field label="Sign-in">Email and password</Field>
            <Field label="Session length">8 hours, then re-authenticate</Field>
            <Field label="Cookie">HTTP-only, SameSite=Lax, signed</Field>
          </dl>
        </Panel>
      </div>
    </div>
  );
}
