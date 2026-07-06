import { INGREDIENT_DETAILS } from './plans';
import IngredientCard from './IngredientCard';
import IngredientCarousel from './IngredientCarousel';

export default function IngredientStrip() {
  return (
    <section
      id="ingredients"
      aria-label="Engineered with"
      className="bg-paper-100 pb-8 pt-5 sm:py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-14">
        <h2 className="font-condensed text-2xl font-black uppercase italic leading-none tracking-tight text-ink sm:text-3xl md:text-4xl">
          Engineered With
        </h2>

        {/* Mobile / tablet: auto-scrolling carousel, ~4 per view */}
        <IngredientCarousel />

        {/* Desktop: full grid */}
        <ul className="mt-12 hidden gap-5 md:grid md:grid-cols-6">
          {INGREDIENT_DETAILS.map((ing) => (
            <IngredientCard key={ing.name} ing={ing} />
          ))}
        </ul>
      </div>
    </section>
  );
}
