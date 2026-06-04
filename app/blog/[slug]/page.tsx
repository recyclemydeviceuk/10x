import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { posts, getPost } from '../../../components/blog/posts';

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: 'Article' };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { title: post.title, description: post.excerpt, type: 'article' },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const more = posts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <main id="main" className="bg-paper">
      {/* Hero */}
      <section className="text-white" style={{ background: 'linear-gradient(120deg, #000204 0%, #02063A 40%, #0821D2 100%)' }}>
        <div className="mx-auto max-w-3xl px-6 pb-14 pt-28 sm:px-10 md:px-14 md:pb-16 md:pt-36">
          <Link href="/blog" className="inline-flex items-center gap-1.5 font-quantico text-caption font-bold uppercase tracking-wider text-white/70 transition-colors hover:text-accent">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="15 18 9 12 15 6" />
            </svg>
            The Journal
          </Link>
          <p className="mt-6 font-quantico text-caption font-bold uppercase tracking-[0.18em] text-accent">
            {post.category} · {post.readTime}
          </p>
          <h1 className="mt-3 font-condensed text-[clamp(2.25rem,5.5vw,4rem)] font-black uppercase italic leading-[0.92] tracking-tight">
            {post.title}
          </h1>
          <p className="mt-4 font-pt text-body-sm text-white/70">{formatDate(post.date)}</p>
        </div>
      </section>

      {/* Cover image */}
      <div className="mx-auto max-w-4xl px-6 sm:px-10 md:px-14">
        <div className="relative -mt-8 aspect-[16/9] w-full overflow-hidden border border-paper-200 bg-paper-100 shadow-elevated md:-mt-12">
          <Image src={post.image} alt={post.title} fill priority sizes="(min-width:768px) 900px, 100vw" className="object-cover" />
        </div>
      </div>

      {/* Body */}
      <article className="mx-auto max-w-2xl px-6 py-14 sm:px-10 md:px-14 md:py-20">
        {post.body.map((block, i) =>
          block.type === 'h' ? (
            <h2 key={i} className="mt-10 font-condensed text-[clamp(1.5rem,3vw,2rem)] font-black uppercase italic leading-tight tracking-tight text-fg first:mt-0">
              {block.text}
            </h2>
          ) : (
            <p key={i} className="mt-5 font-pt text-body-lg leading-relaxed text-fg-muted first:mt-0">
              {block.text}
            </p>
          ),
        )}

        {/* CTA */}
        <div className="mt-12 border-l-4 border-accent bg-paper-100 p-6">
          <p className="font-condensed text-[clamp(1.25rem,2.5vw,1.6rem)] font-black uppercase italic leading-tight tracking-tight text-fg">
            Feel the difference for yourself.
          </p>
          <Link href="/products/10x-daytime" className="mt-4 inline-flex cursor-pointer items-center gap-2 bg-accent px-7 py-3 font-quantico text-body-sm font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-accent-hover">
            Shop 10X Daytime
          </Link>
        </div>
      </article>

      {/* More articles */}
      <section className="border-t border-paper-200 bg-paper-100">
        <div className="mx-auto max-w-6xl px-6 py-14 sm:px-10 md:px-14 md:py-20">
          <h2 className="font-quantico text-body-lg font-bold uppercase tracking-wide text-fg">Keep Reading</h2>
          <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {more.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="group flex flex-col overflow-hidden border border-paper-200 bg-white transition-colors hover:border-brand-blue">
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image src={p.image} alt={p.title} fill sizes="(min-width:640px) 480px, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <span className="font-quantico text-[10px] font-bold uppercase tracking-[0.16em] text-brand-blue">{p.category}</span>
                  <h3 className="mt-2 font-quantico text-body-lg font-bold uppercase tracking-wide text-fg">{p.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
