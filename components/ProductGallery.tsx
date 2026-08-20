'use client';

import Image, { type StaticImageData } from 'next/image';
import { useEffect, useState } from 'react';

import { useTheme, type Theme } from './ThemeProvider';

export type GalleryImage = {
  src: string | StaticImageData | { light: string; dark: string };
  alt: string;
};

const AUTO_SLIDE_MS = 3000;

/**
 * Pick the photo for the look on screen.
 *
 * `black` shares the dark set — a product shot cut for a dark background works
 * on a black one, and asking the team for a third upload of the same bottle
 * would be busywork. A dark set that was never uploaded falls back to the
 * light one, so a half-filled catalogue still renders.
 */
function resolveGallerySrc(
  src: GalleryImage['src'],
  theme: Theme,
): string | StaticImageData {
  if (typeof src === 'object' && 'light' in src && 'dark' in src) {
    return theme === 'light' ? src.light : src.dark || src.light;
  }
  return src;
}

export default function ProductGallery({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState(0);
  const { theme } = useTheme();
  const count = images.length;

  useEffect(() => {
    if (count <= 1) return;
    const t = window.setInterval(() => {
      setActive((i) => (i + 1) % count);
    }, AUTO_SLIDE_MS);
    return () => window.clearInterval(t);
  }, [active, count]);

  function go(dir: number) {
    setActive((i) => (i + dir + count) % count);
  }

  const currentSrc = resolveGallerySrc(images[active].src, theme);

  return (
    <div>
      <div className="relative aspect-[10/9] w-full overflow-hidden border border-paper-200 bg-white dark:border-paper-300 dark:bg-paper md:aspect-square">
        <Image
          key={`${active}-${theme}`}
          src={currentSrc}
          alt={images[active].alt}
          fill
          priority
          sizes="(min-width: 1024px) 560px, 100vw"
          className="object-contain"
        />

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 dark:bg-paper/90 text-ink dark:text-white shadow-card dark:shadow-none transition-colors hover:bg-white dark:hover:bg-ink-900 md:h-10 md:w-10"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 dark:bg-paper/90 text-ink dark:text-white shadow-card dark:shadow-none transition-colors hover:bg-white dark:hover:bg-ink-900 md:h-10 md:w-10"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="mt-2.5 flex items-center justify-center gap-2 md:mt-4">
          {images.map((im, i) => (
            <button
              key={typeof im.src === 'string' ? im.src : i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={i === active}
              className={`h-2 rounded-full transition-all ${
                i === active ? 'w-5 bg-accent' : 'w-2 bg-paper-300 hover:bg-paper-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
