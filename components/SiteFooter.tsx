'use client';

import Image from 'next/image';
import Link from 'next/link';

import logo from '../10x-Assets/10xLogo.webp';
import blueBg from '../10x-Assets/Blue Plain Background.png';

const socials = [
  { label: 'Facebook', href: '#', d: 'M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.13 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.81 8.44-4.94 8.44-9.94Z' },
  { label: 'Instagram', href: '#', d: 'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07ZM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.9 5.9 0 0 0-2.13 1.39A5.9 5.9 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.73 1.46 1.39 2.13.66.66 1.34 1.08 2.13 1.39.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.13-1.39 5.9 5.9 0 0 0 1.39-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.39-2.13A5.9 5.9 0 0 0 19.86.63C19.1.33 18.22.13 16.95.07 15.67.01 15.26 0 12 0Zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.17 6.17 0 0 0 12 5.84ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z' },
  { label: 'Twitter', href: '#', d: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z' },
  { label: 'LinkedIn', href: '#', d: 'M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.27 2.38 4.27 5.47v6.27ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45C23.2 24 24 23.23 24 22.28V1.72C24 .77 23.2 0 22.22 0Z' },
  { label: 'YouTube', href: '#', d: 'M23.5 6.2a3.02 3.02 0 0 0-2.13-2.13C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.37.57A3.02 3.02 0 0 0 .5 6.2C0 8.07 0 12 0 12s0 3.93.5 5.8a3.02 3.02 0 0 0 2.13 2.13C4.5 20.5 12 20.5 12 20.5s7.5 0 9.37-.57a3.02 3.02 0 0 0 2.13-2.13c.5-1.87.5-5.8.5-5.8s0-3.93-.5-5.8ZM9.6 15.6V8.4l6.24 3.6-6.24 3.6Z' },
];

const collectionLinks = [
  { label: 'Collection', href: '#' },
  { label: 'Power Up', href: '#' },
];

const supportLinks = [
  { label: 'About Us', href: '#' },
  { label: 'Blog', href: '#' },
  { label: 'FAQ', href: '#' },
  { label: 'Contact', href: '#' },
  { label: 'Legal', href: '#' },
  { label: 'Thank You', href: '#' },
  { label: '404', href: '#' },
];

const legalLinks = [
  { label: 'Terms & Conditions', href: '#' },
  { label: 'Refund & Cancellation Policy', href: '#' },
  { label: 'Privacy Policy', href: '#' },
  { label: 'Cookie Settings', href: '#' },
];

export default function SiteFooter() {
  return (
    <footer className="relative w-full overflow-hidden text-white">
      {/* Background image */}
      <Image
        src={blueBg}
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:px-10 md:px-14 md:py-20">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
            {/* Brand + socials */}
            <div className="md:col-span-3">
              <Image
                src={logo}
                alt="10X"
                width={140}
                height={56}
                className="h-12 w-auto md:h-14"
              />
              <p className="mt-2 font-quantico text-caption font-bold uppercase tracking-[0.2em] text-white">
                The Brain Battery
              </p>

              <div className="mt-6 flex items-center gap-4">
                {socials.map((s) => (
                  <Link
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="cursor-pointer text-white transition-opacity hover:opacity-70"
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path d={s.d} />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>

            {/* Collection links */}
            <nav aria-label="Collection" className="md:col-span-2">
              <ul className="space-y-4 font-pt text-body">
                {collectionLinks.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="cursor-pointer transition-opacity hover:opacity-80">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Support links */}
            <nav aria-label="Support" className="md:col-span-3">
              <ul className="space-y-4 font-pt text-body">
                {supportLinks.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="cursor-pointer transition-opacity hover:opacity-80">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Newsletter */}
            <form
              aria-label="Newsletter"
              className="md:col-span-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="border-2 border-white/30 p-5 md:p-6">
                <label htmlFor="footer-name" className="sr-only">
                  Enter name
                </label>
                <input
                  id="footer-name"
                  type="text"
                  placeholder="Enter name"
                  className="w-full bg-white px-4 py-3 font-pt text-body text-fg placeholder:text-fg-muted focus:outline-none"
                />
                <label htmlFor="footer-email" className="sr-only">
                  Enter email
                </label>
                <input
                  id="footer-email"
                  type="email"
                  placeholder="Enter Email"
                  className="mt-4 w-full bg-white px-4 py-3 font-pt text-body text-fg placeholder:text-fg-muted focus:outline-none"
                />
                <button
                  type="submit"
                  className="mt-5 inline-flex w-full cursor-pointer items-center justify-center gap-3 border-2 border-white/40 bg-transparent px-6 py-3 font-quantico text-body-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-white/10"
                >
                  Submit
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M21 16V8l-9-5-9 5v8l9 5 9-5Z" />
                    <path d="M3.27 6.96 12 12.01l8.73-5.05" />
                    <path d="M12 22.08V12" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Divider + bottom row */}
        <div className="border-t border-white/15">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 sm:px-10 md:flex-row md:items-center md:justify-between md:px-14">
            <p className="font-pt text-body-sm text-white/80">
              2026 10X. All rights reserved.
            </p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 font-pt text-body-sm text-white/80">
              {legalLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="cursor-pointer transition-opacity hover:opacity-80">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
