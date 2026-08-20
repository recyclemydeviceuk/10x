'use client';

import { createContext, useContext, type ReactNode } from 'react';

import type { StoreSettings } from '@/lib/catalog';

/**
 * The store's own rules — shipping threshold, flat rate, whether cash on
 * delivery is open, the support address, the subscription cadence.
 *
 * Fetched ONCE, server-side, in the site layout and handed down. That means
 * the first paint already has the real numbers: no flash of a placeholder
 * shipping charge, and no request from every component that needs one.
 *
 * These are the same values the API prices against, so what the cart shows and
 * what the checkout charges cannot drift.
 */
const StoreSettingsContext = createContext<StoreSettings | null>(null);

export function StoreSettingsProvider({
  settings,
  children,
}: {
  settings: StoreSettings;
  children: ReactNode;
}) {
  return <StoreSettingsContext.Provider value={settings}>{children}</StoreSettingsContext.Provider>;
}

export function useStoreSettings(): StoreSettings {
  const ctx = useContext(StoreSettingsContext);
  if (!ctx) throw new Error('useStoreSettings must be used within a StoreSettingsProvider');
  return ctx;
}
