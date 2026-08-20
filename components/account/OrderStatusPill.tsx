import type { OrderStatus } from '@/lib/store/types';

/**
 * Order status badge.
 *
 * Green means done or on its way; grey means waiting; red means it isn't
 * coming. Green is the only accent the brand uses, so "in progress" states
 * lean on it and everything else stays neutral.
 */
const STYLES: Record<OrderStatus, { label: string; className: string }> = {
  placed: {
    label: 'Order placed',
    className: 'bg-paper-200 text-fg-muted dark:bg-paper-300',
  },
  confirmed: {
    label: 'Confirmed',
    className: 'bg-paper-200 text-fg-muted dark:bg-paper-300',
  },
  packed: {
    label: 'Packed',
    className: 'bg-accent/20 text-accent-pressed dark:text-accent',
  },
  shipped: {
    label: 'Shipped',
    className: 'bg-accent/20 text-accent-pressed dark:text-accent',
  },
  out_for_delivery: {
    label: 'Out for delivery',
    className: 'bg-accent/20 text-accent-pressed dark:text-accent',
  },
  delivered: {
    label: 'Delivered',
    className: 'bg-accent text-ink',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-danger/10 text-danger',
  },
  returned: {
    label: 'Returned',
    className: 'bg-danger/10 text-danger',
  },
};

export default function OrderStatusPill({ status }: { status: OrderStatus }) {
  const { label, className } = STYLES[status];
  return (
    <span
      className={`shrink-0 px-3 py-1 font-quantico text-[10px] font-bold uppercase tracking-[0.12em] ${className}`}
    >
      {label}
    </span>
  );
}
