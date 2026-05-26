'use client';

import Image from 'next/image';
import { useEffect } from 'react';

import { useCart } from './CartContext';

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatPrice(amount: number) {
  return inrFormatter.format(amount);
}

export default function CartPanel() {
  const { isOpen, close, items, removeItem, setQuantity, count, totals } =
    useCart();

  useEffect(() => {
    if (!isOpen) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') close();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, close]);

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden
        onClick={close}
        className={`fixed inset-0 z-[10000] bg-black/50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Sliding panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed inset-y-0 right-0 z-[10001] flex w-full max-w-md flex-col bg-white text-fg shadow-elevated transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-paper-200 px-5 py-4 md:px-6">
          <div>
            <h2 className="font-condensed text-[1.375rem] font-black uppercase leading-none tracking-tight text-fg md:text-[1.5rem]">
              Your Cart
            </h2>
            <p className="mt-1.5 font-pt text-[11px] uppercase tracking-wider text-fg-muted">
              {count === 0
                ? 'No items yet'
                : `${count} ${count === 1 ? 'item' : 'items'}`}
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close cart"
            className="-mr-2 cursor-pointer p-2 text-fg-muted transition-colors hover:bg-paper-100 hover:text-fg"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
            <div className="mb-5 text-fg-subtle">
              <svg
                width="56"
                height="56"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
            <h3 className="font-condensed text-[1.375rem] font-black uppercase leading-tight text-fg md:text-[1.5rem]">
              Your cart is empty
            </h3>
            <p className="mt-2 max-w-xs font-pt text-body-sm text-fg-muted">
              Add 10X to your cart and fuel focus, clarity, and recovery.
            </p>
            <button
              type="button"
              onClick={close}
              className="mt-6 inline-flex cursor-pointer items-center gap-2 border border-brand-blue bg-transparent px-5 py-2 font-quantico text-[11px] font-bold uppercase tracking-[0.14em] text-brand-blue transition-colors hover:bg-brand-blue hover:text-white"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <ul className="flex-1 overflow-y-auto px-5 md:px-6">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex gap-4 border-b border-paper-200 py-5 last:border-b-0"
              >
                <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-paper-100">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-quantico text-body-sm font-bold text-fg">
                        {item.name}
                      </p>
                      <p className="mt-1 font-pt text-caption text-fg-muted">
                        {item.pack}
                      </p>
                      <p className="mt-1 font-pt text-caption text-fg-subtle">
                        {item.priceLabel} each
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.name}`}
                      className="-mr-1 -mt-1 shrink-0 cursor-pointer p-1 text-fg-muted transition-colors hover:text-danger"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>

                  <div className="mt-auto flex items-end justify-between pt-3">
                    <div className="inline-flex items-stretch border border-paper-200">
                      <button
                        type="button"
                        onClick={() => setQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                        className="flex h-9 w-9 cursor-pointer items-center justify-center font-quantico text-body font-bold text-fg transition-colors hover:bg-paper-100"
                      >
                        −
                      </button>
                      <span className="flex h-9 min-w-9 items-center justify-center border-x border-paper-200 px-2 font-quantico text-body-sm font-bold text-fg">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                        className="flex h-9 w-9 cursor-pointer items-center justify-center font-quantico text-body font-bold text-fg transition-colors hover:bg-paper-100"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-quantico text-body font-bold text-fg">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-paper-200 bg-paper-50 px-5 py-5 md:px-6">
            {/* Free-shipping progress strip */}
            {totals.shippingIsFree ? (
              <div className="mb-4 flex items-center gap-2 border border-success/30 bg-success/10 px-3 py-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0 text-success"
                  aria-hidden
                >
                  <path d="M5 12.5 10 17.5 19 7" />
                </svg>
                <p className="font-pt text-caption font-bold text-success">
                  You&rsquo;ve unlocked free shipping
                </p>
              </div>
            ) : (
              <div className="mb-4 border border-paper-200 bg-white px-3 py-2">
                <p className="font-pt text-caption text-fg">
                  Add{' '}
                  <span className="font-bold text-brand-blue">
                    {formatPrice(totals.amountUntilFreeShipping)}
                  </span>{' '}
                  more for{' '}
                  <span className="font-bold">free shipping</span>.
                </p>
                <div className="mt-2 h-1 w-full overflow-hidden bg-paper-200">
                  <div
                    className="h-full bg-brand-blue transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        100,
                        (totals.subtotal / totals.freeShippingThreshold) * 100,
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Pricing breakdown */}
            <dl className="space-y-2 font-pt text-body-sm text-fg">
              <div className="flex items-center justify-between">
                <dt className="text-fg-muted">Subtotal ({count} {count === 1 ? 'item' : 'items'})</dt>
                <dd className="font-quantico font-bold text-fg">
                  {formatPrice(totals.subtotal)}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-fg-muted">Shipping</dt>
                <dd className="font-quantico font-bold">
                  {totals.shippingIsFree ? (
                    <span className="text-success">FREE</span>
                  ) : (
                    <span className="text-fg">{formatPrice(totals.shipping)}</span>
                  )}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-fg-muted">GST (18%)</dt>
                <dd className="font-quantico font-bold text-fg">
                  {formatPrice(totals.gst)}
                </dd>
              </div>
            </dl>

            <div className="mt-3 flex items-baseline justify-between border-t border-paper-200 pt-3">
              <p className="font-quantico text-caption font-bold uppercase tracking-wider text-fg-muted">
                Total
              </p>
              <p className="font-quantico text-[1.25rem] font-bold text-fg md:text-[1.375rem]">
                {formatPrice(totals.grandTotal)}
              </p>
            </div>
            <p className="mt-1 text-right font-pt text-[10px] text-fg-subtle">
              Includes CGST 9% + SGST 9%. Prices in INR.
            </p>

            <button
              type="button"
              className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 px-6 py-4 font-quantico text-body font-bold uppercase tracking-[0.18em] text-white shadow-elevated transition hover:opacity-90"
              style={{
                background:
                  'linear-gradient(90deg, #000204 0%, #02063A 35%, #06189E 100%)',
              }}
            >
              Checkout · {formatPrice(totals.grandTotal)}
            </button>
            <button
              type="button"
              onClick={close}
              className="mt-3 inline-flex w-full cursor-pointer items-center justify-center px-6 py-2.5 font-quantico text-caption font-bold uppercase tracking-[0.18em] text-fg-muted transition-colors hover:text-fg"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
