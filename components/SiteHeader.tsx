import Image from 'next/image';
import Link from 'next/link';

import logo from '../10x-Assets/10xLogo.webp';
import SearchBar from './SearchBar';
import HeaderActions from './HeaderActions';

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
        <Link href="#" aria-label="10X — Home" className="flex cursor-pointer items-center">
          <Image
            src={logo}
            alt="10X"
            width={88}
            height={36}
            priority
            className="h-7 w-auto md:h-9"
          />
        </Link>

        <nav
          aria-label="Primary"
          className="flex items-center gap-2 sm:gap-3 md:gap-4"
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
