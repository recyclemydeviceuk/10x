import type { ReactNode } from 'react';

import { Sparkline } from './charts';

/**
 * A headline number. The numeral is the one place the panel uses the brand's
 * display italic — same role it plays in the food equation on the storefront:
 * the hook you read first.
 */
export default function StatTile({
  label,
  value,
  delta,
  footnote,
  href,
  spark,
}: {
  label: string;
  value: string;
  /** Percent change vs the previous period. null when there's no baseline. */
  delta?: number | null;
  footnote?: ReactNode;
  href?: string;
  /** Optional trend behind the number. Decorative — the value states the fact. */
  spark?: number[];
}) {
  const body = (
    <>
      <p className="font-nebula text-[10px] font-bold uppercase tracking-[0.16em] text-fg-subtle">
        {label}
      </p>
      <p className="mt-3 font-quantico text-[2rem] font-bold italic leading-none tracking-tight text-ink">
        {value}
      </p>
      <div className="mt-3 flex items-center gap-2">
        {typeof delta === 'number' && (
          <span
            className={`inline-flex items-center gap-1 font-quantico text-[11px] font-bold ${
              delta >= 0 ? 'text-[#4EA310]' : 'text-danger'
            }`}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              {delta >= 0 ? <polyline points="5 15 12 8 19 15" /> : <polyline points="5 9 12 16 19 9" />}
            </svg>
            {Math.abs(delta)}%
          </span>
        )}
        {footnote && <span className="type-b2 text-fg-muted">{footnote}</span>}
      </div>
      {spark && spark.length > 1 && <Sparkline data={spark} className="mt-4" />}
    </>
  );

  const className =
    'block border border-paper-200 bg-white p-6 transition-colors' +
    (href ? ' cursor-pointer hover:border-ink' : '');

  if (href) {
    return (
      <a href={href} className={className}>
        {body}
      </a>
    );
  }
  return <div className={className}>{body}</div>;
}
