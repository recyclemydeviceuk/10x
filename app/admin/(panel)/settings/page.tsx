import Link from 'next/link';

import DatabasePanel from '@/components/admin/DatabasePanel';
import IntegrationCard from '@/components/admin/IntegrationCard';
import { Field, PageHeader, Panel, StatusPill } from '@/components/admin/ui';
import { dateTime } from '@/lib/admin/format';
import { INTEGRATIONS } from '@/lib/admin/config';
import { can } from '@/lib/admin/permissions';
import { getCurrentRole } from '@/lib/admin/session';
import { requireSession } from '@/lib/admin/session';

export const metadata = { title: 'Settings' };

const SECTIONS = [
  { id: 'integrations', label: 'Integrations' },
  { id: 'database', label: 'Database & backups' },
  { id: 'account', label: 'Access' },
];

export default async function SettingsPage() {
  const session = await requireSession();
  const role = await getCurrentRole();

  const canReveal = can(role, 'settings.reveal');
  const notConnected = INTEGRATIONS.filter((i) => i.status !== 'connected');

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        subtitle="Keys, connections and backups. Every change here is gated by a capability — see Roles & team for who can do what."
      />

      {/* Jump bar — the page is long, so give it a spine. */}
      <nav aria-label="Settings sections" className="flex flex-wrap gap-2">
        {SECTIONS.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="cursor-pointer border border-paper-200 bg-white px-4 py-2.5 font-quantico text-[10px] font-bold uppercase tracking-[0.12em] text-ink transition-colors hover:border-ink"
          >
            {section.label}
          </a>
        ))}
      </nav>

      {notConnected.length > 0 && (
        <div className="border-l-2 border-warning bg-white px-5 py-4">
          <p className="font-quantico text-[11px] font-bold uppercase tracking-[0.12em] text-ink">
            {notConnected.length} {notConnected.length === 1 ? 'service needs' : 'services need'} attention
          </p>
          <p className="type-b2 mt-1.5 text-fg-muted">
            {notConnected.map((i) => i.name).join(' · ')}
            {' — '}
            until these are connected, recurring charges and outbound email won&rsquo;t
            work.
          </p>
        </div>
      )}

      {/* Integrations */}
      <section id="integrations" className="scroll-mt-24 space-y-6">
        <div className="flex items-baseline justify-between gap-4 border-b border-paper-200 pb-3">
          <h2 className="font-quantico text-lg font-bold uppercase tracking-[0.04em] text-ink">
            Integrations
          </h2>
          <span className="type-b2 text-fg-subtle">{INTEGRATIONS.length} services</span>
        </div>

        {INTEGRATIONS.map((integration) => (
          <IntegrationCard
            key={integration.key}
            integration={integration}
            canEdit={can(role, integration.editCapability)}
            canReveal={canReveal}
          />
        ))}
      </section>

      {/* Database */}
      <section id="database" className="scroll-mt-24 space-y-6">
        <div className="flex items-baseline justify-between gap-4 border-b border-paper-200 pb-3">
          <h2 className="font-quantico text-lg font-bold uppercase tracking-[0.04em] text-ink">
            Database &amp; backups
          </h2>
          <span className="type-b2 text-fg-subtle">Weekly schedule</span>
        </div>

        {can(role, 'database.view') ? (
          <DatabasePanel
            canEditConnection={can(role, 'database.connection')}
            canSchedule={can(role, 'database.schedule')}
            canRun={can(role, 'database.run')}
            canDownload={can(role, 'database.download')}
            canRestore={can(role, 'database.restore')}
          />
        ) : (
          <Panel>
            <p className="type-b2 text-fg-muted">
              Your role doesn&rsquo;t include database access.
            </p>
          </Panel>
        )}
      </section>

      {/* Access */}
      <section id="account" className="scroll-mt-24 space-y-6">
        <div className="flex items-baseline justify-between gap-4 border-b border-paper-200 pb-3">
          <h2 className="font-quantico text-lg font-bold uppercase tracking-[0.04em] text-ink">
            Access
          </h2>
          <Link
            href="/admin/roles"
            className="cursor-pointer font-quantico text-[10px] font-bold uppercase tracking-[0.12em] text-ink transition-opacity hover:opacity-60"
          >
            Manage roles
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel title="You">
            <dl className="space-y-4">
              <Field label="Name">{session.name}</Field>
              <Field label="Email">{session.email}</Field>
              <Field label="Role">
                <span className="flex items-center gap-2.5">
                  {role?.name ?? 'Unknown'}
                  {session.role === 'owner' && <StatusPill signal="good" label="Super admin" />}
                </span>
              </Field>
              <Field label="Session expires">
                {dateTime(new Date(session.exp * 1000).toISOString())}
              </Field>
            </dl>
          </Panel>

          <Panel title="How access works">
            <ul className="space-y-4">
              {[
                ['Super admin comes from the environment', 'Provisioned by a key on the server, not created in this panel — so a bad role edit can never lock everyone out.'],
                ['Capabilities, not pages', 'Each role is a list of individual actions. Someone can move an order along without ever seeing revenue.'],
                ['Checked on the server', 'Hiding a button is a courtesy. Every action re-checks the capability before it runs.'],
                ['Eight-hour sessions', 'Signed, HTTP-only cookie. Role changes apply on the next page load — nobody has to sign out.'],
              ].map(([title, detail]) => (
                <li key={title} className="border-l-2 border-accent pl-4">
                  <p className="font-quantico text-[11px] font-bold uppercase tracking-[0.1em] text-ink">
                    {title}
                  </p>
                  <p className="type-b2 mt-1 text-fg-muted">{detail}</p>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </section>
    </div>
  );
}
