import Image from 'next/image';
import Link from 'next/link';

import CartBottomSpacer from './cart/CartBottomSpacer';
import { getStoreSettings } from '@/lib/catalog';
import { EMAIL_ICON_PATH, SOCIAL_ICON_PATHS, platformLabel } from '@/lib/social-icons';
import logo from '../10x-Assets/10xLogo.webp';

const PRODUCT_HREF = '/products/10x-daytime';


const legalLinks = [
  { label: 'Queries', href: '/queries' },
  { label: 'Track Order', href: '/account/orders' },
  { label: 'Terms', href: '/terms' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Refunds', href: '/refunds' },
  { label: 'Shipping', href: '/shipping' },
];


export default async function SiteFooter() {
  // The support address lives in store settings, so changing it in the admin
  // panel changes it here — no deploy.
  // Social links come from Settings → Store in the admin panel; the support
  // email is always the last icon.
  const { supportEmail, socialLinks = [] } = await getStoreSettings();
  const links = [
    ...socialLinks
      .filter((l) => l.url)
      .map((l) => ({ label: platformLabel(l), href: l.url, d: SOCIAL_ICON_PATHS[l.platform] ?? SOCIAL_ICON_PATHS.custom })),
    { label: 'Email', href: `mailto:${supportEmail}`, d: EMAIL_ICON_PATH },
  ];

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
            {links.map((s) => (
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

      {/* Grows the footer so the fixed cart bar never covers the links. */}
      <CartBottomSpacer />
    </footer>
  );
}
