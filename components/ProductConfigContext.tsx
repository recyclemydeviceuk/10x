'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

type ProductConfig = {
  /** The selected pack's id, as the catalogue knows it. */
  tierId: string | null;
  setTierId: (id: string) => void;
  /** false = one-time purchase (the default), true = recurring delivery. */
  subscribe: boolean;
  setSubscribe: (v: boolean) => void;
};

const ProductConfigContext = createContext<ProductConfig | null>(null);

// Holds the selected pack and plan so the purchase panel (hero) and the mobile
// details block (rendered further down the page, after the ingredients
// carousel) stay in sync from a single source of truth.
export function ProductConfigProvider({
  children,
  initialTierId = null,
  initialSubscribe = false,
}: {
  children: ReactNode;
  /** Pre-selected pack — from the `?pack=` param, resolved against the catalogue. */
  initialTierId?: string | null;
  /** Pre-selected plan from `?plan=`. One-time unless told otherwise. */
  initialSubscribe?: boolean;
}) {
  const [tierId, setTierId] = useState<string | null>(initialTierId);
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
