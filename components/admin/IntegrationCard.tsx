'use client';

import { useState } from 'react';

import type { Integration } from '@/lib/admin/config';

import { StatusPill, type Signal } from './ui';

/**
 * One connected service: its health, its plain settings, and its secrets.
 *
 * Secrets are masked by default and stay masked unless the role carries
 * `settings.reveal`. The full value is never in the page source — revealing
 * would fetch it from the server, which is also where the access gets logged.
 * That's why the reveal button here says what it would do rather than pretending
 * to have the value already.
 */

const STATUS: Record<Integration['status'], { signal: Signal; label: string }> = {
  connected: { signal: 'good', label: 'Connected' },
  'not-connected': { signal: 'attention', label: 'Not connected' },
  attention: { signal: 'bad', label: 'Needs attention' },
};

export default function IntegrationCard({
  integration,
  canEdit,
  canReveal,
}: {
  integration: Integration;
  canEdit: boolean;
  canReveal: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState(false);

  function toggleReveal(key: string) {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <section className="border border-paper-200 bg-white">
      <header className="flex flex-col gap-4 border-b border-paper-200 p-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="font-quantico text-base font-bold uppercase tracking-[0.06em] text-ink">
              {integration.name}
            </h3>
            <StatusPill {...STATUS[integration.status]} />
            {integration.mode && (
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-nebula text-[9px] font-bold uppercase tracking-[0.12em] ${
                  integration.mode.value === 'live'
                    ? 'bg-ink text-white'
                    : 'border border-paper-200 text-fg-muted'
                }`}
              >
                {integration.mode.label}
              </span>
            )}
          </div>
          <p className="type-b2 mt-2 max-w-lg text-fg-muted">{integration.detail}</p>
          <p className="type-b2 mt-1 text-fg-subtle">{integration.statusDetail}</p>
        </div>

        {canEdit && (
          <button
            type="button"
            onClick={() => {
              setEditing((v) => !v);
              setSaved(false);
            }}
            className="shrink-0 cursor-pointer border border-paper-300 bg-white px-4 py-2.5 font-quantico text-[10px] font-bold uppercase tracking-[0.12em] text-ink transition-colors hover:border-ink"
          >
            {editing ? 'Cancel' : 'Edit'}
          </button>
        )}
      </header>

      <div className="space-y-5 p-6">
        {integration.fields.map((field) => (
          <div key={field.key}>
            <label
              htmlFor={field.key}
              className="mb-2 block font-nebula text-[10px] font-bold uppercase tracking-[0.16em] text-fg-subtle"
            >
              {field.label}
            </label>
            <input
              id={field.key}
              defaultValue={field.value}
              readOnly={!editing}
              className="w-full border border-paper-300 bg-white px-4 py-3 font-pt text-[15px] text-ink outline-none transition-colors focus:border-ink read-only:cursor-default read-only:bg-paper-50 read-only:text-fg-muted"
            />
            {field.hint && <p className="type-b2 mt-1.5 text-fg-subtle">{field.hint}</p>}
          </div>
        ))}

        {integration.secrets.map((secret) => {
          const isRevealed = revealed.has(secret.key);
          return (
            <div key={secret.key}>
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <label
                  htmlFor={secret.key}
                  className="font-nebula text-[10px] font-bold uppercase tracking-[0.16em] text-fg-subtle"
                >
                  {secret.label}
                </label>
                {secret.configured && canReveal && !editing && (
                  <button
                    type="button"
                    onClick={() => toggleReveal(secret.key)}
                    className="cursor-pointer font-quantico text-[10px] font-bold uppercase tracking-[0.1em] text-ink transition-opacity hover:opacity-60"
                  >
                    {isRevealed ? 'Hide' : 'Reveal'}
                  </button>
                )}
              </div>

              <div className="relative">
                <input
                  id={secret.key}
                  type="text"
                  defaultValue={editing ? '' : secret.masked}
                  placeholder={editing ? 'Paste the new value to replace it' : 'Not set'}
                  readOnly={!editing}
                  autoComplete="off"
                  spellCheck={false}
                  className="w-full border border-paper-300 bg-white px-4 py-3 pr-24 font-mono text-[13px] text-ink outline-none transition-colors focus:border-ink read-only:cursor-default read-only:bg-paper-50 read-only:text-fg-muted"
                />
                {!secret.configured && !editing && (
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-nebula text-[9px] font-bold uppercase tracking-[0.12em] text-warning">
                    Missing
                  </span>
                )}
              </div>

              {isRevealed && (
                <p className="type-b2 mt-1.5 text-fg-muted">
                  Revealing fetches the value from the server and records who asked —
                  not wired up yet.
                </p>
              )}
              {secret.hint && !isRevealed && (
                <p className="type-b2 mt-1.5 text-fg-subtle">{secret.hint}</p>
              )}
              {secret.updatedAt && !editing && (
                <p className="type-b2 mt-1 text-fg-subtle">
                  Updated{' '}
                  {new Date(secret.updatedAt).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    timeZone: 'Asia/Kolkata',
                  })}
                </p>
              )}
            </div>
          );
        })}

        {editing && (
          <div className="flex flex-wrap items-center gap-3 border-t border-paper-100 pt-5">
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setSaved(true);
              }}
              className="cursor-pointer bg-ink px-5 py-2.5 font-quantico text-[11px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-ink-900"
            >
              Save {integration.name}
            </button>
            <p className="type-b2 text-fg-subtle">
              A blank secret leaves the stored one alone.
            </p>
          </div>
        )}

        {saved && (
          <p role="status" className="type-b2 text-[#4EA310]">
            Saved in the interface. Persisting this needs the backend.
          </p>
        )}
      </div>
    </section>
  );
}
