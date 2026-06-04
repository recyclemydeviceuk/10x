'use client';

import Image from 'next/image';

import cartIcon from '../10x-Assets/Cart Icon.png';
import { useCart } from './CartContext';

export default function CartButton() {
  const { count, open } = useCart();
  return (
    <button
      type="button"
      onClick={open}
      aria-label={count > 0 ? `Cart, ${count} ${count === 1 ? 'item' : 'items'}` : 'Cart'}
      className="relative flex h-11 w-11 cursor-pointer items-center justify-center transition-opacity hover:opacity-80 md:h-12 md:w-12"
    >
      <Image
        src={cartIcon}
        alt=""
        width={28}
        height={28}
        className="h-7 w-7"
      />
      {count > 0 && (
        <span
          aria-hidden
          className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center bg-accent px-1 font-quantico text-[10px] font-bold leading-none text-ink shadow-elevated md:-right-0.5 md:-top-0.5"
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
}
