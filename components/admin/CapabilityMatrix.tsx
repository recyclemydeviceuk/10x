'use client';

import { useMemo, useState } from 'react';
import { useFormStatus } from 'react-dom';

import { CAPABILITY_GROUPS, type CapabilityId } from '@/lib/admin/permissions';

/**
 * The capability editor.
 *
 * One switch per action, grouped by the part of the panel it governs, with a
 * per-group "everything" control because granting a section is the common case
 * and ticking six boxes to do it is a chore.
 *
 * Sensitive capabilities — refunds, deletions, key edits, backup downloads —
 * are marked, so the person building a role sees what they're handing over
 * without having to know the system.
 */
export default function CapabilityMatrix({
  name = 'capabilities',
  defaultSelected = [],
  readOnly = false,
}: {
  name?: string;
  defaultSelected?: CapabilityId[];
  readOnly?: boolean;
}) {
  const [selected, setSelected] = useState<Set<CapabilityId>>(
    () => new Set(defaultSelected),
  );
  const { pending } = useFormStatus();
  const disabled = readOnly || pending;

  const total = useMemo(
    () => CAPABILITY_GROUPS.reduce((sum, g) => sum + g.capabilities.length, 0),
    [],
  );

  function toggle(id: CapabilityId) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleGroup(groupKey: string, on: boolean) {
    const group = CAPABILITY_GROUPS.find((g) => g.key === groupKey);
    if (!group) return;
    setSelected((prev) => {
      const next = new Set(prev);
      for (const c of group.capabilities) {
        if (on) next.add(c.id);
        else next.delete(c.id);
      }
      return next;
    });
  }

  return (
    <div>
      {/* Real form values — the switches are buttons, so the state posts here. */}
      {[...selected].map((id) => (
        <input key={id} type="hidden" name={name} value={id} />
      ))}

      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-paper-200 pb-4">
        <p className="font-nebula text-[10px] font-bold uppercase tracking-[0.16em] text-fg-subtle">
          Capabilities
        </p>
        <p className="type-b2 text-fg-muted">
          <span className="font-quantico font-bold text-ink">{selected.size}</span> of {total}{' '}
          granted
        </p>
      </div>

      <div className="divide-y divide-paper-100">
        {CAPABILITY_GROUPS.map((group) => {
          const granted = group.capabilities.filter((c) => selected.has(c.id)).length;
          const all = granted === group.capabilities.length;

          return (
            <section key={group.key} className="py-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-quantico text-[13px] font-bold uppercase tracking-[0.1em] text-ink">
                    {group.label}
                  </h3>
                  <p className="type-b2 mt-1 max-w-md text-fg-muted">{group.detail}</p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span className="type-b2 whitespace-nowrap text-fg-subtle">
                    {granted}/{group.capabilities.length}
                  </span>
                  {!disabled && (
                    <button
                      type="button"
                      onClick={() => toggleGroup(group.key, !all)}
                      className="cursor-pointer whitespace-nowrap border border-paper-300 bg-white px-3 py-1.5 font-quantico text-[10px] font-bold uppercase tracking-[0.1em] text-ink transition-colors hover:border-ink"
                    >
                      {all ? 'Clear all' : 'Grant all'}
                    </button>
                  )}
                </div>
              </div>

              <ul className="mt-4 space-y-1">
                {group.capabilities.map((capability) => {
                  const on = selected.has(capability.id);
                  return (
                    <li key={capability.id}>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={on}
                        disabled={disabled}
                        onClick={() => toggle(capability.id)}
                        className={`flex w-full items-start gap-3.5 border px-4 py-3 text-left transition-colors ${
                          on ? 'border-ink bg-paper-50' : 'border-paper-200 bg-white'
                        } ${disabled ? 'cursor-default opacity-80' : 'cursor-pointer hover:border-ink'}`}
                      >
                        {/* Track + knob. Reads as on/off without relying on colour. */}
                        <span
                          aria-hidden
                          className={`mt-0.5 flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors ${
                            on ? 'bg-[#4EA310]' : 'bg-paper-300'
                          }`}
                        >
                          <span
                            className={`h-4 w-4 rounded-full bg-white transition-transform ${
                              on ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="type-b2 font-bold text-ink">{capability.label}</span>
                            {capability.sensitive && (
                              <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-paper-200 px-2 py-0.5 font-nebula text-[9px] font-bold uppercase tracking-[0.12em] text-fg-muted">
                                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-warning" />
                                Sensitive
                              </span>
                            )}
                          </span>
                          <span className="type-b2 mt-0.5 block text-fg-muted">
                            {capability.detail}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
