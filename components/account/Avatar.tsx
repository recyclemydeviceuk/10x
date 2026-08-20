'use client';

import { initialsOf } from '@/lib/store/avatar';

/**
 * Profile picture, or the customer's initials when there isn't one.
 *
 * Plain <img>: the source is a data URL, so Next's optimiser has nothing to
 * do and would only add a round trip.
 */
export default function Avatar({
  name,
  src,
  size = 'md',
  className = '',
}: {
  name: string;
  src?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const box =
    size === 'lg' ? 'h-24 w-24 text-2xl' : size === 'sm' ? 'h-9 w-9 text-[11px]' : 'h-12 w-12 text-sm';

  return (
    <span
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-paper-200 font-quantico font-bold uppercase tracking-wide text-fg-muted ${box} ${className}`}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        <span aria-hidden>{initialsOf(name)}</span>
      )}
    </span>
  );
}
