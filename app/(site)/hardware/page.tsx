import type { Metadata } from 'next';
import Link from 'next/link';

/**
 * THE HARDWARE — placeholder.
 *
 * The nav links here now so the menu is complete; the copy for this page is
 * being written separately. Drop the real content into <article> below and
 * remove the `robots` block so the page can be indexed.
 */
export const metadata: Metadata = {
  title: 'The Hardware',
  description: 'The Hardware — how 10X works. Coming shortly.',
  alternates: { canonical: '/hardware' },
  robots: { index: false, follow: true },
};

export default function HardwarePage() {
  return (
    <main id="main" className="bg-white">
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-28 sm:px-8 md:px-14 md:pb-24 md:pt-36">
        <p className="type-k text-ink-800">The Hardware</p>

        <h1 className="type-d1 mt-5 max-w-3xl text-ink">
          The Bit That
          <br />
          Does The Work.
        </h1>

        <article className="mt-6 max-w-xl">
          <p className="type-b1 text-ink">
            This page is being written. It covers what 10X is actually made of and
            why each part is in there — the hardware behind the better afternoon.
          </p>
          <p className="type-b2 mt-4 text-fg-muted">
            Until then, the short version lives on the product page.
          </p>
        </article>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/products/10x-daytime"
            className="type-k inline-flex cursor-pointer items-center gap-2 bg-accent px-8 py-3.5 text-ink transition-colors hover:bg-accent-hover"
          >
            See the Product
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
          <Link
            href="/#before-you-ask"
            className="type-k inline-flex cursor-pointer items-center border border-paper-300 px-8 py-3.5 text-ink transition-colors hover:border-ink"
          >
            Read the FAQ
          </Link>
        </div>
      </section>
    </main>
  );
}
