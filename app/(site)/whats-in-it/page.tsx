import type { Metadata } from 'next';
import Link from 'next/link';

import {
  ACTIVES,
  CERTIFICATIONS,
  DOSING,
  DOSING_REFS,
  FAQS,
  LEFT_OUT_REFS,
  REFERENCES,
  SPEC,
  SUGAR_COST,
  SWEETENER,
  SYNERGY,
  SYNERGY_REFS,
  type Reference,
} from './content';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://10xdrink.com';

export const metadata: Metadata = {
  title: "What's In It?",
  description:
    'The full 10X formulation: Taurine, Acetyl-L-Carnitine, L-Tyrosine, 80mg caffeine, green tea extract, B-complex and electrolytes — what each does, at what dose, why the combination works, and the safety certifications behind it.',
  keywords: [
    'what is taurine',
    'acetyl L carnitine brain',
    'L tyrosine benefits',
    'green tea extract cognition',
    'B vitamins brain',
    'nootropic ingredients India',
    '10X ingredients',
    'brain health supplements India',
  ],
  alternates: { canonical: '/whats-in-it' },
  openGraph: {
    type: 'article',
    url: `${SITE_URL}/whats-in-it`,
    title: "What's In It? — the 10X formulation, ingredient by ingredient",
    description:
      'Seven actives in one 4.5g sachet. What each does, at what dose, and the research behind it.',
  },
};

const REF_BY_ID = new Map(REFERENCES.map((r) => [r.id, r]));

function withRupee(text: string) {
  return text.split('₹').flatMap((chunk, i) =>
    i === 0
      ? [chunk]
      : [
          <span key={i} style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Arial' }}>
            {'₹'}
          </span>,
          chunk,
        ],
  );
}

function Cite({ ids, tone = 'light' }: { ids: string[]; tone?: 'light' | 'dark' }) {
  return (
    <p className={`mt-4 text-[12px] md:mt-5 md:text-[13px] ${tone === 'dark' ? 'text-white/45' : 'text-fg-subtle'}`}>
      <span className="sr-only">Cited studies: </span>
      {ids.map((id, i) => {
        const ref = REF_BY_ID.get(id);
        if (!ref) return null;
        return (
          <span key={id}>
            {i > 0 && <span aria-hidden> · </span>}
            <a
              href={`#ref-${id}`}
              className={`cursor-pointer underline decoration-dotted underline-offset-4 transition-colors ${
                tone === 'dark' ? 'hover:text-accent' : 'hover:text-accent-pressed'
              }`}
            >
              {`${ref.authors.split(',')[0]} ${ref.year}`}
            </a>
          </span>
        );
      })}
    </p>
  );
}

function ReferenceItem({ item }: { item: Reference }) {
  return (
    <li id={`ref-${item.id}`} className="scroll-mt-24 py-3 md:py-4 md:grid md:grid-cols-[11rem_1fr] md:gap-6">
      <p className="text-[11px] font-bold uppercase text-white/40">
        {item.authors} <span className="tracking-normal">({item.year})</span>
      </p>
      <div className="mt-1 md:mt-0">
        <p className="text-[14px] leading-relaxed text-white/90 md:text-[15px]">{item.title}</p>
        <p className="mt-1 text-[12px] leading-relaxed text-white/50 md:text-[13px]">
          {item.source}
          {item.locator && <span className="text-white/35"> · {item.locator}</span>}
          {item.href && (
            <>
              {' · '}
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer text-accent underline underline-offset-4"
              >
                Read the paper
              </a>
            </>
          )}
        </p>
      </div>
    </li>
  );
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function WhatsInItPage() {
  return (
    <main id="main" className="bg-white dark:bg-paper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ── Hero ── */}
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-6xl px-5 pb-14 pt-28 sm:px-8 md:px-14 md:pb-28 md:pt-44">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:gap-20">
            <div className="lg:w-1/2">
              <p className="type-k text-accent">Formulation</p>
              <h1 className="mt-4 font-quantico text-[1.75rem] font-bold italic leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
                Seven Actives.
                <br />
                One Sachet.
              </h1>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/70 md:mt-6 md:text-[17px]">
                Nothing in here is a proprietary blend or a mystery. Below is every
                active, what it does, at what dose,{' '}
                <span className="font-bold text-white">and the research it rests on.</span>
              </p>
            </div>

            <div className="lg:w-1/2">
              <dl className="grid grid-cols-3 gap-px bg-white/10">
                {SPEC.map((s) => (
                  <div key={s.k} className="bg-ink px-3 py-4 md:px-5 md:py-6">
                    <dt className="text-[10px] font-bold uppercase text-white/40 md:text-[11px]">{s.k}</dt>
                    <dd className="mt-1.5 flex items-baseline gap-1 md:mt-2">
                      <span className="font-quantico text-lg font-bold italic text-accent md:text-2xl">{s.v}</span>
                      <span className="text-[10px] font-bold uppercase text-white/50 md:text-[11px]">{s.unit}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* ── The seven actives ── */}
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 md:px-14 md:py-32">
        <div className="grid gap-8 md:grid-cols-[11rem_1fr] md:gap-16 lg:gap-24">
          {/* Sticky nav rail — horizontal scroll on mobile */}
          <nav aria-label="Ingredients" className="md:sticky md:top-28 md:self-start">
            <p className="text-[11px] font-bold uppercase text-fg-subtle">The formulation</p>
            <ul className="-mx-5 mt-3 flex gap-1 overflow-x-auto px-5 md:mx-0 md:mt-5 md:flex-col md:gap-y-1 md:overflow-visible md:px-0">
              {ACTIVES.map((a) => (
                <li key={a.id} className="shrink-0">
                  <a
                    href={`#${a.id}`}
                    className="block cursor-pointer whitespace-nowrap bg-paper-50 dark:bg-paper-200 px-3 py-2 text-[11px] font-bold uppercase text-ink dark:text-white transition-colors hover:text-accent-pressed md:bg-transparent md:dark:bg-transparent md:px-0"
                  >
                    <span aria-hidden className="mr-1.5 text-fg-subtle md:mr-2">{a.n}</span>
                    {a.short}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Active ingredient cards */}
          <div className="space-y-6 md:space-y-12">
            {ACTIVES.map((a) => (
              <article key={a.id} id={a.id} className="scroll-mt-24 flex bg-paper-50 dark:bg-paper-200">
                <div className="w-1 shrink-0 bg-accent md:w-1.5" />
                <div className="flex-1 px-4 py-5 md:px-10 md:py-10">
                  {/* top bar */}
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 md:gap-x-6">
                    <span className="font-quantico text-sm font-bold italic text-accent/50">{a.n}</span>
                    <h2 className="font-quantico text-xl font-bold italic text-ink dark:text-white md:text-3xl">{a.name}</h2>
                    <span className="text-[10px] font-bold uppercase text-accent-pressed md:text-[11px]">{a.role}</span>
                  </div>

                  {/* dose badge */}
                  <div className="mt-4 inline-flex items-baseline gap-2 bg-ink px-4 py-2.5 md:mt-6 md:gap-3 md:px-5 md:py-3">
                    <span className="text-[10px] font-bold uppercase text-white/50 md:text-[11px]">{a.dose.label}</span>
                    <span className="font-quantico text-base font-bold italic text-accent md:text-lg">{a.dose.value}</span>
                  </div>

                  <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-fg-muted md:mt-6 md:text-[15px]">{a.whatItIs}</p>

                  <div className="mt-5 md:mt-8">
                    <p className="text-[11px] font-bold uppercase text-ink dark:text-white">What it does in 10X</p>
                    <ul className="mt-3 space-y-2 md:mt-4 md:space-y-3">
                      {a.does.map((d) => (
                        <li key={d} className="flex gap-3 md:gap-4">
                          <span aria-hidden className="mt-1.5 h-[3px] w-3 shrink-0 bg-accent" />
                          <span className="text-[13px] leading-relaxed text-ink dark:text-white md:text-[14px]">{d}</span>
                        </li>
                      ))}
                    </ul>
                    <Cite ids={a.refIds} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Synergy ── */}
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 md:px-14 md:py-32">
          <p className="type-k text-white/40">The formula story</p>
          <h2 className="mt-3 font-quantico text-[1.375rem] font-bold italic text-white md:mt-4 md:text-3xl">
            Greater Than The Sum.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-white/70 md:mt-6 md:text-[17px]">
            The seven actives amplify each other. That interaction is the product
            — it is what a single-ingredient supplement structurally cannot do.
          </p>

          {/* Cards on mobile, table on desktop */}
          <div className="mt-10 md:mt-16">
            {/* Mobile: stacked cards */}
            <div className="space-y-3 md:hidden">
              {SYNERGY.map((row) => (
                <div key={row.combination} className="bg-white/[0.05] px-5 py-5">
                  <p className="font-quantico text-sm font-bold italic text-accent">{row.combination}</p>
                  <p className="mt-2 text-[14px] leading-relaxed text-white/75">{row.effect}</p>
                </div>
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden md:block">
              <table className="w-full border-collapse text-left">
                <caption className="sr-only">
                  How the 10X actives combine, and the effect of each combination
                </caption>
                <thead>
                  <tr>
                    <th scope="col" className="border-b border-white/10 px-6 py-4 text-[11px] font-bold uppercase text-white/40">Combination</th>
                    <th scope="col" className="border-b border-white/10 px-6 py-4 text-[11px] font-bold uppercase text-white/40">Effect</th>
                  </tr>
                </thead>
                <tbody>
                  {SYNERGY.map((row, i) => (
                    <tr key={row.combination} className={i % 2 === 0 ? 'bg-white/[0.03]' : ''}>
                      <th scope="row" className="px-6 py-5 text-[15px] font-bold text-accent">
                        {row.combination}
                      </th>
                      <td className="px-6 py-5 text-[15px] leading-relaxed text-white/75">{row.effect}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 border border-white/10 px-5 py-5 md:mt-12 md:max-w-lg md:px-6 md:py-6">
            <p className="text-[11px] font-bold uppercase text-white/40">The result</p>
            <p className="mt-2 font-quantico text-base font-bold italic text-white md:mt-3 md:text-lg">
              Not stimulant energy. Cognitive architecture — the kind of focus that
              holds for hours.
            </p>
            <Cite ids={SYNERGY_REFS} tone="dark" />
          </div>
        </div>
      </section>

      {/* ── Zero sugar ── */}
      <section className="bg-white dark:bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 md:px-14 md:py-32">
          <div className="md:text-center">
            <p className="type-k text-fg-muted">Formulation integrity</p>
            <h2 className="mt-3 font-quantico text-[1.375rem] font-bold italic text-ink dark:text-white md:mt-4 md:text-3xl">
              Zero Sugar. Zero Calories.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-fg-muted md:mt-6 md:text-[17px]">
              The most important numbers on the pack, and the least accidental.
              Sugar is not left out to make a label look good.
            </p>
          </div>

          <div className="mt-8 grid md:mt-16 md:grid-cols-2">
            <div className="bg-paper-50 dark:bg-paper-200 px-5 py-7 md:px-10 md:py-12">
              <p className="text-[11px] font-bold uppercase text-fg-subtle">What sugar does to your brain</p>
              <ul className="mt-4 space-y-4 md:mt-6 md:space-y-5">
                {SUGAR_COST.map((s) => (
                  <li key={s} className="flex gap-3 md:gap-4">
                    <span aria-hidden className="mt-2 h-px w-4 shrink-0 bg-paper-300" />
                    <span className="text-[14px] leading-relaxed text-fg-muted md:text-[15px]">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-ink px-5 py-7 text-white md:px-10 md:py-12">
              <p className="text-[11px] font-bold uppercase text-accent">What we sweeten with instead</p>
              <ul className="mt-4 space-y-4 md:mt-6 md:space-y-5">
                {SWEETENER.map((s) => (
                  <li key={s} className="flex gap-3 md:gap-4">
                    <span aria-hidden className="mt-2 h-[3px] w-3 shrink-0 bg-accent" />
                    <span className="text-[14px] leading-relaxed text-white/80 md:text-[15px]">{s}</span>
                  </li>
                ))}
              </ul>
              <Cite ids={LEFT_OUT_REFS} tone="dark" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Dosing ── */}
      <section className="bg-paper-50 dark:bg-paper-100">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 md:px-14 md:py-32">
          <p className="type-k text-fg-muted">Recommended use</p>
          <h2 className="mt-3 font-quantico text-[1.375rem] font-bold italic text-ink dark:text-white md:mt-4 md:text-3xl">
            Timing Is Part Of The Dose.
          </h2>

          <div className="mt-10 md:mt-20">
            {DOSING.map((d, i) => (
              <div key={d.n} className="flex gap-4 md:gap-10">
                <div className="flex flex-col items-center">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-ink md:h-10 md:w-10">
                    <span className="font-quantico text-xs font-bold italic text-accent md:text-sm">{d.n}</span>
                  </div>
                  {i < DOSING.length - 1 && <div className="w-px flex-1 bg-paper-300" />}
                </div>
                <div className={`${i < DOSING.length - 1 ? 'pb-8 md:pb-14' : 'pb-0'}`}>
                  <h3 className="font-quantico text-base font-bold italic text-ink dark:text-white md:text-xl">{d.title}</h3>
                  <p className="mt-2 max-w-lg text-[14px] leading-relaxed text-fg-muted md:mt-3 md:text-[15px]">{d.body}</p>
                </div>
              </div>
            ))}
          </div>
          <Cite ids={DOSING_REFS} />

          {/* Certifications */}
          <div className="mt-10 md:mt-24">
            <p className="text-[11px] font-bold uppercase text-ink dark:text-white">Safety &amp; certifications</p>
            <dl className="mt-4 grid gap-px bg-paper-300 md:mt-6 md:grid-cols-2">
              {CERTIFICATIONS.map((c) => (
                <div key={c.k} className="bg-white dark:bg-paper-200 px-5 py-5 md:px-8 md:py-6">
                  <dt className="text-[11px] font-bold uppercase text-fg-subtle">{c.k}</dt>
                  <dd className="mt-1.5 text-[14px] leading-relaxed text-ink dark:text-white md:mt-2 md:text-[15px]">{c.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="scroll-mt-24 bg-ink text-white">
        <div className="mx-auto max-w-4xl px-5 py-14 sm:px-8 md:py-32">
          <div className="text-center">
            <p className="type-k text-white/40">Questions</p>
            <h2 className="mt-3 font-quantico text-[1.375rem] font-bold italic text-white md:mt-4 md:text-3xl">
              The Ones Worth Asking.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[14px] leading-relaxed text-white/60 md:mt-6 md:text-[15px]">
              Including the awkward ones about sweeteners, sodium and how much
              caffeine is actually in here.
            </p>
          </div>

          <div className="mt-10 md:mt-20">
            {FAQS.map((f, i) => (
              <details key={f.q} open={i === 0} className="group border-t border-white/10">
                <summary className="flex cursor-pointer list-none items-center gap-3 py-5 md:gap-4 md:py-6">
                  <span aria-hidden className="relative flex h-5 w-5 shrink-0 items-center justify-center text-accent md:h-6 md:w-6">
                    <span className="absolute h-[2px] w-3 rounded-full bg-current md:h-[3px] md:w-4" />
                    <span className="absolute h-3 w-[2px] rounded-full bg-current transition-transform duration-200 group-open:scale-y-0 md:h-4 md:w-[3px]" />
                  </span>
                  <span className="font-quantico text-[13px] font-bold uppercase leading-snug text-white md:text-[15px]">
                    {f.q}
                  </span>
                </summary>
                <p className="max-w-2xl pb-6 pl-8 text-[14px] leading-relaxed text-white/70 md:pb-8 md:pl-10 md:text-[15px]">{withRupee(f.a)}</p>
              </details>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4 md:mt-14">
            <Link
              href="/products/10x-daytime"
              className="type-k inline-flex cursor-pointer items-center justify-center gap-2 bg-accent px-8 py-3.5 text-ink transition-colors hover:bg-accent-hover"
            >
              Shop 10X Daytime
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <Link
              href="/brain-fog"
              className="type-k inline-flex cursor-pointer items-center justify-center border border-white/30 px-8 py-3.5 text-white transition-colors hover:border-white"
            >
              Why the Fog Happens
            </Link>
          </div>
        </div>
      </section>

      {/* ── References ── */}
      <section id="references" className="scroll-mt-24 bg-ink text-white">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 md:px-14 md:py-32">
          <p className="type-k text-white/50">References</p>
          <h2 className="mt-3 max-w-2xl font-quantico text-[1.375rem] font-bold italic text-white md:mt-4 md:text-3xl">
            The Research Behind It.
          </h2>
          <p className="mt-4 max-w-lg text-[14px] leading-relaxed text-white/60 md:mt-6 md:text-[15px]">
            All references verified against PubMed, journal DOI records and
            open-access repositories.
          </p>

          <ol className="mt-8 md:mt-16">
            {REFERENCES.map((r) => (
              <ReferenceItem key={r.id} item={r} />
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
