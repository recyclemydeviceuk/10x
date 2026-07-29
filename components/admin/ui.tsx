import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * Admin primitives.
 *
 * The panel borrows the storefront's tokens but speaks more quietly: display
 * italic is reserved for metric numerals (the hook), page titles are upright
 * Quantico, and colour appears only where it carries meaning. Surfaces are
 * white on #FAFAFA with hairline rules — no shadows, no rounding except pills.
 */

/* ------------------------------------------------------------------ page */

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  /** ReactNode, not string — any ₹ in here must go through <Money>. */
  subtitle?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-paper-200 pb-7 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-quantico text-2xl font-bold uppercase tracking-[0.01em] text-ink md:text-[28px]">
          {title}
        </h1>
        {subtitle && <p className="type-b2 mt-2 max-w-xl text-fg-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
  className = '',
  bodyClassName = 'p-6',
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={`border border-paper-200 bg-white ${className}`}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-4 border-b border-paper-200 px-6 py-4">
          {title && <h2 className="type-k text-fg-muted">{title}</h2>}
          {action}
        </header>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

/* --------------------------------------------------------------- buttons */

type ButtonTone = 'primary' | 'default' | 'ghost' | 'danger';

const BUTTON_TONES: Record<ButtonTone, string> = {
  primary: 'bg-ink text-white hover:bg-ink-900',
  default: 'border border-paper-300 bg-white text-ink hover:border-ink',
  ghost: 'text-fg-muted hover:text-ink',
  danger: 'border border-paper-300 bg-white text-danger hover:border-danger',
};

const BUTTON_BASE =
  'inline-flex cursor-pointer items-center justify-center gap-2 px-4 py-2.5 font-quantico text-[11px] font-bold uppercase tracking-[0.14em] transition-colors disabled:cursor-not-allowed disabled:opacity-50';

export function Button({
  tone = 'default',
  className = '',
  type = 'button',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { tone?: ButtonTone }) {
  return (
    <button type={type} className={`${BUTTON_BASE} ${BUTTON_TONES[tone]} ${className}`} {...props} />
  );
}

export function ButtonLink({
  href,
  tone = 'default',
  className = '',
  children,
  ...props
}: {
  href: string;
  tone?: ButtonTone;
  className?: string;
  children: ReactNode;
} & Omit<React.ComponentProps<typeof Link>, 'href' | 'className' | 'children'>) {
  return (
    <Link href={href} className={`${BUTTON_BASE} ${BUTTON_TONES[tone]} ${className}`} {...props}>
      {children}
    </Link>
  );
}

/* ----------------------------------------------------------------- pills */

/**
 * Status is carried by the label; the dot is a second, faster read. Never the
 * dot alone — that would be colour-only encoding.
 */
export type Signal = 'neutral' | 'progress' | 'good' | 'attention' | 'bad';

const DOTS: Record<Signal, string> = {
  neutral: 'bg-paper-300',
  progress: 'bg-ink',
  good: 'bg-[#4EA310]',
  attention: 'bg-warning',
  bad: 'bg-danger',
};

export function StatusPill({ signal, label }: { signal: Signal; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-paper-200 bg-white px-2.5 py-1">
      <span aria-hidden className={`h-1.5 w-1.5 shrink-0 rounded-full ${DOTS[signal]}`} />
      <span className="font-quantico text-[10px] font-bold uppercase tracking-[0.12em] text-ink">
        {label}
      </span>
    </span>
  );
}

const ORDER_SIGNALS: Record<string, { signal: Signal; label: string }> = {
  pending: { signal: 'attention', label: 'Pending' },
  confirmed: { signal: 'progress', label: 'Confirmed' },
  packed: { signal: 'progress', label: 'Packed' },
  dispatched: { signal: 'progress', label: 'Dispatched' },
  delivered: { signal: 'good', label: 'Delivered' },
  cancelled: { signal: 'bad', label: 'Cancelled' },
  rto: { signal: 'bad', label: 'Returned' },
};

const PAYMENT_SIGNALS: Record<string, { signal: Signal; label: string }> = {
  paid: { signal: 'good', label: 'Paid' },
  pending: { signal: 'attention', label: 'Pending' },
  failed: { signal: 'bad', label: 'Failed' },
  refunded: { signal: 'neutral', label: 'Refunded' },
};

const SUBSCRIPTION_SIGNALS: Record<string, { signal: Signal; label: string }> = {
  active: { signal: 'good', label: 'Active' },
  paused: { signal: 'attention', label: 'Paused' },
  cancelled: { signal: 'neutral', label: 'Cancelled' },
};

export function OrderStatusPill({ status }: { status: string }) {
  const s = ORDER_SIGNALS[status] ?? { signal: 'neutral' as Signal, label: status };
  return <StatusPill {...s} />;
}

export function PaymentStatusPill({ status }: { status: string }) {
  const s = PAYMENT_SIGNALS[status] ?? { signal: 'neutral' as Signal, label: status };
  return <StatusPill {...s} />;
}

export function SubscriptionStatusPill({ status }: { status: string }) {
  const s = SUBSCRIPTION_SIGNALS[status] ?? { signal: 'neutral' as Signal, label: status };
  return <StatusPill {...s} />;
}

/* ----------------------------------------------------------------- table */

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-left">{children}</table>
    </div>
  );
}

export function Th({
  children,
  align = 'left',
}: {
  children: ReactNode;
  align?: 'left' | 'right';
}) {
  return (
    <th
      scope="col"
      className={`whitespace-nowrap border-b border-paper-200 px-4 py-3.5 first:pl-6 last:pr-6 font-nebula text-[10px] font-bold uppercase tracking-[0.16em] text-fg-subtle ${
        align === 'right' ? 'text-right' : ''
      }`}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  align = 'left',
  className = '',
}: {
  children: ReactNode;
  align?: 'left' | 'right';
  className?: string;
}) {
  return (
    <td
      className={`border-b border-paper-100 px-4 py-4 align-middle first:pl-6 last:pr-6 ${
        align === 'right' ? 'text-right' : ''
      } ${className}`}
    >
      {children}
    </td>
  );
}

export function EmptyState({ title, detail }: { title: string; detail?: string }) {
  return (
    <div className="px-6 py-16 text-center">
      <p className="font-quantico text-sm font-bold uppercase tracking-[0.14em] text-ink">
        {title}
      </p>
      {detail && <p className="type-b2 mx-auto mt-2 max-w-sm text-fg-muted">{detail}</p>}
    </div>
  );
}

/* ------------------------------------------------------------ data bits */

/** Label above value — the panel's workhorse for read-only detail. */
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="font-nebula text-[10px] font-bold uppercase tracking-[0.16em] text-fg-subtle">
        {label}
      </dt>
      <dd className="type-b2 mt-1.5 text-ink">{children}</dd>
    </div>
  );
}

export function Avatar({ initials: text }: { initials: string }) {
  return (
    <span
      aria-hidden
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paper-100 font-quantico text-[11px] font-bold text-ink"
    >
      {text}
    </span>
  );
}

/**
 * Any rupee amount sitting inside body copy MUST go through this.
 *
 * PT Sans Caption — the B1/B2 face — ships a ₹ drawn like a peso (₱), and it
 * can't be fixed by fallback ordering because the font *has* the glyph. Quantico
 * lacks it, so the stack falls through to a clean ₹. Size and weight inherit, so
 * this is a font swap only.
 */
export function Money({ children }: { children: ReactNode }) {
  return <span className="font-quantico font-bold">{children}</span>;
}

/** Machine identifiers — AWBs, payment ids — want a mono, selectable treatment. */
export function Mono({ children }: { children: ReactNode }) {
  return (
    <span className="select-all font-mono text-[12px] tracking-tight text-fg-muted">
      {children}
    </span>
  );
}
