'use client';

import Link from 'next/link';
import { useState } from 'react';

const inputCls =
  'w-full border-2 border-paper-200 bg-white px-4 py-3 font-pt text-body text-fg outline-none transition-colors placeholder:text-fg-subtle focus:border-brand-blue';
const labelCls = 'mb-1.5 block font-quantico text-caption font-bold uppercase tracking-wider text-fg-muted';

const channels = [
  {
    title: 'Email',
    value: 'support@10xdrink.com',
    href: 'mailto:support@10xdrink.com',
    Icon: (p: { className?: string }) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={p.className} aria-hidden>
        <rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" />
      </svg>
    ),
  },
  {
    title: 'Help & FAQ',
    value: 'Read common questions',
    href: '/products/10x-daytime#faq',
    Icon: (p: { className?: string }) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={p.className} aria-hidden>
        <circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 .9-1 1.7" /><circle cx="12" cy="16.5" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: 'Orders',
    value: 'Reorder in minutes',
    href: '/products/10x-daytime',
    Icon: (p: { className?: string }) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={p.className} aria-hidden>
        <path d="M6 7h12l-1 13H7L6 7Z" /><path d="M9 7a3 3 0 0 1 6 0" />
      </svg>
    ),
  },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setSent(true);
  }

  return (
    <main id="main" className="bg-paper">
      {/* Hero */}
      <section className="text-white" style={{ background: 'linear-gradient(120deg, #000204 0%, #02063A 40%, #0821D2 100%)' }}>
        <div className="mx-auto max-w-6xl px-6 pb-14 pt-28 sm:px-10 md:px-14 md:pb-20 md:pt-36">
          <p className="font-quantico text-caption font-bold uppercase tracking-[0.2em] text-accent">Contact</p>
          <h1 className="mt-4 font-condensed text-[clamp(2.5rem,7vw,5rem)] font-black uppercase italic leading-[0.9] tracking-tight">
            Get In Touch
          </h1>
          <p className="mt-5 max-w-xl font-pt text-body-lg text-white/85">
            Questions about 10X, your order, or anything else? We&rsquo;re here to help.
          </p>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-16 sm:px-10 md:grid-cols-[1.2fr_1fr] md:gap-16 md:px-14 md:py-24">
          {/* Form */}
          <div>
            <h2 className="font-condensed text-[clamp(1.75rem,3.5vw,2.5rem)] font-black uppercase italic leading-none tracking-tight text-fg">
              Send Us A Message
            </h2>
            {sent ? (
              <div className="mt-8 border-2 border-accent bg-white p-8 text-center shadow-card">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent text-ink">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M5 12.5 10 17.5 19 7" />
                  </svg>
                </span>
                <h3 className="mt-5 font-quantico text-body-lg font-bold uppercase tracking-wide text-fg">Message sent</h3>
                <p className="mt-2 font-pt text-body text-fg-muted">Thanks, {form.name.split(' ')[0] || 'there'} — we&rsquo;ll get back to you within 1–2 business days.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="mt-8 space-y-5">
                <div>
                  <label htmlFor="c-name" className={labelCls}>Name</label>
                  <input id="c-name" className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" required />
                </div>
                <div>
                  <label htmlFor="c-email" className={labelCls}>Email</label>
                  <input id="c-email" type="email" className={inputCls} value={form.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" required />
                </div>
                <div>
                  <label htmlFor="c-msg" className={labelCls}>Message</label>
                  <textarea id="c-msg" rows={5} className={`${inputCls} resize-y`} value={form.message} onChange={(e) => set('message', e.target.value)} required />
                </div>
                <button type="submit" className="inline-flex w-full cursor-pointer items-center justify-center gap-2 px-8 py-4 font-quantico text-body-sm font-bold uppercase tracking-[0.18em] text-white shadow-elevated transition hover:opacity-90 sm:w-auto" style={{ background: 'linear-gradient(90deg, #000204 0%, #02063A 35%, #0821D2 100%)' }}>
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Channels */}
          <aside>
            <h2 className="font-condensed text-[clamp(1.5rem,3vw,2rem)] font-black uppercase italic leading-none tracking-tight text-fg">
              Other Ways
            </h2>
            <div className="mt-6 space-y-3">
              {channels.map(({ title, value, href, Icon }) => (
                <Link key={title} href={href} className="group flex items-center gap-4 border border-paper-200 bg-white p-5 transition-colors hover:border-brand-blue">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-accent text-brand-blue">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span>
                    <span className="block font-quantico text-body-sm font-bold uppercase tracking-wide text-fg">{title}</span>
                    <span className="block font-pt text-caption text-fg-muted">{value}</span>
                  </span>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
