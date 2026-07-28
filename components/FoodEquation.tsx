import Image from 'next/image';

/**
 * THE EQUATION — 90 almonds · 4 cups green tea · 1 bowl spinach · 2 eggs
 * = one 10X Daytime sachet, at full charge.
 *
 * Built in markup rather than shipped as one flat artwork so the numerals are
 * live type: Quantico Bold Italic at D3, per the brand kit. They are the visual
 * hook of the section, and in a JPEG they can't be set in the brand face at all.
 * The food photography is cropped straight out of the original artwork, so the
 * pictures are unchanged — only the typography and the battery are now real.
 */

type Item = {
  count: string;
  unit: string;
  note: string;
  src: string;
  alt: string;
  /** The green-tea card carries the aside, so it gets the accent treatment. */
  accent?: boolean;
};

const ITEMS: Item[] = [
  {
    count: '90',
    unit: 'Almonds',
    note: '— for the L-Tyrosine',
    src: '/equation/almonds.webp',
    alt: 'A bowl of almonds',
  },
  {
    count: '4',
    unit: 'Cups green tea',
    note: '— this one really is green tea',
    src: '/equation/green-tea.webp',
    alt: 'A bowl of green tea with fresh leaves',
    accent: true,
  },
  {
    count: '1',
    unit: 'Bowl spinach',
    note: '— for the folate',
    src: '/equation/spinach.webp',
    alt: 'A bowl of baby spinach',
  },
  {
    count: '2',
    unit: 'Eggs',
    note: '— for the choline',
    src: '/equation/eggs.webp',
    alt: 'Two eggs in a bowl',
  },
];

/**
 * The answer to the equation, at a size that actually reads as one — the old
 * artwork floated a ~50px battery in white space above the sachet.
 */
function Battery({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 78"
      className={className}
      role="img"
      aria-label="A battery at full charge"
    >
      {/* terminal */}
      <rect x="17" y="0" width="14" height="6" rx="1.5" fill="#000204" />
      {/* body */}
      <rect x="0" y="6" width="48" height="72" rx="4" fill="#000204" />
      {/* charge */}
      <rect x="12" y="17" width="24" height="50" rx="2" fill="#6DE325" />
    </svg>
  );
}

export default function FoodEquation() {
  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-5 md:gap-7">
      {/* The inputs */}
      <ul className="grid w-full grid-cols-2 gap-x-5 gap-y-7 sm:flex-1">
        {ITEMS.map((item) => (
          <li key={item.unit} className="flex flex-col">
            {/* D3 — Quantico Bold Italic. The hook of the section. */}
            <p className={`type-d3 ${item.accent ? 'text-accent-pressed' : 'text-ink'}`}>
              {item.count}
            </p>
            <p className="type-b2 mt-1 font-bold text-ink">{item.unit}</p>
            <p
              className={`type-b2 mt-0.5 ${
                item.accent ? 'text-accent-pressed' : 'text-fg-muted'
              }`}
            >
              {item.note}
            </p>
            <Image
              src={item.src}
              alt={item.alt}
              width={162}
              height={112}
              sizes="(min-width: 1024px) 200px, 40vw"
              className="mt-3 h-auto w-full"
            />
          </li>
        ))}
      </ul>

      {/* equals */}
      <div aria-hidden className="flex shrink-0 flex-col gap-1.5 sm:gap-2">
        <span className="block h-1.5 w-8 bg-ink sm:h-2 sm:w-6 md:w-8" />
        <span className="block h-1.5 w-8 bg-ink sm:h-2 sm:w-6 md:w-8" />
      </div>

      {/* The answer — sachet at full charge */}
      <div className="flex shrink-0 flex-col items-center gap-3">
        <Battery className="h-12 w-auto md:h-16" />
        <Image
          src="/equation/sachet.webp"
          alt="One 10X Daytime sachet"
          width={144}
          height={372}
          sizes="(min-width: 1024px) 150px, 100px"
          className="h-auto w-[84px] md:w-[132px]"
        />
      </div>
    </div>
  );
}
