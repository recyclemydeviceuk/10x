'use client';

import { useState } from 'react';

import { useCart, type CartProduct } from './CartContext';

type Props = {
  product: CartProduct;
  label?: string;
  openCartOnAdd?: boolean;
  variant?: 'gradient-border' | 'gradient-fill';
};

const gradient =
  'linear-gradient(90deg, #000204 0%, #02063A 35%, #06189E 100%)';

function CheckIcon() {
  return (
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
    >
      <path d="M5 12.5 10 17.5 19 7" />
    </svg>
  );
}

export default function AddToCartButton({
  product,
  label = 'Add to Cart',
  openCartOnAdd = false,
  variant = 'gradient-border',
}: Props) {
  const { addItem, open } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  function handleAdd() {
    addItem(product, 1);
    if (openCartOnAdd) {
      open();
      return;
    }
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  }

  if (variant === 'gradient-fill') {
    return (
      <button
        type="button"
        onClick={handleAdd}
        className="inline-flex w-full cursor-pointer items-center justify-center gap-2 px-8 py-3 font-quantico text-body-sm font-bold uppercase tracking-[0.18em] text-white shadow-elevated transition hover:opacity-90 sm:w-auto"
        style={{ background: gradient }}
      >
        {justAdded ? (
          <>
            Added <CheckIcon />
          </>
        ) : (
          label
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 bg-transparent px-4 py-3 font-quantico text-body-sm font-bold uppercase tracking-[0.18em] text-brand-blue transition hover:opacity-80"
      style={{
        cursor: 'pointer',
        border: '2px solid',
        borderImage: `${gradient} 1`,
      }}
    >
      {justAdded ? (
        <>
          Added <CheckIcon />
        </>
      ) : (
        label
      )}
    </button>
  );
}
