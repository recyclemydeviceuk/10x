import type { Metadata } from 'next';
import Link from 'next/link';

import {
  CAUSES,
  COFFEE_VS_STACK,
  DEFINITION,
  FATIGUE_VS_FOG,
  HACKS,
  REFERENCES,
  type Reference,
} from './content';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://10xdrink.com';

export const metadata: Metadata = {
  title: 'Brain Fog',
  description:
    'What brain fog actually is, the seven things that cause it — inflammation, sleep debt, B-vitamin deficiency, cortisol, dehydration, the gut–brain axis and the post-lunch dip — and what the research says about fixing the root rather than the symptom.',
  keywords: [
    'brain fog India',
    'how to cure brain fog',
    'brain fog causes',
    'brain fog after lunch',
    'nootropics India',
    'focus drink India',
    'caffeine without crash',
    'natural energy drink India',
  ],
  alternates: { canonical: '/brain-fog' },
  openGraph: {
    type: 'article',
    url: `${SITE_URL}/brain-fog`,
    title: 'Brain Fog — what it is, and the seven things causing yours',
    description:
      'You are not distracted. Your brain is running out of fuel. The neuroscience of brain fog, with the studies attached.',
  },
};

const REF_BY_ID = new Map(REFERENCES.map((r) => [r.id, r]));

function Cite({ ids, tone = 'light' }: { ids: string[]; tone?: 'light' | 'dark' }) {
  return (
    <p className={`mt-4 text-[12px] md:text-[13px] ${tone === 'dark' ? 'text-white/45' : 'text-fg-subtle'}`}>
      <span className="sr-only">Cited studies: </span>
      {ids.map((id, i) => {
        const ref = REF_BY_ID.get(id);
        if (!ref) return null;
        const short = `${ref.authors.split(',')[0]} ${ref.year}`;
        return (
          <span key={id}>
            {i > 0 && <span aria-hidden> · </span>}
            <a
              href={`#ref-${id}`}
              className={`cursor-pointer underline decoration-dotted underline-offset-4 transition-colors ${
                tone === 'dark' ? 'hover:text-accent' : 'hover:text-accent-pressed'
              }`}
            >
              {short}
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
      <p className="type-k text-fg-subtle">
        {item.authors} <span className="tracking-normal">({item.year})</span>
      </p>
      <div className="mt-1 md:mt-0">
        <p className="text-[14px] leading-relaxed text-ink dark:text-white md:text-[15px]">{item.title}</p>
        <p className="mt-1 text-[12px] leading-relaxed text-fg-muted md:text-[13px]">
          {item.source}
          {item.locator && <span className="text-fg-subtle"> · {item.locator}</span>}
          {item.href && (
            <>
              {' · '}
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer text-accent-pressed underline underline-offset-4"
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

function DayCurve() {
  return (
    <svg viewBox="0 0 720 300" className="h-auto w-full" role="img" aria-label="Illustrative curve: cognitive output across a working day, with and without a morning protocol">
      <g stroke="currentColor" strokeOpacity="0.12" strokeWidth="1">
        <line x1="40" y1="40" x2="700" y2="40" />
        <line x1="40" y1="105" x2="700" y2="105" />
        <line x1="40" y1="170" x2="700" y2="170" />
      </g>
      <line x1="40" y1="235" x2="700" y2="235" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />
      <rect x="392" y="30" width="86" height="205" fill="currentColor" fillOpacity="0.05" />
      <text x="435" y="24" textAnchor="middle" fill="currentColor" fillOpacity="0.5" fontSize="11" letterSpacing="2">
        2–3 PM
      </text>
      <path
        d="M40 150 C110 96 170 78 250 74 C320 71 360 82 400 120 C430 150 450 196 480 206 C540 222 620 216 700 210"
        fill="none" stroke="currentColor" strokeOpacity="0.45" strokeWidth="2.5" strokeDasharray="6 7" strokeLinecap="round"
      />
      <path
        d="M40 150 C110 88 170 66 250 60 C330 55 380 60 440 72 C520 88 620 96 700 100"
        fill="none" stroke="#6DE325" strokeWidth="4" strokeLinecap="round"
      />
      <circle cx="700" cy="100" r="5" fill="#6DE325" />
      <g fill="currentColor" fillOpacity="0.5" fontSize="11" letterSpacing="2">
        <text x="40" y="258">8 AM</text>
        <text x="360" y="258" textAnchor="middle">1 PM</text>
        <text x="700" y="258" textAnchor="end">7 PM</text>
      </g>
    </svg>
  );
}

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Brain fog: what it is, and the seven things causing yours',
  description:
    'The neuroscience of brain fog — impaired neurotransmitter signalling and inflammatory interference — and the seven common causes, with peer-reviewed references.',
  author: { '@type': 'Organization', name: '10X' },
  publisher: { '@type': 'Organization', name: '10X' },
  mainEntityOfPage: `${SITE_URL}/brain-fog`,
  citation: REFERENCES.map((r) => `${r.authors} (${r.year}). ${r.title}. ${r.source}.`),
};

export default function BrainFogPage() {
  return (
    <main id="main" className="bg-white dark:bg-paper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* ── Hero ── */}
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-4xl px-5 pb-14 pt-28 text-center sm:px-8 md:pb-28 md:pt-44">
          <p className="type-k text-accent">Brain Fog</p>
          <h1 className="mx-auto mt-4 max-w-2xl font-quantico text-[1.75rem] font-bold italic leading-tight text-white sm:text-3xl md:type-d2">
            You&rsquo;re Not Distracted.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/70 md:mt-6 md:text-[17px]">
            Your brain is running out of fuel.{' '}
            <span className="font-bold text-white">
              Brain fog is a real neurological state, not a discipline problem
            </span>{' '}
            — and it has causes you can name, measure and do something about.
          </p>
        </div>
      </section>

      {/* stat strip */}
      <section className="bg-paper-50 dark:bg-paper-100">
        <div className="mx-auto grid max-w-5xl grid-cols-2 sm:grid-cols-4">
          {[
            { k: 'Causes covered', v: '07' },
            { k: 'Morning fixes', v: '05' },
            { k: 'Studies cited', v: String(REFERENCES.length) },
            { k: 'Reading time', v: '9 min' },
          ].map((s) => (
            <div key={s.k} className="px-4 py-5 text-center md:px-5 md:py-8">
              <p className="text-[10px] font-bold uppercase text-fg-muted md:type-k">{s.k}</p>
              <p className="mt-1.5 font-quantico text-xl font-bold italic text-ink dark:text-white md:mt-2 md:text-2xl">{s.v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 01 Definition ── */}
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 md:px-14 md:py-32">
        <p className="type-k text-fg-muted">01 — The definition</p>
        <h2 className="mt-3 font-quantico text-[1.375rem] font-bold italic text-ink dark:text-white md:mt-4 md:text-3xl">
          A Real Neurological State.
        </h2>

        <div className="mt-8 grid gap-10 md:mt-16 md:grid-cols-2 md:gap-20">
          <div>
            <p className="type-k text-fg-subtle">What it isn&rsquo;t</p>
            <ul className="mt-4 space-y-4 md:mt-6 md:space-y-5">
              {DEFINITION.isNot.map((item) => (
                <li key={item} className="flex gap-3 md:gap-4">
                  <span aria-hidden className="mt-2 h-px w-4 shrink-0 bg-paper-300" />
                  <p className="text-[15px] leading-relaxed text-fg-muted md:text-[17px]">{item}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="type-k text-accent-pressed">What it is</p>
            <ul className="mt-4 space-y-4 md:mt-6 md:space-y-5">
              {DEFINITION.is.map((item) => (
                <li key={item} className="flex gap-3 md:gap-4">
                  <span aria-hidden className="mt-2 h-[3px] w-4 shrink-0 bg-accent" />
                  <p className="text-[15px] leading-relaxed text-ink dark:text-white md:text-[17px]">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* fatigue vs fog */}
        <div className="mt-10 grid gap-px bg-paper-200 md:mt-20 md:grid-cols-2">
          {FATIGUE_VS_FOG.map((row) => (
            <div key={row.label} className="bg-paper-50 dark:bg-paper-200 px-5 py-7 md:px-10 md:py-12">
              <h3 className="font-quantico text-lg font-bold italic text-ink dark:text-white md:text-xl">{row.label}</h3>
              <p className="mt-3 max-w-md text-[14px] leading-relaxed text-fg-muted md:mt-4 md:text-[15px]">{row.body}</p>
            </div>
          ))}
        </div>
        <Cite ids={['theoharides-2015', 'spencer-2017']} />
      </section>

      {/* ── 02 The 3PM wall ── */}
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 md:px-14 md:py-32">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-20">
            <div className="lg:w-[38%]">
              <p className="type-k text-white/50">02 — The pattern</p>
              <h2 className="mt-3 font-quantico text-[1.375rem] font-bold italic text-white md:mt-4 md:text-3xl">
                The 3 PM Wall.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-white/80 md:mt-6 md:text-[17px]">
                India&rsquo;s hardest-working desks lose the back half of the
                afternoon to the same curve, every day. Adenosine has been building
                since morning, lunch lands on a circadian trough, and the work you
                planned for 3pm quietly moves to 9pm.
              </p>
              <div className="mt-6 space-y-2 md:mt-8 md:space-y-3">
                <div className="flex items-center gap-3">
                  <span className="h-1 w-6 shrink-0 bg-accent md:w-8" />
                  <span className="type-k text-white">With a morning protocol</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="h-0 w-6 shrink-0 border-t-2 border-dashed border-white/45 md:w-8" />
                  <span className="type-k text-white/50">A typical day</span>
                </div>
              </div>
              <Cite ids={['monk-2005', 'benton-2003']} tone="dark" />
            </div>
            <div className="lg:w-[62%]">
              <div className="border border-white/10 p-4 text-white md:p-10">
                <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between md:mb-6">
                  <span className="type-k text-white/50">Cognitive output</span>
                  <span className="type-k text-white/50">Across a working day</span>
                </div>
                <DayCurve />
                <p className="mt-3 text-[11px] text-white/40 md:mt-5 md:text-[13px]">
                  Illustrative — the shape of the effect, not measured data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 03 Seven causes ── */}
      <section className="bg-paper-50 dark:bg-paper-100">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 md:px-14 md:py-32">
          <div className="text-center">
            <p className="type-k text-fg-muted">03 — Enemy identification</p>
            <h2 className="mx-auto mt-3 max-w-xl font-quantico text-[1.375rem] font-bold italic text-ink dark:text-white md:mt-4 md:text-3xl">
              Seven Things Causing Yours.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-fg-muted md:mt-6 md:text-[17px]">
              Rarely just one. Usually three of them at once, which is why single
              fixes disappoint.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:mt-20 md:grid-cols-2 md:gap-6">
            {CAUSES.map((c) => (
              <article key={c.n} className="flex bg-white dark:bg-paper-200">
                <div className="w-1 shrink-0 bg-accent" />
                <div className="flex-1 px-4 py-5 md:px-9 md:py-10">
                  <div className="flex items-baseline gap-2 md:gap-3">
                    <span className="font-quantico text-xl font-bold italic text-accent/40 md:text-2xl">{c.n}</span>
                    <h3 className="type-k text-ink dark:text-white">{c.title}</h3>
                  </div>
                  <p className="mt-3 font-quantico text-base font-bold italic text-ink dark:text-white md:mt-4 md:text-lg">{c.hook}</p>
                  <p className="mt-2 text-[14px] leading-relaxed text-fg-muted md:mt-3 md:text-[15px]">{c.body}</p>
                  <ul className="mt-4 space-y-2 md:mt-5">
                    {c.mechanism.map((m) => (
                      <li key={m} className="flex gap-2 md:gap-3">
                        <span aria-hidden className="mt-2 h-[3px] w-3 shrink-0 bg-accent" />
                        <span className="text-[13px] leading-relaxed text-ink dark:text-white md:text-[14px]">{m}</span>
                      </li>
                    ))}
                  </ul>
                  <Cite ids={c.refIds} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 04 Coffee vs stack ── */}
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 md:px-14 md:py-32">
        <div className="md:text-center">
          <p className="type-k text-fg-muted">04 — The usual fix, examined</p>
          <h2 className="mt-3 font-quantico text-[1.375rem] font-bold italic text-ink dark:text-white md:mt-4 md:text-3xl">
            Coffee Wakes You Up.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-ink dark:text-white md:mt-6 md:text-[17px]">
            It does exactly what it says on the tin — and nothing more.{' '}
            <span className="font-bold">
              Alertness is not the same thing as sharpness.
            </span>
          </p>
        </div>

        <div className="mt-8 grid md:mt-16 md:grid-cols-2">
          <div className="bg-paper-50 dark:bg-paper-200 px-5 py-7 md:px-10 md:py-12">
            <p className="type-k text-fg-subtle">Caffeine alone</p>
            <ul className="mt-4 space-y-3 md:mt-6 md:space-y-4">
              {COFFEE_VS_STACK.coffee.map((item) => (
                <li key={item} className="text-[14px] leading-relaxed text-fg-muted md:text-[15px]">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-ink px-5 py-7 text-white md:px-10 md:py-12">
            <p className="type-k text-accent">Caffeine + amino acids</p>
            <ul className="mt-4 space-y-3 md:mt-6 md:space-y-4">
              {COFFEE_VS_STACK.stack.map((item) => (
                <li key={item} className="text-[14px] leading-relaxed text-white/80 md:text-[15px]">
                  {item}
                </li>
              ))}
            </ul>
            <Cite ids={COFFEE_VS_STACK.refIds} tone="dark" />
          </div>
        </div>
      </section>

      {/* ── 05 Five hacks ── */}
      <section className="bg-paper-50 dark:bg-paper-100">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 md:px-14 md:py-32">
          <p className="type-k text-fg-muted">05 — The solution pathway</p>
          <h2 className="mt-3 font-quantico text-[1.375rem] font-bold italic text-ink dark:text-white md:mt-4 md:text-3xl">
            Five Things Before 9 AM.
          </h2>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-fg-muted md:mt-6 md:text-[17px]">
            The first ninety minutes set the ceiling for the rest of the day. None
            of these is difficult; all of them are easy to skip.
          </p>

          <div className="mt-10 space-y-4 md:mt-20 md:space-y-6">
            {HACKS.map((h) => (
              <div key={h.n} className="flex bg-white dark:bg-paper-200">
                <div className="flex w-14 shrink-0 items-center justify-center bg-ink md:w-24">
                  <span className="font-quantico text-xl font-bold italic text-accent md:text-3xl">{h.n}</span>
                </div>
                <div className="flex-1 px-4 py-5 md:px-9 md:py-8">
                  <h3 className="font-quantico text-base font-bold italic text-ink dark:text-white md:text-lg">{h.title}</h3>
                  <p className="mt-2 max-w-lg text-[14px] leading-relaxed text-fg-muted md:text-[15px]">{h.body}</p>
                  <Cite ids={[h.refId]} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 06 Where 10X fits ── */}
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-4xl px-5 py-14 text-center sm:px-8 md:py-32">
          <p className="type-k text-white/50">06 — Where 10X fits</p>
          <h2 className="mx-auto mt-3 max-w-xl font-quantico text-[1.375rem] font-bold italic text-white md:mt-4 md:text-3xl">
            The Root, Not The Symptom.
          </h2>

          <div className="mx-auto mt-8 grid max-w-3xl gap-6 text-left md:mt-10 md:grid-cols-2 md:gap-16">
            <p className="text-[15px] leading-relaxed text-white/80 md:text-[17px]">
              A stimulant addresses the feeling of fog. Four of the seven causes
              above are input problems — B-vitamins, amino acids, electrolytes,
              oxidative load — and those respond to being fed, not overridden.
            </p>
            <p className="text-[15px] leading-relaxed text-white/80 md:text-[17px]">
              That is the whole design brief for the sachet: 80mg of caffeine so
              the alertness is there, and six other actives so it is the useful
              kind. What is in it, and why, is set out in full on the next page.
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4 md:mt-16">
            <Link
              href="/whats-in-it"
              className="type-k inline-flex cursor-pointer items-center justify-center gap-2 bg-accent px-8 py-3.5 text-ink transition-colors hover:bg-accent-hover"
            >
              See the Formulation
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <Link
              href="/products/10x-daytime"
              className="type-k inline-flex cursor-pointer items-center justify-center border border-white/30 px-8 py-3.5 text-white transition-colors hover:border-white"
            >
              Shop 10X Daytime
            </Link>
          </div>

          <p className="mx-auto mt-10 max-w-xl text-[13px] leading-relaxed text-white/40 md:mt-12 md:text-[14px]">
            One caveat we would rather volunteer than bury: persistent fog also
            has causes a drink has no business near — thyroid, iron, sleep apnoea,
            medication, burnout. If it has been weeks rather than afternoons,
            please see a doctor first.
          </p>
        </div>
      </section>

      {/* ── References ── */}
      <section id="references" className="scroll-mt-24 bg-white dark:bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 md:px-14 md:py-32">
          <p className="type-k text-fg-muted">References</p>
          <h2 className="mt-3 font-quantico text-[1.375rem] font-bold italic text-ink dark:text-white md:mt-4 md:text-3xl">
            Everything Above, Sourced.
          </h2>
          <p className="mt-4 max-w-lg text-[14px] leading-relaxed text-fg-muted md:mt-6 md:text-[15px]">
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
