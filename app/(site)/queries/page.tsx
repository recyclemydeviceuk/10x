import type { Metadata } from 'next';
import Link from 'next/link';

import QueryForm from './QueryForm';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://10xdrink.com';

export const metadata: Metadata = {
  title: 'Queries — ask us anything',
  description:
    'Ask 10X anything — the product, an order, your subscription, refunds, bulk orders or stocking us. A real person answers within one working day.',
  alternates: { canonical: '/queries' },
  openGraph: {
    title: 'Queries — ask 10X anything',
    description:
      'The product, an order, your subscription, refunds, bulk orders or stocking us. A real person answers within one working day.',
    url: `${SITE_URL}/queries`,
  },
};

const ASSURANCES = [
  {
    title: 'A person, not a macro',
    detail:
      'Someone who knows the product reads every one of these. If we don’t know, we’ll say so rather than guess.',
  },
  {
    title: 'One working day',
    detail:
      'Two at the outside, and that includes the awkward questions. You get a reference number the moment you send it.',
  },
  {
    title: 'No list, no drip',
    detail:
      'Your email answers your question and then goes quiet. We don’t add you to anything.',
  },
];

const SHORTCUTS = [
  { label: 'Track an order', href: '/track', hint: 'Fastest way to find a parcel' },
  { label: 'Read the FAQ', href: '/#before-you-ask', hint: 'Crashes, caffeine, what’s in it' },
  { label: 'Shipping & returns', href: '/shipping', hint: 'Timelines and what we cover' },
];

export default function QueriesPage() {
  return (
    <main id="main" className="bg-white">
      {/* Header band */}
      <section className="border-b border-paper-200 bg-paper-50">
        <div className="mx-auto max-w-7xl px-5 pb-12 pt-28 sm:px-8 md:px-14 md:pb-16 md:pt-36">
          <p className="type-k text-ink-800">Queries</p>
          <h1 className="type-d1 mt-5 max-w-3xl text-ink">
            Ask Us
            <br />
            Anything.
          </h1>
          <p className="type-b1 mt-6 max-w-xl text-ink">
            The product, an order, your subscription, a refund, or whether we&rsquo;ll
            stock you. If it doesn&rsquo;t fit a box, use the last one.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:px-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-14">
          {/* The form */}
          <div>
            <QueryForm />
          </div>

          {/* What happens next */}
          <aside className="lg:pt-2">
            <h2 className="type-k text-fg-muted">What happens next</h2>
            <ul className="mt-5 space-y-6">
              {ASSURANCES.map((item) => (
                <li key={item.title} className="border-l-2 border-accent pl-5">
                  <p className="font-quantico text-[13px] font-bold uppercase tracking-[0.1em] text-ink">
                    {item.title}
                  </p>
                  <p className="type-b2 mt-1.5 text-fg-muted">{item.detail}</p>
                </li>
              ))}
            </ul>

            <h2 className="type-k mt-10 border-t border-paper-200 pt-8 text-fg-muted">
              Might be quicker
            </h2>
            <ul className="mt-4 space-y-2">
              {SHORTCUTS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-center justify-between gap-3 border border-paper-200 px-4 py-3.5 transition-colors hover:border-ink"
                  >
                    <span className="min-w-0">
                      <span className="block font-quantico text-[12px] font-bold uppercase tracking-[0.1em] text-ink">
                        {item.label}
                      </span>
                      <span className="type-b2 block truncate text-fg-subtle">{item.hint}</span>
                    </span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                      className="shrink-0 text-fg-subtle transition-transform group-hover:translate-x-0.5"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>

            <p className="type-b2 mt-8 text-fg-subtle">
              Prefer email?{' '}
              <a
                href="mailto:support@10xdrink.com"
                className="cursor-pointer text-ink underline decoration-paper-300 underline-offset-2 transition-colors hover:decoration-ink"
              >
                support@10xdrink.com
              </a>
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}
