'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { api } from '@/lib/api/storefront';
import type { StoreSettings } from '@/lib/catalog';

/**
 * The store's own rules — shipping threshold, flat rate, whether cash on
 * delivery is open, the support address, the subscription cadence.
 *
 * Fetched server-side in the site layout for the first paint (no flash of a
 * placeholder shipping charge), then kept fresh in the browser: re-read when
 * the tab regains focus and every couple of minutes while it's open. The
 * panel can switch cash-on-delivery off or change the delivery fee, and a
 * customer mid-session sees it before the checkout refuses them.
 */
const REFRESH_MS = 120_000;
const StoreSettingsContext = createContext<StoreSettings | null>(null);

export function StoreSettingsProvider({
  settings,
  children,
}: {
  settings: StoreSettings;
  children: ReactNode;
}) {
  const [live, setLive] = useState(settings);

  useEffect(() => {
    let alive = true;
    const refresh = async () => {
      // Only a real answer replaces what we have — an API blip must not swap
      // the live numbers for placeholders.
      const result = await api<{ settings: StoreSettings }>('/api/v1/settings', { auth: false });
      if (alive && result.ok) setLive(result.data.settings);
    };
    const onVisible = () => {
      if (document.visibilityState === 'visible') void refresh();
    };
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') void refresh();
    }, REFRESH_MS);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      alive = false;
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  return <StoreSettingsContext.Provider value={live}>{children}</StoreSettingsContext.Provider>;
}

export function useStoreSettings(): StoreSettings {
  const ctx = useContext(StoreSettingsContext);
  if (!ctx) throw new Error('useStoreSettings must be used within a StoreSettingsProvider');
  return ctx;
}
