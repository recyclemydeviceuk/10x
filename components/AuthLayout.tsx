import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

import authImage from '../10x-Assets/TakeChargeBG-mKiw2fP8.png';
import logo from '../10x-Assets/10xLogo.webp';

type Props = {
  heading: string;
  children: ReactNode;
  footer?: ReactNode;
};

export default function AuthLayout({ heading, children, footer }: Props) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left visual panel — 70% on desktop, hidden on mobile */}
      <div className="relative hidden flex-[7] overflow-hidden md:block">
        <Image
          src={authImage}
          alt=""
          fill
          priority
          sizes="70vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(0,2,4,0.78) 0%, rgba(8,33,210,0.55) 45%, rgba(8,33,210,0.10) 100%)',
          }}
        />
        <div className="absolute inset-0 flex items-center p-10 lg:p-16">
          <h2 className="font-condensed text-[clamp(3.5rem,9vw,8rem)] font-black uppercase italic leading-[0.88] tracking-tight text-white">
            <span className="block">Fuel</span>
            <span className="block">
              your <span className="text-accent">mind</span>.
            </span>
          </h2>
        </div>
      </div>

      {/* Right form panel — 30% on desktop, full width on mobile */}
      <div className="relative flex flex-1 flex-col bg-white md:flex-[3]">
        {/* Compact top bar: brand mark + back to home */}
        <div className="flex items-center justify-between px-6 py-5 sm:px-10">
          <Link href="/" aria-label="10X — Home" className="inline-flex items-center">
            <Image
              src={logo}
              alt="10X"
              width={72}
              height={32}
              priority
              className="h-7 w-auto"
            />
          </Link>
          <Link
            href="/"
            aria-label="Close"
            className="-mr-2 cursor-pointer p-2 text-fg-muted transition-colors hover:bg-paper-100 hover:text-fg"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-10 sm:px-10">
          <h1 className="font-condensed text-[clamp(1.75rem,3vw,2.25rem)] font-black uppercase leading-none tracking-tight text-fg">
            {heading}
          </h1>

          <div className="mt-8">{children}</div>

          {footer && (
            <p className="mt-8 text-center font-pt text-body-sm text-fg-muted">
              {footer}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
