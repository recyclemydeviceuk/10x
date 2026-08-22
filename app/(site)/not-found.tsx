import type { Metadata } from 'next';
import Link from 'next/link';

import { IconArrow } from '@/components/ui/Field';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'That page isn’t here.',
  robots: { index: false, follow: false },
};

/**
 * 404, in the site's own voice. Sits inside the site layout so the header,
 * footer and cart are all still there — a wrong link shouldn't feel like
 * leaving the store.
 */
export default function NotFound() {
  return (
    <main id="main" className="min-h-[70vh] bg-paper">
      <div className="mx-auto max-w-2xl px-6 pb-24 pt-32 text-center sm:px-10 md:pt-44">
        <p className="font-quantico text-[10px] font-bold uppercase tracking-[0.2em] text-accent-pressed dark:text-accent">
          404
        </p>
        <h1 className="mt-4 font-condensed text-[clamp(2.5rem,9vw,5rem)] font-black uppercase italic leading-[0.9] tracking-tight text-fg">
          Nothing
          <br />
          Here
        </h1>
        <p className="mx-auto mt-6 max-w-md font-pt text-body-lg text-fg-muted">
          That page has moved or never existed. The pack you came for is still where it always is.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/products/10x-daytime"
            className="inline-flex cursor-pointer items-center justify-center gap-2 bg-accent px-7 py-4 font-quantico text-body-sm font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-accent-hover"
          >
            Shop 10X Daytime
            {IconArrow}
          </Link>
          <Link
            href="/"
            className="inline-flex cursor-pointer items-center justify-center border-2 border-paper-200 px-7 py-4 font-quantico text-body-sm font-bold uppercase tracking-[0.14em] text-fg transition-colors hover:border-fg"
          >
            Back Home
          </Link>
        </div>
        <p className="mt-10 font-pt text-caption text-fg-subtle">
          Looking for an order?{' '}
          <Link href="/account/orders" className="underline underline-offset-2 hover:text-fg">
            Your account
          </Link>
          {' · '}
          <Link href="/queries" className="underline underline-offset-2 hover:text-fg">
            Get help
          </Link>
        </p>
      </div>
    </main>
  );
}
