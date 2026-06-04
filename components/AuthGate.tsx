'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

type AuthGateValue = { promptLogin: (next?: string) => void };
const AuthGateContext = createContext<AuthGateValue | null>(null);

export function AuthGateProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [next, setNext] = useState('/');
  const pathname = usePathname();

  const promptLogin = useCallback((n = '/') => {
    setNext(n);
    setOpen(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const q = `?next=${encodeURIComponent(next)}`;

  return (
    <AuthGateContext.Provider value={{ promptLogin }}>
      {children}

      <div
        className={`fixed inset-0 z-[10050] flex items-center justify-center px-4 transition-opacity duration-200 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!open}
      >
        <div className="absolute inset-0 bg-ink/60" onClick={() => setOpen(false)} />

        <div
          role="dialog"
          aria-modal="true"
          aria-label="Login required"
          className={`relative w-full max-w-md overflow-hidden bg-white shadow-elevated transition-all duration-200 ${
            open ? 'translate-y-0 scale-100' : 'translate-y-3 scale-95'
          }`}
        >
          {/* Header band */}
          <div
            className="relative overflow-hidden px-7 py-8 text-white"
            style={{ background: 'linear-gradient(120deg, #000204 0%, #02063A 40%, #0821D2 100%)' }}
          >
            <svg viewBox="0 0 48 64" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="pointer-events-none absolute -right-3 -top-2 h-28 w-20 text-accent/15">
              <polyline points="6 24 24 8 42 24" />
              <polyline points="6 40 24 24 42 40" />
              <polyline points="6 56 24 40 42 56" />
            </svg>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 cursor-pointer p-1 text-white/70 transition-colors hover:text-white"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <span className="relative flex h-14 w-14 items-center justify-center border-2 border-accent text-accent">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect x="4" y="11" width="16" height="9" rx="1.5" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                <circle cx="12" cy="15.5" r="1" />
              </svg>
            </span>
            <h2 className="relative mt-5 font-condensed text-[1.75rem] font-black uppercase italic leading-none tracking-tight">
              Log In To Continue
            </h2>
            <p className="relative mt-2 font-pt text-body-sm text-white/80">
              Build your cart freely — you&rsquo;ll just need a 10X account to place
              your order.
            </p>
          </div>

          {/* Body */}
          <div className="px-7 py-6">
            <Link
              href={`/login${q}`}
              className="block w-full cursor-pointer bg-accent px-6 py-3.5 text-center font-quantico text-body-sm font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-accent-hover"
            >
              Log In
            </Link>
            <Link
              href={`/register${q}`}
              className="mt-3 block w-full cursor-pointer border-2 border-ink bg-transparent px-6 py-3 text-center font-quantico text-body-sm font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-ink hover:text-white"
            >
              Create Account
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-4 block w-full cursor-pointer text-center font-quantico text-caption font-bold uppercase tracking-wider text-fg-muted transition-colors hover:text-fg"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </AuthGateContext.Provider>
  );
}

export function useAuthGate() {
  const ctx = useContext(AuthGateContext);
  if (!ctx) throw new Error('useAuthGate must be used within AuthGateProvider');
  return ctx;
}
