import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Design System',
  description:
    'Visual design system for 10X — colors, typography, components, and tokens used to build the brand experience.',
  alternates: { canonical: '/design-system' },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

/* =========================================================
   Token data
   ========================================================= */

const colorGroups: {
  group: string;
  description: string;
  swatches: { name: string; hex: string; usage: string; textOn?: 'light' | 'dark' }[];
}[] = [
  {
    group: 'Surfaces — Ink (dark)',
    description:
      'True ink and charcoal — used for hero, "TAKE CHARGE" section, and footer band.',
    swatches: [
      { name: 'ink', hex: '#000204', usage: 'Primary dark surface', textOn: 'dark' },
      { name: 'ink.900', hex: '#0A0C12', usage: 'Slightly lifted dark', textOn: 'dark' },
      { name: 'ink.800 / charcoal', hex: '#2E2E2E', usage: 'Elevated dark / borders', textOn: 'dark' },
      { name: 'ink.700', hex: '#3A3A3A', usage: 'Card on dark', textOn: 'dark' },
    ],
  },
  {
    group: 'Surfaces — Paper (light)',
    description: 'White and neutral panels for content and white sections.',
    swatches: [
      { name: 'paper', hex: '#FFFFFF', usage: 'Default page bg', textOn: 'light' },
      { name: 'paper.50', hex: '#FAFAFA', usage: 'Subtle off-white', textOn: 'light' },
      { name: 'paper.100', hex: '#F4F5F7', usage: 'Neutral panel', textOn: 'light' },
      { name: 'paper.200', hex: '#E5E7EB', usage: 'Divider / border', textOn: 'light' },
    ],
  },
  {
    group: 'Accent — Brand Lime',
    description: 'Single hero accent. Used on CTAs, icons, highlights, badges.',
    swatches: [
      { name: 'accent', hex: '#CDE633', usage: 'Default CTA / highlight', textOn: 'light' },
      { name: 'accent.hover', hex: '#B8D12A', usage: 'Hover state', textOn: 'light' },
      { name: 'accent.pressed', hex: '#A3BC20', usage: 'Pressed state', textOn: 'light' },
      { name: 'accent.glow', hex: '#E0F55A', usage: 'Glow / soft accent', textOn: 'light' },
    ],
  },
  {
    group: 'Brand — Electric Blue',
    description: 'Royal blue used as the dramatic backdrop for the "BENEFITS OF 10X" panel.',
    swatches: [
      { name: 'brand.blue', hex: '#06189E', usage: 'Hero / feature panel bg', textOn: 'dark' },
      { name: 'brand.blue.dark', hex: '#040F66', usage: 'Gradient stop / pressed', textOn: 'dark' },
      { name: 'brand.blue.light', hex: '#1E34C0', usage: 'Hover / link', textOn: 'dark' },
      { name: 'brand.blue.soft', hex: '#E5E9F8', usage: 'Soft tint surface', textOn: 'light' },
    ],
  },
  {
    group: 'Pastel — Category Cards',
    description: 'Soft tints for "Pour / Mix / Drink" feature cards.',
    swatches: [
      { name: 'pastel.lime', hex: '#E8F5C0', usage: 'POUR IT card', textOn: 'light' },
      { name: 'pastel.lavender', hex: '#E4DDF2', usage: 'MIX IT card', textOn: 'light' },
      { name: 'pastel.blush', hex: '#F4DDE3', usage: 'DRINK IT card', textOn: 'light' },
    ],
  },
  {
    group: 'Foreground — Text',
    description: 'Typography colors paired with surfaces above.',
    swatches: [
      { name: 'fg', hex: '#000204', usage: 'Primary text on light', textOn: 'dark' },
      { name: 'fg.muted', hex: '#6B7280', usage: 'Secondary text', textOn: 'light' },
      { name: 'fg.subtle', hex: '#9CA3AF', usage: 'Tertiary text', textOn: 'light' },
      { name: 'fg.inverse', hex: '#FFFFFF', usage: 'Text on dark', textOn: 'light' },
      { name: 'fg.inverse-muted', hex: '#B0B5C0', usage: 'Sub-copy on dark', textOn: 'light' },
    ],
  },
];

const typographyScale = [
  { name: 'display-2xl', sample: 'The Brain Battery', cls: 'text-display-2xl' },
  { name: 'display-xl', sample: 'Take Charge. Own The Day.', cls: 'text-display-xl' },
  { name: 'display-lg', sample: 'Benefits of 10X', cls: 'text-display-lg' },
  { name: 'display-md', sample: 'How It Works', cls: 'text-display-md' },
  { name: 'body-lg', sample: 'Pocket-sized nourishment that revitalises starved brains around the clock.', cls: 'text-body-lg' },
  { name: 'body', sample: 'Focus, clarity, and control — without spikes or crashes. 10X is brain nourishment, not an override.', cls: 'text-body' },
  { name: 'body-sm', sample: 'Pack of 2 (60ml) — ₹299.00', cls: 'text-body-sm' },
  { name: 'overline', sample: 'AVAILABLE AT', cls: 'text-overline' },
  { name: 'caption', sample: 'Empty one sachet into water', cls: 'text-caption' },
];

const fontFamilies = [
  { label: 'Helvetica', cls: 'font-sans', sample: 'Pocket-Sized Brain Nourishment 0123456789' },
  { label: 'Helvetica Display', cls: 'font-display', sample: 'THE BRAIN BATTERY' },
  { label: 'Helvetica Condensed', cls: 'font-condensed', sample: 'TAKE CHARGE. OWN THE DAY.' },
  { label: 'Nimbus Sans', cls: 'font-nimbus', sample: 'FOCUS. CLARITY. CONTROL.' },
  { label: 'PT Sans (CDN)', cls: 'font-pt', sample: 'Built for real life. Not just gyms.' },
];

const radii = [
  { name: 'sm', value: '4px', cls: 'rounded-sm' },
  { name: 'DEFAULT', value: '8px', cls: 'rounded' },
  { name: 'md', value: '12px', cls: 'rounded-md' },
  { name: 'lg', value: '16px', cls: 'rounded-lg' },
  { name: 'xl', value: '20px', cls: 'rounded-xl' },
  { name: '2xl', value: '28px', cls: 'rounded-2xl' },
  { name: 'full', value: '9999px', cls: 'rounded-full' },
];

const shadows = [
  { name: 'card', cls: 'shadow-card', desc: 'Default card elevation' },
  { name: 'elevated', cls: 'shadow-elevated', desc: 'Modal / sticky bar' },
  { name: 'glow', cls: 'shadow-glow', desc: 'Lime hover glow' },
  { name: 'glow-soft', cls: 'shadow-glow-soft', desc: 'Subtle accent glow' },
];

const spacingTokens = [
  { name: 'gutter', value: '1.5rem (24px)', size: 24 },
  { name: 'section-sm', value: '4rem (64px)', size: 64 },
  { name: 'section', value: '6rem (96px)', size: 96 },
];

/* =========================================================
   Section helpers
   ========================================================= */

function Section({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="section border-t border-paper-200">
      <div className="container-10x">
        <header className="mb-10 max-w-prose">
          <p className="eyebrow text-accent-pressed">{eyebrow}</p>
          <h2 className="mt-3 text-display-md font-display">{title}</h2>
          {description && <p className="mt-3 text-body text-fg-muted">{description}</p>}
        </header>
        {children}
      </div>
    </section>
  );
}

function Swatch({
  name,
  hex,
  usage,
  textOn = 'light',
}: {
  name: string;
  hex: string;
  usage: string;
  textOn?: 'light' | 'dark';
}) {
  return (
    <div className="rounded-lg overflow-hidden border border-paper-200 bg-paper">
      <div
        className="h-24 flex items-end p-3"
        style={{ backgroundColor: hex }}
      >
        <span
          className={`text-caption font-bold ${
            textOn === 'dark' ? 'text-fg-inverse' : 'text-fg'
          }`}
        >
          {hex.toUpperCase()}
        </span>
      </div>
      <div className="p-3">
        <p className="text-body-sm font-bold text-fg">{name}</p>
        <p className="text-caption text-fg-muted mt-0.5">{usage}</p>
      </div>
    </div>
  );
}

/* =========================================================
   Page
   ========================================================= */

export default function DesignSystemPage() {
  return (
    <main className="bg-paper text-fg">
      {/* ============== HEADER ============== */}
      <header className="bg-ink text-fg-inverse">
        <div className="container-10x py-section-sm md:py-section">
          <p className="eyebrow text-accent">10X — The Brain Battery</p>
          <h1 className="mt-4 font-display text-display-2xl">
            Design <span className="text-accent">System</span>
          </h1>
          <p className="mt-6 max-w-prose text-body-lg text-fg-inverse-muted">
            Visual language, tokens, and primitives extracted from the brand reference.
            Built on Helvetica, Helvetica Display, Helvetica Condensed, Nimbus Sans, and
            PT Sans (loaded from Google Fonts CDN).
          </p>

          <nav aria-label="Sections" className="mt-10 flex flex-wrap gap-3">
            {[
              ['Colors', '#colors'],
              ['Typography', '#typography'],
              ['Fonts', '#fonts'],
              ['Buttons', '#buttons'],
              ['Cards', '#cards'],
              ['Radii', '#radii'],
              ['Shadows', '#shadows'],
              ['Spacing', '#spacing'],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="rounded-full border border-fg-inverse-muted/30 px-4 py-2 text-body-sm text-fg-inverse-muted transition-colors hover:border-accent hover:text-accent"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* ============== COLORS ============== */}
      <Section
        id="colors"
        eyebrow="01 — Colors"
        title="Color Palette"
        description="A grounded dark-and-white system with one electric lime accent and three soft pastels for category cards."
      >
        <div className="space-y-12">
          {colorGroups.map((g) => (
            <div key={g.group}>
              <h3 className="text-body-lg font-bold">{g.group}</h3>
              <p className="mt-1 text-body-sm text-fg-muted">{g.description}</p>
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {g.swatches.map((s) => (
                  <Swatch key={s.name} {...s} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ============== TYPOGRAPHY SCALE ============== */}
      <Section
        id="typography"
        eyebrow="02 — Typography"
        title="Type Scale"
        description="Display sizes use fluid clamp() so headlines stay impactful from mobile to desktop. Body sizes follow a 1.125 ratio."
      >
        <div className="space-y-8">
          {typographyScale.map((t) => (
            <div
              key={t.name}
              className="grid items-baseline gap-4 border-b border-paper-200 pb-6 md:grid-cols-[180px_1fr]"
            >
              <div>
                <code className="text-caption font-bold uppercase tracking-widest text-accent-pressed">
                  {t.name}
                </code>
              </div>
              <p className={`${t.cls} font-display text-fg`}>{t.sample}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ============== FONT FAMILIES ============== */}
      <Section
        id="fonts"
        eyebrow="03 — Fonts"
        title="Font Families"
        description="Helvetica, Helvetica Display, Helvetica Condensed, and Nimbus Sans are self-hosted from /fonts. PT Sans is pulled from the Google Fonts CDN."
      >
        <div className="space-y-6">
          {fontFamilies.map((f) => (
            <div key={f.label} className="rounded-lg border border-paper-200 p-6">
              <div className="flex items-center justify-between gap-4">
                <p className="text-body-sm font-bold uppercase tracking-widest text-fg-muted">
                  {f.label}
                </p>
                <code className="text-caption text-fg-subtle">{f.cls}</code>
              </div>
              <p className={`${f.cls} mt-4 text-display-md`}>{f.sample}</p>
              <div className={`${f.cls} mt-4 flex flex-wrap gap-x-8 gap-y-2 text-body`}>
                <span className="font-light">Light 300</span>
                <span className="font-normal">Regular 400</span>
                <span className="font-medium">Medium 500</span>
                <span className="font-bold">Bold 700</span>
                <span className="font-black">Black 900</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ============== BUTTONS ============== */}
      <Section
        id="buttons"
        eyebrow="04 — Components"
        title="Buttons"
        description="Pill CTAs that match the reference. Accent for primary, ghost-on-dark for secondary."
      >
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-lg border border-paper-200 bg-paper-100 p-8">
            <p className="eyebrow mb-6">On light</p>
            <div className="flex flex-wrap items-center gap-4">
              <button type="button" className="btn-accent">Get Started</button>
              <button type="button" className="btn-accent">Buy Now →</button>
            </div>
          </div>
          <div className="rounded-lg bg-ink p-8">
            <p className="eyebrow mb-6 text-fg-inverse-muted">On dark</p>
            <div className="flex flex-wrap items-center gap-4">
              <button type="button" className="btn-accent">Shop Now</button>
              <button type="button" className="btn-ghost-dark">See How It Works</button>
            </div>
          </div>
        </div>
      </Section>

      {/* ============== CARDS ============== */}
      <Section
        id="cards"
        eyebrow="05 — Components"
        title="Pastel Category Cards"
        description="The Pour / Mix / Drink card pattern from the reference."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { tag: '01', title: 'Pour It', body: 'Empty one sachet into water.', bg: 'bg-pastel-lime' },
            { tag: '02', title: 'Mix It', body: 'Stir well until fully dissolved.', bg: 'bg-pastel-lavender' },
            { tag: '03', title: 'Drink It', body: 'Drink & feel the 10X difference.', bg: 'bg-pastel-blush' },
          ].map((c) => (
            <div
              key={c.tag}
              className={`${c.bg} rounded-lg p-8 min-h-[260px] flex flex-col`}
            >
              <p className="text-overline text-fg-muted">{c.tag}</p>
              <h3 className="mt-2 font-condensed text-display-md uppercase tracking-tight">
                {c.title}
              </h3>
              <p className="mt-auto text-body-sm text-fg">{c.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {/* Product card */}
          <div className="rounded-lg border border-paper-200 bg-paper p-6 shadow-card">
            <div className="aspect-[4/3] rounded-md bg-paper-100 flex items-center justify-center">
              <span className="font-display font-black text-display-lg text-fg/20">10X</span>
            </div>
            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-body-lg font-bold">10X Daytime</h3>
                <p className="text-body-sm text-fg-muted">The Brain Battery — Pack of 10</p>
                <p className="mt-2 text-body-lg font-bold">₹799.00</p>
              </div>
              <button type="button" className="btn-accent">Add</button>
            </div>
          </div>

          {/* Testimonial card */}
          <figure className="rounded-lg border border-paper-200 bg-paper p-6 shadow-card">
            <div className="text-display-md font-display text-accent leading-none">"</div>
            <blockquote className="mt-2 text-body text-fg">
              10X Daytime helps me stay focused during long work hours. No spikes, no crashes —
              just usable output.
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-paper-100" aria-hidden />
              <div>
                <p className="text-body-sm font-bold">Arjun P.</p>
                <p className="text-caption text-fg-muted">Verified buyer</p>
              </div>
            </figcaption>
          </figure>
        </div>
      </Section>

      {/* ============== RADII ============== */}
      <Section
        id="radii"
        eyebrow="06 — Tokens"
        title="Border Radius"
        description="Pills (rounded-full) for CTAs; lg/xl for cards; md for inputs."
      >
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-7">
          {radii.map((r) => (
            <div key={r.name} className="text-center">
              <div
                className={`${r.cls} mx-auto h-20 w-20 bg-ink`}
                aria-hidden
              />
              <p className="mt-3 text-body-sm font-bold">{r.name}</p>
              <code className="text-caption text-fg-muted">{r.value}</code>
            </div>
          ))}
        </div>
      </Section>

      {/* ============== SHADOWS ============== */}
      <Section
        id="shadows"
        eyebrow="07 — Tokens"
        title="Elevation"
        description="Subtle navy-tinted shadows; lime glow reserved for accent hover states."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {shadows.map((s) => (
            <div
              key={s.name}
              className={`${s.cls} rounded-lg bg-paper p-6 border border-paper-200`}
            >
              <p className="text-body-sm font-bold">{s.name}</p>
              <p className="mt-1 text-caption text-fg-muted">{s.desc}</p>
              <code className="text-caption mt-3 block text-fg-subtle">{s.cls}</code>
            </div>
          ))}
        </div>
      </Section>

      {/* ============== SPACING ============== */}
      <Section
        id="spacing"
        eyebrow="08 — Tokens"
        title="Spacing"
        description="Custom rhythm tokens layered on top of Tailwind's default scale."
      >
        <div className="space-y-4">
          {spacingTokens.map((s) => (
            <div key={s.name} className="flex items-center gap-6">
              <div className="w-40 shrink-0">
                <p className="text-body-sm font-bold">{s.name}</p>
                <code className="text-caption text-fg-muted">{s.value}</code>
              </div>
              <div
                className="h-6 rounded bg-accent"
                style={{ width: `${s.size}px` }}
                aria-hidden
              />
            </div>
          ))}
        </div>
      </Section>

      {/* ============== HERO PREVIEW ============== */}
      <Section
        id="preview"
        eyebrow="09 — In Context"
        title="Composition Previews"
        description="Tokens in real composition — dark hero, blue benefits panel, and light product card."
      >
        <div className="space-y-8">
          {/* Dark hero — TAKE CHARGE */}
          <div className="overflow-hidden rounded-2xl bg-ink text-fg-inverse">
            <div className="px-8 py-16 md:px-16 md:py-24 max-w-3xl">
              <p className="eyebrow text-accent">10X Daytime</p>
              <h3 className="mt-6 font-display text-display-xl uppercase tracking-tightest">
                Take Charge.<br />
                <span className="text-accent">Own The Day.</span>
              </h3>
              <p className="mt-6 max-w-prose text-body-lg text-fg-inverse-muted">
                The Brain Battery — Focus. Clarity. Control. No spikes. No crashes.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button type="button" className="btn-accent">Get Started →</button>
                <button type="button" className="btn-ghost-dark">See How It Works</button>
              </div>
            </div>
          </div>

          {/* Royal blue panel — BENEFITS OF 10X */}
          <div
            className="overflow-hidden rounded-2xl text-fg-inverse"
            style={{ backgroundColor: '#06189E' }}
          >
            <div className="px-8 py-16 md:px-16 md:py-24 max-w-3xl">
              <p className="eyebrow text-accent">Why 10X</p>
              <h3 className="mt-6 font-condensed text-display-xl uppercase tracking-tighter">
                Benefits<br />of 10X
              </h3>
              <p className="mt-6 max-w-prose text-body-lg text-white/80">
                Everyone is optimizing software. 10X fixes the hardware. Brain nourishment built
                on the right inputs, in the right form, at the right time — so your brain
                multiplies everything else.
              </p>
              <div className="mt-8 grid gap-6 sm:grid-cols-3">
                {[
                  ['01', 'Brain Nourishment, Not Override'],
                  ['02', 'Focus. Clarity. Control.'],
                  ['03', 'Switch On. Switch Off.'],
                ].map(([n, label]) => (
                  <div key={n} className="border-t border-white/20 pt-4">
                    <p className="text-overline text-accent">{n}</p>
                    <p className="mt-2 text-body font-bold">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ============== FOOTER ============== */}
      <footer className="border-t border-paper-200 py-10">
        <div className="container-10x flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-caption text-fg-muted">
            © 2026 10X — Design system reference. Not for public release.
          </p>
          <p className="text-caption text-fg-subtle">
            Helvetica · Helvetica Display · Helvetica Condensed · Nimbus Sans · PT Sans
          </p>
        </div>
      </footer>
    </main>
  );
}
