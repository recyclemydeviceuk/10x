import type { ReactNode } from 'react';

/**
 * The panel's chart set.
 *
 * Colour rules, applied throughout:
 *   - Magnitude is carried by LENGTH, so bars are one colour. Identity comes
 *     from the axis label beside the bar, never from a hue — which is why
 *     there's no categorical palette here and no legend on single-series charts.
 *   - Ink (#000204) is the data colour. #4EA310 marks the one thing worth
 *     looking at (today, the current step, the leading slice). The brand's
 *     #6DE325 is NOT used as a fill: it measures 1.62:1 on this surface and
 *     disappears. #4EA310 clears 3:1.
 *   - Where two series share a plot they are ink vs #4EA310 (ΔE 58 normal,
 *     58 deutan) AND separately labelled, so identity never rests on colour.
 *   - Tracks and grid are paper tones — recessive by construction.
 */

export const INK = '#000204';
export const LEAF = '#4EA310';

/**
 * EVERY formatted value a chart prints goes through this.
 *
 * `format` callbacks return things like "₹43.7K", and PT Sans Caption — the
 * face behind type-b1/b2 — draws ₹ as a peso (₱). The font *has* the glyph, so
 * no fallback ordering can rescue it. Quantico lacks it and falls through to a
 * clean ₹. Printing a value in any other face is a bug waiting to happen, so
 * charts never do it directly.
 */
function Amount({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={`font-quantico ${className}`}>{children}</span>;
}

/* ------------------------------------------------------------ scaffolding */

export function ChartFrame({
  title,
  hint,
  children,
  footer,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <figure className="m-0 flex h-full flex-col">
      {/* Title and hint share one scale so a long title can't out-shout its
          own caption when it wraps. */}
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="font-nebula text-[10px] font-bold uppercase tracking-[0.16em] text-ink">
          {title}
        </span>
        {hint && (
          <span className="shrink-0 font-nebula text-[10px] uppercase tracking-[0.12em] text-fg-subtle">
            {hint}
          </span>
        )}
      </figcaption>
      <div className="mt-5 flex-1">{children}</div>
      {footer && <div className="mt-4">{footer}</div>}
    </figure>
  );
}

/** Screen-reader equivalent for any chart. Cheap, and it's the table view. */
function DataTable({
  caption,
  rows,
  valueLabel = 'Value',
}: {
  caption: string;
  rows: { label: string; value: string }[];
  valueLabel?: string;
}) {
  return (
    <table className="sr-only">
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th scope="col">Item</th>
          <th scope="col">{valueLabel}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label}>
            <th scope="row">{row.label}</th>
            <td>{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ------------------------------------------------------------- bar list */

/**
 * Ranked horizontal bars. The workhorse: any "which of these is biggest"
 * question. Labels sit above the bar so long city names never get clipped.
 */
export function BarList({
  data,
  format,
  highlightFirst = true,
}: {
  data: { label: string; value: number }[];
  format: (value: number) => string;
  highlightFirst?: boolean;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <>
      <ul className="space-y-3.5">
        {data.map((row, i) => (
          <li key={row.label} className="group">
            <div className="flex items-baseline justify-between gap-3">
              <span className="type-b2 truncate capitalize text-ink">{row.label}</span>
              <span className="shrink-0 font-quantico text-[12px] font-bold text-ink">
                {format(row.value)}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 w-full bg-paper-100">
              <div
                className="h-full rounded-r-[2px] transition-[width] duration-500"
                style={{
                  width: `${Math.max(2, (row.value / max) * 100)}%`,
                  background: highlightFirst && i === 0 ? LEAF : INK,
                }}
              />
            </div>
          </li>
        ))}
      </ul>
      <DataTable
        caption="Ranked values"
        rows={data.map((d) => ({ label: d.label, value: format(d.value) }))}
      />
    </>
  );
}

/* ---------------------------------------------------------------- funnel */

/** Each step as a share of the first, so drop-off is the visible thing. */
export function Funnel({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  const top = Math.max(...data.map((d) => d.value), 1);

  return (
    <>
      <ul className="space-y-3">
        {data.map((step, i) => {
          const share = (step.value / top) * 100;
          const previous = i > 0 ? data[i - 1].value : step.value;
          const dropped = previous - step.value;
          return (
            <li key={step.label}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="type-b2 text-ink">{step.label}</span>
                <span className="flex items-baseline gap-2">
                  {dropped > 0 && (
                    <span className="type-b2 text-fg-subtle">−{dropped}</span>
                  )}
                  <span className="font-quantico text-[12px] font-bold text-ink">
                    {step.value}
                  </span>
                </span>
              </div>
              <div className="mt-1.5 h-7 w-full bg-paper-100">
                <div
                  className="flex h-full items-center justify-end pr-2 transition-[width] duration-500"
                  style={{
                    width: `${Math.max(6, share)}%`,
                    background: i === data.length - 1 ? LEAF : INK,
                  }}
                >
                  <span className="font-quantico text-[10px] font-bold text-white">
                    {Math.round(share)}%
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <DataTable
        caption="Fulfilment funnel"
        rows={data.map((d) => ({ label: d.label, value: String(d.value) }))}
      />
    </>
  );
}

/* ------------------------------------------------------------- share bar */

/** Two-part split. Both parts are labelled, so the colours are a shortcut. */
export function ShareBar({
  data,
  format,
}: {
  data: { label: string; value: number }[];
  format: (value: number) => string;
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;

  return (
    <>
      {/* 2px gap between fills, per the mark spec. */}
      <div className="flex h-9 w-full gap-0.5 overflow-hidden">
        {data.map((slice, i) => (
          <div
            key={slice.label}
            className="h-full transition-[width] duration-500"
            style={{
              width: `${(slice.value / total) * 100}%`,
              background: i === 0 ? INK : LEAF,
            }}
          />
        ))}
      </div>

      <ul className="mt-4 space-y-2.5">
        {data.map((slice, i) => (
          <li key={slice.label} className="flex items-center justify-between gap-3">
            <span className="flex min-w-0 items-center gap-2.5">
              <span
                aria-hidden
                className="h-2.5 w-2.5 shrink-0"
                style={{ background: i === 0 ? INK : LEAF }}
              />
              <span className="type-b2 truncate text-ink">{slice.label}</span>
            </span>
            <span className="flex shrink-0 items-baseline gap-2">
              <span className="type-b2 text-fg-subtle">
                {Math.round((slice.value / total) * 100)}%
              </span>
              <span className="font-quantico text-[12px] font-bold text-ink">
                {format(slice.value)}
              </span>
            </span>
          </li>
        ))}
      </ul>
      <DataTable
        caption="Split"
        rows={data.map((d) => ({ label: d.label, value: format(d.value) }))}
      />
    </>
  );
}

/* ------------------------------------------------------------------ ring */

/** A single share, not a pie — one number, drawn so it reads at a glance. */
export function Ring({
  percent,
  label,
  caption,
}: {
  percent: number;
  label: string;
  caption?: string;
}) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const filled = (Math.min(100, Math.max(0, percent)) / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width="132" height="132" viewBox="0 0 132 132" role="img" aria-label={`${label}: ${percent}%`}>
          <circle cx="66" cy="66" r={radius} fill="none" stroke="#F4F5F7" strokeWidth="12" />
          <circle
            cx="66"
            cy="66"
            r={radius}
            fill="none"
            stroke={LEAF}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${filled} ${circumference - filled}`}
            // Start at 12 o'clock rather than 3.
            transform="rotate(-90 66 66)"
          />
        </svg>
        <span className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-quantico text-2xl font-bold italic leading-none text-ink">
            {percent}%
          </span>
        </span>
      </div>
      {caption && <p className="type-b2 mt-3 text-center text-fg-muted">{caption}</p>}
    </div>
  );
}

/* ------------------------------------------------------------- area line */

/**
 * A trend line with a soft fill. Points are marked only at the ends and the
 * peak — a dot on every reading is noise at this size.
 */
export function AreaLine({
  data,
  format,
  height = 150,
}: {
  data: { date: string; value: number }[];
  format: (value: number) => string;
  height?: number;
}) {
  const width = 520;
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const span = max - min || 1;
  const stepX = width / Math.max(1, data.length - 1);

  const points = data.map((d, i) => ({
    ...d,
    x: i * stepX,
    // 12pt of head-room so the peak marker isn't clipped.
    y: height - 12 - ((d.value - min) / span) * (height - 28),
  }));

  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const area = `${line} L${width} ${height} L0 ${height} Z`;
  const peak = points.reduce((best, p) => (p.value > best.value ? p : best), points[0]);
  const last = points[points.length - 1];

  return (
    <>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full overflow-visible"
        preserveAspectRatio="none"
        role="img"
        aria-label="Trend"
      >
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={INK} stopOpacity="0.14" />
            <stop offset="100%" stopColor={INK} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#areaFill)" />
        <path
          d={line}
          fill="none"
          stroke={INK}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {/* Peak and latest get a marker; nothing else does. */}
        <circle cx={peak.x} cy={peak.y} r="4" fill="white" stroke={INK} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        <circle cx={last.x} cy={last.y} r="5" fill={LEAF} stroke="white" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>

      <div className="mt-3 flex items-baseline justify-between">
        <Amount className="text-[11px] font-bold uppercase tracking-[0.1em] text-fg-subtle">
          Peak {format(max)}
        </Amount>
        <Amount className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#4EA310]">
          Now {format(last.value)}
        </Amount>
      </div>

      <DataTable
        caption="Trend by day"
        rows={data.map((d) => ({ label: d.date, value: format(d.value) }))}
      />
    </>
  );
}

/* ------------------------------------------------------------- sparkline */

/** Tiny trend for a stat tile. Decorative — the tile states the number. */
export function Sparkline({ data, className = '' }: { data: number[]; className?: string }) {
  const width = 100;
  const height = 28;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const span = max - min || 1;
  const stepX = width / Math.max(1, data.length - 1);

  const line = data
    .map((v, i) => `${i === 0 ? 'M' : 'L'}${(i * stepX).toFixed(1)} ${(height - ((v - min) / span) * height).toFixed(1)}`)
    .join(' ');

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`h-7 w-full ${className}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      <path d={line} fill="none" stroke={INK} strokeOpacity="0.35" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/* --------------------------------------------------------------- columns */

/** Vertical bars for a small ordered set — weekdays, weeks. */
export function ColumnChart({
  data,
  format,
  highlightMax = true,
}: {
  data: { label: string; value: number }[];
  format: (value: number) => string;
  highlightMax?: boolean;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const peakIndex = data.findIndex((d) => d.value === max);

  return (
    <>
      <div className="flex h-32 items-end gap-1.5 border-b border-paper-200">
        {data.map((d, i) => (
          <div key={d.label} className="group relative flex h-full flex-1 items-end">
            <div
              className="w-full rounded-t-[4px] transition-colors"
              style={{
                height: `${Math.max(4, (d.value / max) * 100)}%`,
                background: highlightMax && i === peakIndex ? LEAF : INK,
              }}
            />
            <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap border border-paper-200 bg-white px-2.5 py-1.5 shadow-elevated group-hover:block">
              <span className="font-quantico text-[11px] font-bold text-ink">
                {format(d.value)}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-1.5">
        {data.map((d) => (
          <span
            key={d.label}
            className="flex-1 text-center font-nebula text-[9px] font-bold uppercase tracking-[0.08em] text-fg-subtle"
          >
            {d.label}
          </span>
        ))}
      </div>
      <DataTable
        caption="By period"
        rows={data.map((d) => ({ label: d.label, value: format(d.value) }))}
      />
    </>
  );
}
