'use client';

import Image, { type StaticImageData } from 'next/image';
import { useState } from 'react';

export type GalleryImage = { src: string | StaticImageData; alt: string };

export default function ProductGallery({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState(0);
  const count = images.length;

  function go(dir: number) {
    setActive((i) => (i + dir + count) % count);
  }

  return (
    <div>
      {/* Main image */}
      <div className="relative aspect-square w-full overflow-hidden border border-paper-200 bg-paper-100">
        <Image
          key={active}
          src={images[active].src}
          alt={images[active].alt}
          fill
          priority
          sizes="(min-width: 1024px) 560px, 100vw"
          className="object-cover"
        />

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-ink shadow-card transition-colors hover:bg-white"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-ink shadow-card transition-colors hover:bg-white"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Position dots (thumbnail previews removed for a minimal gallery) */}
      {count > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
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
