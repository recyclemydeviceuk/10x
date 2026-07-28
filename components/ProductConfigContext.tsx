'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

import { DEFAULT_TIER_ID, type TierId } from './plans';

type ProductConfig = {
  tierId: TierId;
  setTierId: (id: TierId) => void;
  /** false = one-time purchase (the default), true = every 4 weeks. */
  subscribe: boolean;
  setSubscribe: (v: boolean) => void;
};

const ProductConfigContext = createContext<ProductConfig | null>(null);

// Holds the selected pack tier and plan so the purchase panel (hero) and the
// mobile details block (rendered further down the page, after the ingredients
// carousel) stay in sync from a single source of truth.
export function ProductConfigProvider({
  children,
  initialTierId = DEFAULT_TIER_ID,
  initialSubscribe = false,
}: {
  children: ReactNode;
  /** Pre-selected pack, e.g. from the homepage Buy selector's `?pack=` param. */
  initialTierId?: TierId;
  /** Pre-selected plan from `?plan=`. One-time unless told otherwise. */
  initialSubscribe?: boolean;
}) {
  const [tierId, setTierId] = useState<TierId>(initialTierId);
  const [subscribe, setSubscribe] = useState(initialSubscribe);
  return (
    <ProductConfigContext.Provider value={{ tierId, setTierId, subscribe, setSubscribe }}>
      {children}
    </ProductConfigContext.Provider>
  );
}

export function useProductConfig() {
  const ctx = useContext(ProductConfigContext);
  if (!ctx) throw new Error('useProductConfig must be used within a ProductConfigProvider');
  return ctx;
}
