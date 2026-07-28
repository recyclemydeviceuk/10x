'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

/**
 * Support launcher — the site's own chat entry point, in the brand palette.
 *
 * T11: the widget on the build was the default third-party blue, which isn't in
 * the palette. This one is brand black (#0A0A0A) with the green accent, and it
 * lives in the repo so the colour can't drift back.
 *
 * NOTE: if a third-party chat script is still being injected at the host level
 * on the deployed site, remove it — otherwise there will be two bubbles. Point
 * me at the provider and I'll wire this launcher up to it instead.
 */

const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@10xdrink.com';
// Digits only, no "+" — WhatsApp's wa.me format.
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

const LAUNCHER_BG = '#0A0A0A';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-[9990] flex flex-col items-end gap-3 print:hidden">
      {open && (
        <div className="w-[min(88vw,300px)] border border-paper-200 bg-white shadow-elevated">
          <div className="px-4 py-3" style={{ background: LAUNCHER_BG }}>
            <p className="font-quantico text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
              10X Support
            </p>
            <p className="type-b2 mt-1 text-white">
              Real people, Monday to Saturday.
            </p>
          </div>

          <ul className="p-2">
            {WHATSAPP_NUMBER && (
              <li>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex cursor-pointer items-center justify-between gap-3 px-3 py-3 transition-colors hover:bg-paper-50"
                >
                  <span className="font-quantico text-[12px] font-bold uppercase tracking-[0.12em] text-ink">
                    WhatsApp us
                  </span>
                  <Arrow />
                </a>
              </li>
            )}
            <li>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="flex cursor-pointer items-center justify-between gap-3 px-3 py-3 transition-colors hover:bg-paper-50"
              >
                <span className="font-quantico text-[12px] font-bold uppercase tracking-[0.12em] text-ink">
                  Email us
                </span>
                <Arrow />
              </a>
            </li>
            <li>
              <Link
                href="/track"
                onClick={() => setOpen(false)}
                className="flex cursor-pointer items-center justify-between gap-3 px-3 py-3 transition-colors hover:bg-paper-50"
              >
                <span className="font-quantico text-[12px] font-bold uppercase tracking-[0.12em] text-ink">
                  Track an order
                </span>
                <Arrow />
              </Link>
            </li>
            <li>
              <Link
                href="/#before-you-ask"
                onClick={() => setOpen(false)}
                className="flex cursor-pointer items-center justify-between gap-3 px-3 py-3 transition-colors hover:bg-paper-50"
              >
                <span className="font-quantico text-[12px] font-bold uppercase tracking-[0.12em] text-ink">
                  Read the FAQ
                </span>
                <Arrow />
              </Link>
            </li>
          </ul>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'Close support' : 'Open support'}
        style={{ background: LAUNCHER_BG }}
        className="flex h-[52px] w-[52px] cursor-pointer items-center justify-center rounded-full text-accent shadow-elevated transition-transform hover:scale-105"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.1 9.1 0 0 1-3.6-.7L3 21l1.9-5a8.2 8.2 0 0 1-.8-3.6 8.4 8.4 0 0 1 8.4-8.4 8.4 8.4 0 0 1 8.5 8.4Z" />
          </svg>
        )}
      </button>
    </div>
  );
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0 text-fg-subtle">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
