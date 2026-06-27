import Image from 'next/image';

import { INGREDIENT_DETAILS, type Ingredient } from './plans';

function Card({ ing, className = '' }: { ing: Ingredient; className?: string }) {
  return (
    <li className={`group relative aspect-square overflow-hidden border border-paper-200 shadow-card ${className}`}>
      <Image
        src={ing.image}
        alt={ing.name}
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

export default function IngredientStrip() {
  return (
    <section
      id="ingredients"
      aria-label="Engineered with"
      className="bg-paper-100 pb-10 pt-7 sm:py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-14">
        <h2 className="font-condensed text-2xl font-black uppercase italic leading-none tracking-tight text-ink sm:text-3xl md:text-4xl">
          Engineered With
        </h2>

        {/* Mobile / tablet: swipeable carousel, 4 per view */}
        <ul className="mt-5 flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 md:hidden [scrollbar-width:none]">
          {INGREDIENT_DETAILS.map((ing) => (
            <Card key={ing.name} ing={ing} className="w-[calc((100%-1.5rem)/4)] shrink-0 snap-start" />
          ))}
        </ul>

        {/* Desktop: full grid */}
        <ul className="mt-12 hidden gap-5 md:grid md:grid-cols-6">
          {INGREDIENT_DETAILS.map((ing) => (
            <Card key={ing.name} ing={ing} />
          ))}
        </ul>
      </div>
    </section>
  );
}
