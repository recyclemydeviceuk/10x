import Image from 'next/image';
import Link from 'next/link';

import logo from '../10x-Assets/10xLogo.webp';
import SearchBar from './SearchBar';
import HeaderActions from './HeaderActions';
import ShopMenu from './ShopMenu';

export default function SiteHeader() {
  return (
    <header
      className="w-full text-fg-inverse shadow-elevated"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        isolation: 'isolate',
        background:
          'linear-gradient(90deg, #000204 0%, #02063A 28%, #04108A 62%, #0820D6 100%)',
      }}
    >
      <div className="flex h-16 items-center justify-between pl-6 pr-4 sm:pl-10 sm:pr-6 md:h-20 md:pl-14 md:pr-8">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/" aria-label="10X — Home" className="flex cursor-pointer items-center">
            <Image
              src={logo}
              alt="10X"
              width={88}
              height={36}
              priority
              className="h-7 w-auto md:h-9"
            />
          </Link>
          <div className="flex items-center gap-0.5 lg:gap-1">
            <ShopMenu />
            <nav aria-label="Primary" className="hidden items-center md:flex">
              {[
                { label: 'Our Story', href: '/our-story' },
                { label: 'Formulation', href: '/formulation' },
                { label: 'Science', href: '/science' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative inline-flex items-center px-2 py-2 font-quantico text-body-sm font-bold uppercase tracking-[0.12em] text-white transition-colors hover:text-accent lg:px-3"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <nav
          aria-label="Primary"
          className="flex items-center gap-2 md:gap-3"
        >
          <SearchBar />
          <HeaderActions />
        </nav>
      </div>

      {/* Slim vertical edge accent on the far right, visible in the reference */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-full w-[3px] bg-white/70"
      />
    </header>
  );
}
