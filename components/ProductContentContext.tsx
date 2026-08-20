'use client';

import { createContext, useContext, type ReactNode } from 'react';

import type { CatalogProduct, StoreSettings } from '@/lib/catalog';

/**
 * The product being viewed, straight from the catalogue.
 *
 * There is deliberately NO fallback copy and NO fallback price. A product page
 * that can't reach the catalogue shows that it can't, rather than rendering a
 * price from the repo — a number nobody chose, which stops matching the
 * checkout the moment someone edits the real one in the admin panel.
 */

type ProductContextValue = {
  /** null when the catalogue could not be read. */
  product: CatalogProduct | null;
  settings: StoreSettings;
};

const ProductContentContext = createContext<ProductContextValue | null>(null);

export function ProductContentProvider({
  product,
  settings,
  children,
}: ProductContextValue & { children: ReactNode }) {
  return (
    <ProductContentContext.Provider value={{ product, settings }}>
      {children}
    </ProductContentContext.Provider>
  );
}

export function useProductContent(): ProductContextValue {
  const ctx = useContext(ProductContentContext);
  if (!ctx) throw new Error('useProductContent must be used within a ProductContentProvider');
  return ctx;
}
