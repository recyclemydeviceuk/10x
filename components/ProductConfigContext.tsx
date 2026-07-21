'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

import { type TierId } from './plans';

type ProductConfig = {
  tierId: TierId;
  setTierId: (id: TierId) => void;
};

const ProductConfigContext = createContext<ProductConfig | null>(null);

// Holds the selected pack tier so the purchase panel (hero) and the mobile
// details block (rendered further down the page, after Engineered With) stay
// in sync from a single source of truth.
export function ProductConfigProvider({
  children,
  initialTierId = 'core',
}: {
  children: ReactNode;
  /** Pre-selected pack, e.g. from the homepage Buy selector's `?pack=` param. */
  initialTierId?: TierId;
}) {
  const [tierId, setTierId] = useState<TierId>(initialTierId);
  return (
    <ProductConfigContext.Provider value={{ tierId, setTierId }}>
      {children}
    </ProductConfigContext.Provider>
  );
}

export function useProductConfig() {
  const ctx = useContext(ProductConfigContext);
  if (!ctx) throw new Error('useProductConfig must be used within a ProductConfigProvider');
  return ctx;
}
