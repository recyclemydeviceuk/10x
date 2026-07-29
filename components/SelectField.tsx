'use client';

import { useEffect, useId, useRef, useState } from 'react';

/**
 * A styled dropdown.
 *
 * A native `<select>` hands its option list to the operating system, which
 * ignores every style you give it — that's why the rows look nothing like the
 * rest of the form. This is the ARIA listbox pattern instead, so the options
 * are ours to design: two lines each, a green rule on the active row, a check
 * on the chosen one.
 *
 * It keeps what the native control gives you for free:
 *   - a real form value (hidden input, so it posts like any other field)
 *   - ↑/↓ to move, Home/End to jump, Enter/Space to choose, Esc to dismiss
 *   - type-ahead — press "s" to jump to "Subscription"
 *   - click-away to close, focus returned to the trigger
 */

export type SelectOption = {
  value: string;
  label: string;
  /** Second line — what this option covers. */
  hint?: string;
};

export default function SelectField({
  name,
  label,
  options,
  placeholder = 'Choose one',
  required,
  defaultValue = '',
  error,
  onValueChange,
}: {
  name: string;
  label: string;
  options: readonly SelectOption[];
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
  error?: string;
  /**
   * Called with the new value. Needed because the hidden input is written by
   * React, which does not fire a native `change` event — a parent listening for
   * one would never hear about a selection.
   */
  onValueChange?: (value: string) => void;
}) {
  const id = useId();
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(() =>
    Math.max(0, options.findIndex((o) => o.value === defaultValue)),
  );

  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeahead = useRef({ text: '', at: 0 });

  const selected = options.find((o) => o.value === value);

  // Close when focus or a click leaves the component.
  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent | TouchEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, [open]);

  // Keep the active option in view when arrowing through a long list.
  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>('[data-active="true"]')?.scrollIntoView({
      block: 'nearest',
    });
  }, [open, active]);

  function choose(index: number) {
    const option = options[index];
    if (!option) return;
    setValue(option.value);
    setActive(index);
    setOpen(false);
    onValueChange?.(option.value);
    buttonRef.current?.focus();
  }

  function onKeyDown(event: React.KeyboardEvent) {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        event.preventDefault();
        if (!open) {
          setOpen(true);
          return;
        }
        const step = event.key === 'ArrowDown' ? 1 : -1;
        setActive((i) => (i + step + options.length) % options.length);
        return;
      }
      case 'Home':
        if (open) {
          event.preventDefault();
          setActive(0);
        }
        return;
      case 'End':
        if (open) {
          event.preventDefault();
          setActive(options.length - 1);
        }
        return;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (open) choose(active);
        else setOpen(true);
        return;
      case 'Escape':
        if (open) {
          event.preventDefault();
          setOpen(false);
        }
        return;
      case 'Tab':
        setOpen(false);
        return;
      default: {
        // Type-ahead: letters typed within a second are treated as one prefix.
        if (event.key.length !== 1 || event.metaKey || event.ctrlKey) return;
        const now = event.timeStamp;
        const text =
          now - typeahead.current.at < 1000
            ? typeahead.current.text + event.key.toLowerCase()
            : event.key.toLowerCase();
        typeahead.current = { text, at: now };

        const match = options.findIndex((o) => o.label.toLowerCase().startsWith(text));
        if (match >= 0) {
          setActive(match);
          if (!open) choose(match);
        }
      }
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <label
        id={`${id}-label`}
        htmlFor={`${id}-button`}
        className="mb-2 block font-nebula text-[10px] font-bold uppercase tracking-[0.16em] text-fg-muted"
      >
        {label}
        {required && <span className="ml-1 text-accent-pressed">*</span>}
      </label>

      {/* The real form value. */}
      <input type="hidden" name={name} value={value} />

      <button
        ref={buttonRef}
        id={`${id}-button`}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-labelledby={`${id}-label ${id}-button`}
        aria-required={required}
        aria-invalid={error ? true : undefined}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        className={`flex w-full cursor-pointer items-center justify-between gap-3 border bg-white px-4 py-3.5 text-left transition-colors ${
          error
            ? 'border-danger'
            : open
              ? 'border-ink'
              : 'border-paper-300 hover:border-fg-muted'
        }`}
      >
        <span className="min-w-0">
          <span
            className={`block truncate font-pt text-[15px] ${
              selected ? 'text-ink' : 'text-fg-subtle'
            }`}
          >
            {selected ? selected.label : placeholder}
          </span>
          {selected?.hint && (
            <span className="mt-0.5 block truncate font-pt text-[13px] text-fg-subtle">
              {selected.hint}
            </span>
          )}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className={`shrink-0 text-fg-muted transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <ul
          ref={listRef}
          id={`${id}-list`}
          role="listbox"
          aria-labelledby={`${id}-label`}
          tabIndex={-1}
          className="absolute z-30 mt-1 max-h-[19rem] w-full overflow-y-auto border border-ink bg-white shadow-elevated"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === active;
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                data-active={isActive}
                onMouseEnter={() => setActive(index)}
                onClick={() => choose(index)}
                className={`relative cursor-pointer border-b border-paper-100 px-4 py-3 pl-5 last:border-b-0 ${
                  isActive ? 'bg-paper-50' : 'bg-white'
                }`}
              >
                {/* Green edge marks the active row — the same language as the
                    admin rail, and it survives a hover-less touch device. */}
                <span
                  aria-hidden
                  className={`absolute inset-y-0 left-0 w-[3px] bg-accent transition-opacity ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                />
                <span className="flex items-start justify-between gap-3">
                  <span className="min-w-0">
                    <span className="block font-pt text-[15px] font-bold text-ink">
                      {option.label}
                    </span>
                    {option.hint && (
                      <span className="mt-0.5 block font-pt text-[13px] leading-snug text-fg-muted">
                        {option.hint}
                      </span>
                    )}
                  </span>
                  {isSelected && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                      className="mt-1 shrink-0 text-accent-pressed"
                    >
                      <path d="M5 12.5 10 17.5 19 7" />
                    </svg>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {error && (
        <p className="mt-2 font-pt text-[13px] text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
