'use client';

/**
 * One choice in the "how do you want to buy this" radio group — one-time or
 * every 4 weeks. Shared by the homepage buy block (`BuyBox`) and the product
 * detail purchase panel (`ProductPurchase`) so both read identically.
 */
export default function PlanOption({
  active,
  onSelect,
  label,
  price,
  badge,
}: {
  active: boolean;
  onSelect: () => void;
  label: string;
  price: string;
  /** Optional trailing note, e.g. "Save ₹150". */
  badge?: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onSelect}
      className={`flex cursor-pointer flex-col items-start gap-1 border px-4 py-3 text-left transition-colors ${
        active ? 'border-accent bg-accent/10' : 'border-paper-200 hover:border-paper-300'
      }`}
    >
      <span className="flex w-full items-center gap-2">
        <span
          aria-hidden
          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
            active ? 'border-accent bg-accent' : 'border-paper-300'
          }`}
        >
          {active && <span className="h-1.5 w-1.5 rounded-full bg-ink" />}
        </span>
        <span className="font-nebula text-[11px] font-bold uppercase tracking-[0.1em] text-ink md:text-xs">
          {label}
        </span>
      </span>
      <span className="flex flex-wrap items-baseline gap-2 pl-6">
        <span className="font-quantico text-lg font-bold text-ink">{price}</span>
        {/* Quantico, not PT Sans Caption — the caption cut draws ₹ like a ₱. */}
        {badge && (
          <span className="whitespace-nowrap font-quantico text-[13px] text-fg-muted">
            {badge}
          </span>
        )}
      </span>
    </button>
  );
}
