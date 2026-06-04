import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { posts } from '../../components/blog/posts';

export const metadata: Metadata = {
  title: 'The Journal',
  description:
    'Notes on brain-first performance — focus, clarity, controllable energy, and the science behind 10X.',
  alternates: { canonical: '/blog' },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function BlogPage() {
  const [featured, ...rest] = posts;

  return (
    <main id="main" className="bg-paper">
      {/* Hero */}
      <section className="text-white" style={{ background: 'linear-gradient(120deg, #000204 0%, #02063A 40%, #0821D2 100%)' }}>
        <div className="mx-auto max-w-6xl px-6 pb-14 pt-28 sm:px-10 md:px-14 md:pb-20 md:pt-36">
          <p className="font-quantico text-caption font-bold uppercase tracking-[0.2em] text-accent">The Journal</p>
          <h1 className="mt-4 font-condensed text-[clamp(2.5rem,7vw,5rem)] font-black uppercase italic leading-[0.9] tracking-tight">
            Brain-First
            <br />
            <span className="text-accent">Reading</span>
          </h1>
          <p className="mt-5 max-w-xl font-pt text-body-lg text-white/85">
            Focus, clarity, and the science of energy you can control.
          </p>
        </div>
      </section>

      {/* Featured */}
      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-14 sm:px-10 md:px-14 md:py-20">
          <Link href={`/blog/${featured.slug}`} className="group grid grid-cols-1 overflow-hidden border border-paper-200 bg-white transition-colors hover:border-brand-blue md:grid-cols-2">
            <div className="relative aspect-[16/11] w-full overflow-hidden md:aspect-auto">
              <Image src={featured.image} alt={featured.title} fill sizes="(min-width:768px) 560px, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="flex flex-col justify-center p-8 md:p-12">
              <span className="font-quantico text-caption font-bold uppercase tracking-[0.16em] text-brand-blue">
                {featured.category} · {featured.readTime}
              </span>
              <h2 className="mt-3 font-condensed text-[clamp(1.75rem,3.5vw,2.75rem)] font-black uppercase italic leading-[0.95] tracking-tight text-fg">
                {featured.title}
              </h2>
              <p className="mt-4 font-pt text-body-lg text-fg-muted">{featured.excerpt}</p>
              <span className="mt-6 inline-flex items-center gap-1.5 font-quantico text-body-sm font-bold uppercase tracking-wider text-brand-blue">
                Read article
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="transition-transform group-hover:translate-x-1">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </div>
          </Link>

          {/* Grid */}
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex flex-col overflow-hidden border border-paper-200 bg-white transition-colors hover:border-brand-blue">
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image src={post.image} alt={post.title} fill sizes="(min-width:1024px) 360px, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="font-quantico text-[10px] font-bold uppercase tracking-[0.16em] text-brand-blue">
                    {post.category} · {post.readTime}
                  </span>
                  <h3 className="mt-2 font-quantico text-body-lg font-bold uppercase tracking-wide text-fg">{post.title}</h3>
                  <p className="mt-2 flex-1 font-pt text-body-sm text-fg-muted">{post.excerpt}</p>
                  <span className="mt-4 font-pt text-caption text-fg-subtle">{formatDate(post.date)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
