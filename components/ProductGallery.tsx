'use client';

import Image, { type StaticImageData } from 'next/image';
import { useEffect, useState } from 'react';

export type GalleryImage = { src: string | StaticImageData; alt: string };

const PER_PAGE = 5;

export default function ProductGallery({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState(0);
  const [page, setPage] = useState(0);
  const count = images.length;
  const pages = Math.ceil(count / PER_PAGE);

  function go(dir: number) {
    setActive((i) => (i + dir + count) % count);
  }

  // Keep the thumbnail slider on the page that holds the active image.
  useEffect(() => {
    setPage(Math.floor(active / PER_PAGE));
  }, [active]);

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

      {/* Thumbnail slider — 5 per slide, arrows flanking the images */}
      <div className="mt-3">
        <div className="flex items-center gap-2 sm:gap-3">
          {pages > 1 && (
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              aria-label="Previous thumbnails"
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center border border-paper-200 text-ink transition-colors hover:border-paper-300 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}

          <div className="min-w-0 flex-1 overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${page * 100}%)` }}
            >
              {Array.from({ length: pages }).map((_, p) => (
                <div key={p} className="grid w-full shrink-0 grid-cols-5 gap-2 sm:gap-3">
                  {images.slice(p * PER_PAGE, p * PER_PAGE + PER_PAGE).map((im, j) => {
                    const i = p * PER_PAGE + j;
                    return (
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
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {pages > 1 && (
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
              disabled={page === pages - 1}
              aria-label="Next thumbnails"
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center border border-paper-200 text-ink transition-colors hover:border-paper-300 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}
        </div>

        {pages > 1 && (
          <div className="mt-3 flex items-center justify-center gap-2">
            {Array.from({ length: pages }).map((_, p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                aria-label={`Thumbnail page ${p + 1}`}
                aria-current={p === page}
                className={`h-2 rounded-full transition-all ${
                  p === page ? 'w-5 bg-brand-blue' : 'w-2 bg-paper-300 hover:bg-paper-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
