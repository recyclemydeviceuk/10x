const FAQS = [
  {
    q: 'What does 10X feel like?',
    a: 'Unlike sugary energy drinks that spike your heart rate or coffee that makes your hands shake, 10X creates a calm, clear space for focus. You feel fully awake and locked-in — without the jitters or aggressive stimulant rush.',
  },
  {
    q: 'Is 10X an energy drink?',
    a: 'No. 10X is engineered nutrition, not a stimulant hit. It supports your brain with real, recognizable ingredients rather than forcing a spike followed by a crash.',
  },
  {
    q: 'Does 10X contain caffeine?',
    a: 'It relies on whole-food ingredients like matcha for calm, sustained focus rather than harsh stimulants — so you get clean, controllable energy, not a hard caffeine jolt.',
  },
  {
    q: 'Will I crash after using it?',
    a: 'No spike, no slump. 10X is built for steady output from morning to evening, so there is no afternoon crash to manage.',
  },
  {
    q: 'Is it sugar-free?',
    a: 'Yes — no unnecessary sugar and no needless additives. Just the inputs your brain actually needs.',
  },
  {
    q: 'When should I take it?',
    a: 'Tear one sachet into a glass of water and drink it at the start of your day, or right before any deep-work block.',
  },
  {
    q: 'Can I use it daily?',
    a: 'Absolutely. 10X is designed as one simple daily protocol you can rely on every single day.',
  },
];

export default function ProductFAQ() {
  return (
    <section aria-label="Common questions" className="bg-white">
      <div className="mx-auto max-w-3xl px-6 py-20 sm:px-10 md:px-14 md:py-24">
        <div>
          <h2 className="font-condensed text-3xl font-black uppercase italic leading-[0.95] tracking-tight text-ink sm:text-4xl">
            Common Questions About 10X
          </h2>
          <span aria-hidden className="mt-3 block h-1 w-12 rounded-full bg-accent" />
        </div>

        <div className="mt-10 border-t border-paper-200">
          {FAQS.map((f) => (
            <details key={f.q} className="group border-b border-paper-200">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-quantico text-body font-bold uppercase tracking-wide text-fg">
                {f.q}
                <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-paper-300 text-brand-blue transition-transform duration-200 group-open:rotate-45">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </span>
              </summary>
              <p className="pb-6 font-pt text-body text-fg-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
