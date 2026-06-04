'use client';

import Image, { type StaticImageData } from 'next/image';
import { useState } from 'react';

export type GalleryImage = { src: StaticImageData; alt: string };

export default function ProductGallery({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState(0);
  const count = images.length;

  function go(dir: number) {
    setActive((i) => (i + dir + count) % count);
  }

  return (
    <div>
      {/* Main image */}
      <div className="group relative aspect-square w-full overflow-hidden border border-paper-200 bg-paper-100">
        <Image
          key={active}
          src={images[active].src}
          alt={images[active].alt}
          fill
          priority
          sizes="(min-width: 1024px) 560px, 100vw"
          className="object-cover"
        />

        {/* Best seller badge */}
        <span className="absolute left-4 top-4 bg-accent px-3 py-1.5 font-quantico text-[10px] font-bold uppercase tracking-widest text-ink">
          Best Seller
        </span>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center bg-white/90 text-ink opacity-0 shadow-card transition-opacity hover:bg-white group-hover:opacity-100"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center bg-white/90 text-ink opacity-0 shadow-card transition-opacity hover:bg-white group-hover:opacity-100"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      <div className="mt-3 grid grid-cols-5 gap-2 sm:gap-3">
        {images.map((im, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`View image ${i + 1}`}
            aria-current={i === active}
            className={`relative aspect-square cursor-pointer overflow-hidden border transition-colors ${
              i === active ? 'border-brand-blue ring-1 ring-brand-blue' : 'border-paper-200 hover:border-paper-300'
            }`}
          >
            <Image src={im.src} alt="" fill sizes="110px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
