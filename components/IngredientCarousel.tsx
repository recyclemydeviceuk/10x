'use client';

import { useRef } from 'react';

import { INGREDIENT_DETAILS } from './plans';
import IngredientCard from './IngredientCard';
import { useAutoScroll } from './useAutoScroll';

// Mobile: seamless auto-scrolling marquee of ingredients. The list is rendered
// twice so the loop never shows a gap; it pauses on hover / touch.
export default function IngredientCarousel() {
  const ref = useRef<HTMLUListElement>(null);
  useAutoScroll(ref, { speed: 0.45, wrapIndex: INGREDIENT_DETAILS.length });

  return (
    <ul
      ref={ref}
      className="mt-4 flex gap-2 overflow-x-auto pb-2 md:hidden [scrollbar-width:none]"
    >
      {[...INGREDIENT_DETAILS, ...INGREDIENT_DETAILS].map((ing, i) => (
        <IngredientCard
          key={i}
          ing={ing}
          ariaHidden={i >= INGREDIENT_DETAILS.length}
          className="w-[calc((100%-1.5rem)/4)] shrink-0"
        />
      ))}
    </ul>
  );
}
