import Image from 'next/image';
import Link from 'next/link';

import logo from '../10x-Assets/10xLogo.webp';
import searchIcon from '../10x-Assets/Search Icon.svg';
import userIcon from '../10x-Assets/User Icon.svg';
import cartIcon from '../10x-Assets/Cart Icon.png';
import menuIcon from '../10x-Assets/Humburger Icon.png';

export default function SiteHeader() {
  return (
    <header
      className="relative w-full text-fg-inverse"
      style={{
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
          <button
            type="button"
            aria-label="Search"
            className="flex h-11 w-11 cursor-pointer items-center justify-center transition-opacity hover:opacity-80 md:h-12 md:w-12"
          >
            <Image
              src={searchIcon}
              alt=""
              width={40}
              height={40}
              className="h-8 w-8 md:h-10 md:w-10"
            />
          </button>

          <Link
            href="#"
            aria-label="Account"
            className="flex h-11 w-11 cursor-pointer items-center justify-center transition-opacity hover:opacity-80 md:h-12 md:w-12"
          >
            <Image
              src={userIcon}
              alt=""
              width={44}
              height={44}
              className="h-9 w-9 md:h-11 md:w-11"
            />
          </Link>

          <Link
            href="#"
            aria-label="Cart"
            className="flex h-11 w-11 cursor-pointer items-center justify-center transition-opacity hover:opacity-80 md:h-12 md:w-12"
          >
            <Image
              src={cartIcon}
              alt=""
              width={40}
              height={40}
              className="h-8 w-8 md:h-10 md:w-10"
            />
          </Link>

          <button
            type="button"
            aria-label="Open menu"
            className="flex h-11 w-11 cursor-pointer items-center justify-center transition-opacity hover:opacity-80 md:h-12 md:w-12"
          >
            <Image
              src={menuIcon}
              alt=""
              width={40}
              height={40}
              className="h-8 w-8 md:h-10 md:w-10"
            />
          </button>
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
