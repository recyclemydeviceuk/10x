'use client';

import { useEffect } from 'react';
import Link from 'next/link';

/**
 * Something in the page itself broke (a runtime error, not a 404). Shown in
 * the site's voice instead of Next's grey "Application error" card, with
 * one button that actually recovers — re-rendering the route — and the
 * cart, header and footer still in place.
 */
export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Surface for whoever is running the store; the customer sees plain copy.
    console.error('[10x] page error', error);
  }, [error]);

  return (
    <main id="main" className="min-h-[70vh] bg-paper">
      <div className="mx-auto max-w-2xl px-6 pb-24 pt-32 text-center sm:px-10 md:pt-44">
        <p className="font-quantico text-[10px] font-bold uppercase tracking-[0.2em] text-accent-pressed dark:text-accent">
          Something went wrong
        </p>
        <h1 className="mt-4 font-condensed text-[clamp(2rem,7vw,4rem)] font-black uppercase italic leading-[0.9] tracking-tight text-fg">
          That didn’t
          <br />
          load right
        </h1>
        <p className="mx-auto mt-6 max-w-md font-pt text-body-lg text-fg-muted">
          Nothing has been charged and your cart is safe. Try again — if it keeps happening, tell us and we’ll sort it.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex cursor-pointer items-center justify-center bg-accent px-7 py-4 font-quantico text-body-sm font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-accent-hover"
          >
            Try again
          </button>
          <Link
            href="/queries"
            className="inline-flex cursor-pointer items-center justify-center border-2 border-paper-200 px-7 py-4 font-quantico text-body-sm font-bold uppercase tracking-[0.14em] text-fg transition-colors hover:border-fg"
          >
            Get help
          </Link>
        </div>
        {error.digest ? (
          <p className="mt-8 font-pt text-caption text-fg-subtle">Reference {error.digest}</p>
        ) : null}
      </div>
    </main>
  );
}
