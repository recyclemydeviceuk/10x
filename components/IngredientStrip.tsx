import Image from 'next/image';

import { INGREDIENT_DETAILS } from './plans';

export default function IngredientStrip() {
  return (
    <section
      id="ingredients"
      aria-label="Engineered with"
      className="bg-paper-100 py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-10 md:px-14">
        <h2 className="font-condensed text-2xl font-black uppercase italic leading-none tracking-tight text-ink sm:text-3xl md:text-4xl">
          Engineered With
        </h2>

        {/* Ingredient cards — image with a frosted-glass label band */}
        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:mt-14 md:grid-cols-6">
          {INGREDIENT_DETAILS.map((ing) => (
            <li
              key={ing.name}
              className="group relative aspect-square w-full overflow-hidden border border-paper-200 shadow-card"
            >
              <Image
                src={ing.image}
                alt={ing.name}
                fill
                sizes="(min-width: 768px) 180px, 45vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />

              {/* frosted-glass band — bottom 30% */}
              <div
                className="absolute inset-x-0 bottom-0 flex h-[30%] items-center justify-start border-t border-white/60 px-4"
                style={{
                  background: 'rgba(255,255,255,0.78)',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                }}
              >
                <p className="text-left font-quantico text-caption font-bold uppercase tracking-wide text-ink">
                  {ing.name}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
