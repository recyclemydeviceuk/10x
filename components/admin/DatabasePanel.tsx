'use client';

import { useState } from 'react';

import {
  BACKUPS,
  BACKUP_SCHEDULE,
  DATABASE,
  formatBytes,
  type BackupSchedule,
} from '@/lib/admin/config';

import { StatusPill, Table, Td, Th } from './ui';

/**
 * The database connection and the backup archive.
 *
 * A backup here contains every customer record, so downloading one is treated
 * as a sensitive action: it needs its own capability, and in the real build the
 * link should be short-lived and single-use rather than a guessable path.
 */

const FREQUENCIES: { value: BackupSchedule; label: string; detail: string }[] = [
  { value: 'off', label: 'Off', detail: 'No automatic backups — manual only' },
  { value: 'daily', label: 'Daily', detail: 'Every night at the chosen time' },
  { value: 'weekly', label: 'Weekly', detail: 'Once a week — the usual choice' },
  { value: 'monthly', label: 'Monthly', detail: 'First of the month' },
];

export default function DatabasePanel({
  canEditConnection,
  canSchedule,
  canRun,
  canDownload,
  canRestore,
}: {
  canEditConnection: boolean;
  canSchedule: boolean;
  canRun: boolean;
  canDownload: boolean;
  canRestore: boolean;
}) {
  const [editingUri, setEditingUri] = useState(false);
  const [frequency, setFrequency] = useState<BackupSchedule>(BACKUP_SCHEDULE.frequency);
  const [running, setRunning] = useState(false);
  const [ranAt, setRanAt] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Connection */}
      <section className="border border-paper-200 bg-white">
        <header className="flex flex-col gap-4 border-b border-paper-200 p-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-quantico text-base font-bold uppercase tracking-[0.06em] text-ink">
                {DATABASE.provider}
              </h3>
              <StatusPill signal="good" label="Connected" />
            </div>
            <p className="type-b2 mt-2 text-fg-muted">
              {DATABASE.cluster} · {DATABASE.region}
            </p>
          </div>

          {canEditConnection && (
            <button
              type="button"
              onClick={() => setEditingUri((v) => !v)}
              className="shrink-0 cursor-pointer border border-paper-300 bg-white px-4 py-2.5 font-quantico text-[10px] font-bold uppercase tracking-[0.12em] text-ink transition-colors hover:border-ink"
            >
              {editingUri ? 'Cancel' : 'Edit connection'}
            </button>
          )}
        </header>

        <div className="grid gap-px bg-paper-200 sm:grid-cols-3">
          {[
            { label: 'Size on disk', value: formatBytes(DATABASE.sizeBytes) },
            { label: 'Collections', value: String(DATABASE.collections) },
            { label: 'Documents', value: DATABASE.documents.toLocaleString('en-IN') },
          ].map((stat) => (
            <div key={stat.label} className="bg-white p-6">
              <p className="font-nebula text-[10px] font-bold uppercase tracking-[0.16em] text-fg-subtle">
                {stat.label}
              </p>
              <p className="mt-2 font-quantico text-xl font-bold italic text-ink">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-paper-200 p-6">
          <label
            htmlFor="mongo-uri"
            className="mb-2 block font-nebula text-[10px] font-bold uppercase tracking-[0.16em] text-fg-subtle"
          >
            Connection string
          </label>
          <input
            id="mongo-uri"
            type="text"
            autoComplete="off"
            spellCheck={false}
            defaultValue={editingUri ? '' : DATABASE.uriMasked}
            placeholder={editingUri ? 'mongodb+srv://user:password@cluster/db' : ''}
            readOnly={!editingUri}
            className="w-full border border-paper-300 bg-white px-4 py-3 font-mono text-[13px] text-ink outline-none transition-colors focus:border-ink read-only:cursor-default read-only:bg-paper-50 read-only:text-fg-muted"
          />
          <p className="type-b2 mt-1.5 text-fg-subtle">
            The password is masked here and never sent to the browser in full.
          </p>

          {editingUri && (
            <button
              type="button"
              onClick={() => setEditingUri(false)}
              className="mt-4 cursor-pointer bg-ink px-5 py-2.5 font-quantico text-[11px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-ink-900"
            >
              Test &amp; save connection
            </button>
          )}
        </div>
      </section>

      {/* Schedule */}
      <section className="border border-paper-200 bg-white">
        <header className="border-b border-paper-200 p-6">
          <h3 className="font-quantico text-base font-bold uppercase tracking-[0.06em] text-ink">
            Automatic backups
          </h3>
          <p className="type-b2 mt-2 max-w-lg text-fg-muted">
            Runs on the server and keeps the last {BACKUP_SCHEDULE.retention} archives.
            Next run {new Date(BACKUP_SCHEDULE.nextRunAt).toLocaleString('en-IN', {
              day: '2-digit',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
              timeZone: 'Asia/Kolkata',
            })}.
          </p>
        </header>

        <div className="p-6">
          <fieldset disabled={!canSchedule}>
            <legend className="sr-only">Backup frequency</legend>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {FREQUENCIES.map((option) => {
                const active = frequency === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setFrequency(option.value)}
                    className={`border px-4 py-3.5 text-left transition-colors ${
                      active ? 'border-ink bg-paper-50' : 'border-paper-200 bg-white'
                    } ${canSchedule ? 'cursor-pointer hover:border-ink' : 'cursor-default opacity-70'}`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        aria-hidden
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                          active ? 'border-accent bg-accent' : 'border-paper-300'
                        }`}
                      >
                        {active && <span className="h-1.5 w-1.5 rounded-full bg-ink" />}
                      </span>
                      <span className="font-quantico text-[11px] font-bold uppercase tracking-[0.1em] text-ink">
                        {option.label}
                      </span>
                    </span>
                    <span className="type-b2 mt-1.5 block pl-6.5 text-fg-muted">
                      {option.detail}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-paper-100 pt-5">
            {canRun && (
              <button
                type="button"
                disabled={running}
                onClick={() => {
                  setRunning(true);
                  setTimeout(() => {
                    setRunning(false);
                    setRanAt(new Date().toISOString());
                  }, 1200);
                }}
                className="inline-flex cursor-pointer items-center gap-2 bg-ink px-5 py-2.5 font-quantico text-[11px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-ink-900 disabled:opacity-60"
              >
                {running ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Backing up…
                  </>
                ) : (
                  'Back up now'
                )}
              </button>
            )}
            {ranAt && (
              <p role="status" className="type-b2 text-[#4EA310]">
                Snapshot requested. The real job runs on the server.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Archive */}
      <section className="border border-paper-200 bg-white">
        <header className="flex items-center justify-between gap-4 border-b border-paper-200 px-6 py-4">
          <h3 className="type-k text-fg-muted">Backup archive</h3>
          <span className="type-b2 text-fg-subtle">Last {BACKUPS.length}</span>
        </header>

        <Table>
          <thead>
            <tr>
              <Th>Taken</Th>
              <Th>Trigger</Th>
              <Th>Contents</Th>
              <Th align="right">Size</Th>
              <Th align="right">Archive</Th>
            </tr>
          </thead>
          <tbody>
            {BACKUPS.map((backup) => (
              <tr key={backup.id} className="transition-colors hover:bg-paper-50">
                <Td>
                  <span className="block whitespace-nowrap">
                    <span className="type-b2 block text-ink">
                      {new Date(backup.takenAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        timeZone: 'Asia/Kolkata',
                      })}
                    </span>
                    <span className="type-b2 block text-fg-subtle">
                      {new Date(backup.takenAt).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                        timeZone: 'Asia/Kolkata',
                      })}
                    </span>
                  </span>
                </Td>
                <Td>
                  <span className="type-b2 capitalize text-fg-muted">{backup.trigger}</span>
                </Td>
                <Td>
                  <span className="type-b2 whitespace-nowrap text-fg-muted">
                    {backup.collections} collections · {backup.documents.toLocaleString('en-IN')} docs
                  </span>
                </Td>
                <Td align="right">
                  <span className="font-quantico text-[13px] font-bold text-ink">
                    {formatBytes(backup.size)}
                  </span>
                </Td>
                <Td align="right">
                  <span className="flex items-center justify-end gap-4">
                    {canDownload ? (
                      <button
                        type="button"
                        className="inline-flex cursor-pointer items-center gap-1.5 font-quantico text-[10px] font-bold uppercase tracking-[0.12em] text-ink transition-opacity hover:opacity-60"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="M12 3v12M7 11l5 5 5-5M5 21h14" />
                        </svg>
                        Download
                      </button>
                    ) : (
                      <span className="type-b2 text-fg-subtle">Restricted</span>
                    )}
                    {canRestore && (
                      <button
                        type="button"
                        className="cursor-pointer font-quantico text-[10px] font-bold uppercase tracking-[0.12em] text-fg-muted transition-colors hover:text-danger"
                      >
                        Restore
                      </button>
                    )}
                  </span>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>

        <p className="type-b2 border-t border-paper-200 px-6 py-4 text-fg-subtle">
          An archive holds every customer record. Downloads should expire on first
          use once this is wired to the backend, and every download should be
          attributable to a person.
        </p>
      </section>
    </div>
  );
}
