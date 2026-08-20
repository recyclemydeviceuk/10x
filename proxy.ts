import { NextResponse, type NextRequest } from 'next/server';

// =========================================================
// Coming-soon gate (Next 16 'proxy' — what middleware is called now).
//
// The panel's switch (Settings → Coming soon) lives in the store settings.
// When it is ON, every storefront page is rewritten to the launch screen —
// except the legal pages, which stay reachable from its footer. The flag is
// cached for 15s per server instance so the gate costs one API call every
// few seconds, not one per page view. If the API can't be reached the shop
// STAYS UP — an outage must never take the store down by accident.
// =========================================================

const API = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000').replace(/\/$/, '');

let cache = { at: 0, on: false };

async function comingSoonOn(): Promise<boolean> {
  if (Date.now() - cache.at < 15_000) return cache.on;
  try {
    const res = await fetch(`${API}/api/v1/settings`, { cache: 'no-store' });
    const body = (await res.json()) as { settings?: { comingSoonMode?: boolean } };
    cache = { at: Date.now(), on: Boolean(body?.settings?.comingSoonMode) };
  } catch {
    cache = { at: Date.now(), on: cache.on };
  }
  return cache.on;
}

/** Reachable even while the shop is down — the launch page links to these. */
const OPEN_PATHS = ['/coming-soon', '/terms', '/privacy', '/refunds', '/shipping', '/cookies'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const on = await comingSoonOn();
  const isOpen = OPEN_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (on && !isOpen) {
    // A REDIRECT, deliberately: prerendered pages (the homepage) are served
    // straight from Next's route cache, which ignores a proxy rewrite — a
    // redirect forces a fresh request that cannot be cache-skipped.
    const url = request.nextUrl.clone();
    url.pathname = '/coming-soon';
    url.search = '';
    return NextResponse.redirect(url, 307);
  }
  if (!on && pathname === '/coming-soon') {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url, 307);
  }
  return NextResponse.next();
}

export const config = {
  // Pages only — never assets, API proxies, or files.
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
