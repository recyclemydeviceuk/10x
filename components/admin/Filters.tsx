'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Filters live in the URL, not in component state — so a filtered view can be
 * bookmarked, shared with a colleague, and survives a refresh.
 */

export function SearchField({ placeholder }: { placeholder: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [value, setValue] = useState(params.get('q') ?? '');

  // Keep in step when the URL changes from elsewhere (a tab click, back button).
  useEffect(() => {
    setValue(params.get('q') ?? '');
  }, [params]);

  useEffect(() => {
    const current = params.get('q') ?? '';
    if (value === current) return;

    const timer = setTimeout(() => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set('q', value);
      else next.delete('q');
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    }, 250);

    return () => clearTimeout(timer);
  }, [value, params, pathname, router]);

  return (
    <div className="relative w-full sm:w-72">
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-subtle"
      >
        <circle cx="11" cy="11" r="7" />
        <line x1="16.5" y1="16.5" x2="21" y2="21" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full border border-paper-300 bg-white py-2.5 pl-10 pr-3 font-pt text-[14px] text-ink outline-none transition-colors placeholder:text-fg-subtle focus:border-ink"
      />
    </div>
  );
}

export function FilterTabs({
  param = 'status',
  options,
}: {
  param?: string;
  options: { value: string; label: string; count?: number }[];
}) {
  const pathname = usePathname();
  const params = useSearchParams();
  const active = params.get(param) ?? options[0].value;

  return (
    <div className="-mx-1 flex flex-wrap items-center gap-1 overflow-x-auto">
      {options.map((option) => {
        const next = new URLSearchParams(params.toString());
        if (option.value === options[0].value) next.delete(param);
        else next.set(param, option.value);
        const isActive = active === option.value;

        return (
          <Link
            key={option.value}
            href={`${pathname}${next.toString() ? `?${next}` : ''}`}
            scroll={false}
            aria-current={isActive ? 'true' : undefined}
            className={`inline-flex cursor-pointer items-center gap-2 whitespace-nowrap border px-3.5 py-2 font-quantico text-[10px] font-bold uppercase tracking-[0.12em] transition-colors ${
              isActive
                ? 'border-ink bg-ink text-white'
                : 'border-paper-200 bg-white text-fg-muted hover:border-ink hover:text-ink'
            }`}
          >
            {option.label}
            {typeof option.count === 'number' && (
              <span className={isActive ? 'text-white/50' : 'text-fg-subtle'}>{option.count}</span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
