import Image from 'next/image';

import type { Ingredient } from './plans';

export default function IngredientCard({
  ing,
  className = '',
  ariaHidden = false,
}: {
  ing: Ingredient;
  className?: string;
  ariaHidden?: boolean;
}) {
  return (
    <li
      aria-hidden={ariaHidden || undefined}
      className={`group relative aspect-square overflow-hidden border border-paper-200 shadow-card ${className}`}
    >
      <Image
        src={ing.image}
        alt={ariaHidden ? '' : ing.name}
        fill
        sizes="(min-width: 768px) 180px, 24vw"
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />
      <div
        className="absolute inset-x-0 bottom-0 flex h-[30%] items-center justify-start border-t border-white/60 px-1.5 sm:px-4"
        style={{
          background: 'rgba(255,255,255,0.78)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
      >
        <p className="text-left font-quantico text-[11px] font-bold uppercase leading-tight tracking-tight text-ink sm:text-caption sm:tracking-wide">
          {ing.name}
        </p>
      </div>
    </li>
  );
}
