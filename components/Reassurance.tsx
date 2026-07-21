import type { ReactNode } from 'react';

/**
 * SECTION 4 — REASSURANCE (FAQ — the objection each buyer picks)
 *
 * Typographic and calm — no imagery. The only motion is a green "+" that
 * collapses to a "−" when a question opens. First question open by default,
 * ordered by how much each doubt threatens the sale.
 *
 * Type map (per brand kit):
 *   "BEFORE YOU ASK"                    → K
 *   "IS THIS JUST ANOTHER ENERGY DRINK?"→ D2
 *   "Short answer: no…"                 → B1
 *   each question ("Will I crash later?")→ D3
 *   each answer                          → B2, key phrases in green
 */

/** Green key phrase — a colour on top, never a font change. */
function G({ children }: { children: ReactNode }) {
  return <span className="font-bold text-accent-pressed">{children}</span>;
}

type QA = { q: string; a: ReactNode };

const FAQS: QA[] = [
  {
    q: 'Will I crash later?',
    a: (
      <>
        No. Energy drinks give you a spike then a crash — a borrowed hour paid
        back with interest. 10X doesn&rsquo;t override your brain, it{' '}
        <G>feeds it</G>. There&rsquo;s no high to come down from, which is why
        users describe &ldquo;a quietly better afternoon&rdquo; rather than a hit.
      </>
    ),
  },
  {
    q: 'Wait, is there caffeine in it?',
    a: (
      <>
        Yes — about <G>80mg, roughly one cup of tea.</G> A quarter of what&rsquo;s
        in an energy drink. We&rsquo;re not pretending your brain doesn&rsquo;t
        like a little caffeine — we just refuse to overdo it.{' '}
        <G>A familiar dose, not a hit.</G> (Not for the caffeine-sensitive.)
      </>
    ),
  },
  {
    q: 'What’s actually in it?',
    a: (
      <>
        Amino acids and vitamins your body already knows from food — tyrosine,
        taurine, B-vitamins, green tea extract — <G>in the forms your body
        actually absorbs.</G> No harsh stimulants, no unnecessary additives. Full
        label on every can.
      </>
    ),
  },
  {
    q: 'So what’s "brain fog," then?',
    a: (
      <>
        That 3pm haze where you read the same line three times. It&rsquo;s not a
        condition — it&rsquo;s your brain <G>running low on the right fuel</G>{' '}
        (often while running high on the wrong one, like a fourth coffee). 10X
        gives it what it recognises, so you outlast the dip instead of medicating
        it.
      </>
    ),
  },
  {
    q: 'How and when do I take it?',
    a: (
      <>
        One sachet in 200ml water, earlier in the day. Twice on days that demand
        more. Some settling is normal — swirl and drink. Avoid close to bedtime
        (that&rsquo;s what <G>10X Nighttime</G> is for).
      </>
    ),
  },
];

export default function Reassurance() {
  return (
    <section
      id="reassurance"
      aria-label="Before you ask"
      className="bg-white"
    >
      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20 md:px-14 md:py-28">
        <p className="type-k text-fg-muted">Before you ask</p>
        <h2 className="type-d2 mt-4 text-ink">Is this just another energy drink?</h2>
        <p className="type-b1 mt-5 text-ink">
          Short answer: no. Long answer — pick whichever doubt is yours.
        </p>

        <div className="mt-10 border-t border-paper-200">
          {FAQS.map((f, i) => (
            <details
              key={f.q}
              open={i === 0}
              className="group border-b border-paper-200"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 text-ink">
                <span className="type-d3">{f.q}</span>
                {/* Green "+" → "−" on open */}
                <span
                  aria-hidden
                  className="relative flex h-6 w-6 shrink-0 items-center justify-center text-accent-pressed"
                >
                  <span className="absolute h-0.5 w-3.5 rounded-full bg-current" />
                  <span className="absolute h-3.5 w-0.5 rounded-full bg-current transition-transform duration-200 group-open:scale-y-0" />
                </span>
              </summary>
              <p className="type-b2 max-w-2xl pb-6 text-fg-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
