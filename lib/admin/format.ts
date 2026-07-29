/**
 * Formatting helpers.
 *
 * All dates are formatted with an explicit timeZone so the server render and
 * the client hydration agree — otherwise a table of timestamps flickers or
 * throws a hydration mismatch depending on where it renders.
 */

const TIME_ZONE = 'Asia/Kolkata';

const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const inrCompact = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  notation: 'compact',
  maximumFractionDigits: 1,
});

export function money(value: number): string {
  return inr.format(value);
}

/** For stat tiles, where ₹4,28,700 is noise and ₹4.3L is the point. */
export function moneyCompact(value: number): string {
  return inrCompact.format(value);
}

export function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    timeZone: TIME_ZONE,
  });
}

export function fullDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: TIME_ZONE,
  });
}

/** Time only — pairs with `fullDate` to stack a timestamp over two tight lines. */
export function timeOnly(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: TIME_ZONE,
  });
}

export function dateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: TIME_ZONE,
  });
}

/** "3 days ago" / "in 6 days" — relative to a caller-supplied now, never Date.now() at module scope. */
export function relativeDays(iso: string, now: Date): string {
  const days = Math.round(
    (new Date(iso).getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (days === 0) return 'today';
  if (days === 1) return 'tomorrow';
  if (days === -1) return 'yesterday';
  return days > 0 ? `in ${days} days` : `${Math.abs(days)} days ago`;
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

const METHOD_LABELS: Record<string, string> = {
  upi: 'UPI',
  card: 'Card',
  netbanking: 'Netbanking',
  wallet: 'Wallet',
  cod: 'COD',
};

export function methodLabel(method: string): string {
  return METHOD_LABELS[method] ?? method;
}
