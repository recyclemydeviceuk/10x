'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';

import searchIcon from '../10x-Assets/Search Icon.svg';

type SearchItem = {
  title: string;
  description: string;
  href: string;
  price: string;
  keywords: string;
};

const SEARCH_INDEX: SearchItem[] = [
  {
    title: '10X Daytime',
    description: 'Pack of 2 (60ml). Focus, clarity, and control — without spikes or crashes.',
    href: '#collection',
    price: '₹299.00',
    keywords: 'daytime focus clarity sachet amino acids nootropic brain battery nourishment',
  },
];

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

function matchItem(item: SearchItem, tokens: string[]): boolean {
  const haystack = `${item.title} ${item.description} ${item.keywords}`.toLowerCase();
  return tokens.every((t) => haystack.includes(t));
}

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 50);
      return () => window.clearTimeout(id);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') close();
    }
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        close();
      }
    }

    document.addEventListener('keydown', handleKey);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  function close() {
    setIsOpen(false);
    setQuery('');
  }

  const trimmedQuery = query.trim();
  const tokens = useMemo(() => tokenize(trimmedQuery), [trimmedQuery]);
  const results = useMemo(() => {
    if (tokens.length === 0) return [];
    return SEARCH_INDEX.filter((item) => matchItem(item, tokens)).slice(0, 8);
  }, [tokens]);

  return (
    <div ref={containerRef} className="relative">
      {/* Pill that morphs: just an icon-sized circle when closed, expanded search bar when open */}
      <div
        className={`flex items-center overflow-hidden bg-white text-fg shadow-elevated transition-[width,padding] duration-300 ease-out ${
          isOpen
            ? 'w-[min(78vw,360px)] gap-2 px-4 py-2 md:w-[380px]'
            : 'h-11 w-11 cursor-pointer gap-0 p-0 md:h-12 md:w-12'
        }`}
        style={isOpen ? undefined : { background: 'transparent', boxShadow: 'none' }}
        onClick={!isOpen ? () => setIsOpen(true) : undefined}
        role={isOpen ? undefined : 'button'}
        aria-label={isOpen ? undefined : 'Open search'}
        tabIndex={isOpen ? -1 : 0}
        onKeyDown={
          !isOpen
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsOpen(true);
                }
              }
            : undefined
        }
      >
        {/* Magnifier — visible in both states */}
        {isOpen ? (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0 text-fg-muted"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        ) : (
          <Image
            src={searchIcon}
            alt=""
            width={28}
            height={28}
            className="h-7 w-7"
          />
        )}

        {/* Input + close — only when open */}
        {isOpen && (
          <>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search 10X..."
              aria-label="Search"
              autoComplete="off"
              spellCheck={false}
              className="min-w-0 flex-1 bg-transparent font-pt text-body text-fg outline-none placeholder:text-fg-subtle"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
              aria-label="Close search"
              className="shrink-0 p-1 text-fg-muted transition-colors hover:bg-paper-100 hover:text-fg"
            >
              <svg
                width="16"
                height="16"
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
            </button>
          </>
        )}
      </div>

      {/* Live results — only renders when user has typed */}
      {isOpen && trimmedQuery !== '' && (
        <div
          role="listbox"
          aria-label="Search results"
          style={{ width: 'min(92vw, 420px)' }}
          className="absolute right-0 top-full mt-2 overflow-hidden rounded-md border border-paper-200 bg-white text-fg shadow-elevated"
        >
          {results.length === 0 ? (
            <div className="px-4 py-6 text-center">
              <p className="font-pt text-body-sm text-fg">
                No products match &ldquo;{query}&rdquo;
              </p>
              <p className="mt-1 font-pt text-caption text-fg-muted">
                Try &ldquo;daytime&rdquo;, &ldquo;focus&rdquo;, or &ldquo;clarity&rdquo;.
              </p>
            </div>
          ) : (
            <>
              <p className="border-b border-paper-200 px-4 py-2 font-quantico text-[10px] font-bold uppercase tracking-wider text-fg-muted">
                {results.length} {results.length === 1 ? 'product' : 'products'}
              </p>
              <ul className="max-h-[60vh] overflow-y-auto py-1">
                {results.map((item) => (
                  <li key={`${item.title}-${item.href}`}>
                    <a
                      href={item.href}
                      onClick={close}
                      className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-paper-100"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-quantico text-body-sm font-bold text-fg">
                          {item.title}
                        </p>
                        <p className="mt-1 line-clamp-2 font-pt text-caption text-fg-muted">
                          {item.description}
                        </p>
                      </div>
                      <span className="shrink-0 self-center whitespace-nowrap font-quantico text-body-sm font-bold text-brand-blue">
                        {item.price}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
