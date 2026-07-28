const FAQS = [
  {
    q: 'What does 10X feel like?',
    a: 'Unlike sugary energy drinks that spike your heart rate or coffee that makes your hands shake, 10X creates a calm, clear space for focus. You feel fully awake and locked-in — without the jitters or aggressive stimulant rush.',
  },
  {
    q: 'Is 10X an energy drink?',
    a: 'No. 10X is whole-food nutrition, not a stimulant hit. It supports your brain with real, recognizable ingredients rather than forcing a spike followed by a crash.',
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
        <p className="type-k text-fg-muted">Before you ask</p>
        <h2 className="type-d2 mt-4 text-ink">Common questions about 10X</h2>

        <div className="mt-10 border-t border-paper-200">
          {FAQS.map((f, i) => (
            <details key={f.q} open={i === 0} className="group border-b border-paper-200">
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
