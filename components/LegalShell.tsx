import Link from 'next/link';

export type LegalSection = { heading: string; paragraphs: string[] };

export default function LegalShell({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <main id="main" className="bg-paper">
      {/* Hero band */}
      <section className="text-white" style={{ background: 'linear-gradient(120deg, #000204 0%, #02063A 40%, #0821D2 100%)' }}>
        <div className="mx-auto max-w-3xl px-6 pb-12 pt-28 sm:px-10 md:px-14 md:pb-16 md:pt-36">
          <p className="font-quantico text-caption font-bold uppercase tracking-[0.2em] text-accent">Legal</p>
          <h1 className="mt-4 font-condensed text-[clamp(2.25rem,6vw,4rem)] font-black uppercase italic leading-[0.9] tracking-tight">
            {title}
          </h1>
          <p className="mt-4 font-pt text-body-sm text-white/70">Last updated: {updated}</p>
        </div>
      </section>

      {/* Body */}
      <article className="mx-auto max-w-3xl px-6 py-14 sm:px-10 md:px-14 md:py-20">
        <p className="font-pt text-body-lg leading-relaxed text-fg-muted">{intro}</p>

        <div className="mt-10 space-y-10">
          {sections.map((s, i) => (
            <section key={s.heading}>
              <h2 className="font-quantico text-body-lg font-bold uppercase tracking-wide text-fg">
                <span className="mr-2 text-fg-subtle">{String(i + 1).padStart(2, '0')}</span>
                {s.heading}
              </h2>
              <div className="mt-3 space-y-3 border-l-2 border-paper-200 pl-5">
                {s.paragraphs.map((p, j) => (
                  <p key={j} className="font-pt text-body leading-relaxed text-fg-muted">{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 border-t border-paper-200 pt-8">
          <p className="font-pt text-body text-fg-muted">
            Questions about this policy?{' '}
            <Link href="/contact" className="font-bold text-brand-blue transition-opacity hover:opacity-70">
              Get in touch
            </Link>
            .
          </p>
        </div>
      </article>
    </main>
  );
}
