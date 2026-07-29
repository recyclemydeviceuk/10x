import Image from 'next/image';
import Link from 'next/link';

import logo from '../10x-Assets/10xLogo.webp';

const PRODUCT_HREF = '/products/10x-daytime';

const socials = [
  { label: 'Instagram', href: 'https://www.instagram.com/10xdrink', d: 'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07ZM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.9 5.9 0 0 0-2.13 1.39A5.9 5.9 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.73 1.46 1.39 2.13.66.66 1.34 1.08 2.13 1.39.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.13-1.39 5.9 5.9 0 0 0 1.39-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.39-2.13A5.9 5.9 0 0 0 19.86.63C19.1.33 18.22.13 16.95.07 15.67.01 15.26 0 12 0Zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.17 6.17 0 0 0 12 5.84ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/10xdrink', d: 'M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.27 2.38 4.27 5.47v6.27ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45C23.2 24 24 23.23 24 22.28V1.72C24 .77 23.2 0 22.22 0Z' },
  { label: 'Email', href: 'mailto:support@10xdrink.com', d: 'M2 5.5A2.5 2.5 0 0 1 4.5 3h15A2.5 2.5 0 0 1 22 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 18.5v-13Zm2.6-.5 7.4 5.55L19.4 5H4.6ZM20 6.7l-7.4 5.55a1 1 0 0 1-1.2 0L4 6.7v11.8c0 .28.22.5.5.5h15a.5.5 0 0 0 .5-.5V6.7Z' },
];

const legalLinks = [
  { label: 'Queries', href: '/queries' },
  { label: 'Track Order', href: '/track' },
  { label: 'Terms', href: '/terms' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Refunds', href: '/refunds' },
  { label: 'Shipping', href: '/shipping' },
];

export default function SiteFooter() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 md:px-14 md:py-20">
        <div className="flex flex-col items-start text-left sm:items-center sm:text-center">
          <Image
            src={logo}
            alt="10X"
            width={120}
            height={48}
            className="h-9 w-auto md:h-10"
          />
          <p className="mt-5 font-quantico text-caption font-bold uppercase tracking-[0.24em] text-white/60">
            The Brain Battery
          </p>
          <h2 className="mt-3 font-condensed text-3xl font-black uppercase italic leading-none tracking-tight md:text-4xl">
            Fuel Better Thinking.
          </h2>

          <Link
            href={PRODUCT_HREF}
            className="mt-7 inline-flex cursor-pointer items-center gap-2 bg-accent px-8 py-3.5 font-quantico text-body-sm font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-accent-hover"
          >
            Order Now
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>

          {/* socials */}
          <div className="mt-8 flex items-center gap-5">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                aria-label={s.label}
                className="cursor-pointer text-white/70 transition-colors hover:text-white"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d={s.d} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* bottom row */}
        <div className="mt-10 flex flex-col items-start gap-4 border-t border-white/10 pt-6 text-left sm:items-center sm:text-center md:flex-row md:items-center md:justify-between md:text-left">
          <p className="font-pt text-body-sm text-white/60">© 2026 10X. All rights reserved.</p>
          <ul className="flex flex-wrap items-center justify-start gap-x-6 gap-y-2 font-pt text-body-sm text-white/60 sm:justify-center">
            {legalLinks.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="cursor-pointer transition-colors hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
