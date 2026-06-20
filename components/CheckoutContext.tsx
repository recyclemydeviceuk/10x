'use client';

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import type { CheckoutSelection } from './plans';

type CheckoutContextValue = {
  selection: CheckoutSelection | null;
  open: (selection: CheckoutSelection) => void;
  close: () => void;
};

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<CheckoutSelection | null>(null);

  const open = (s: CheckoutSelection) => setSelection(s);
  const close = () => setSelection(null);

  return (
    <CheckoutContext.Provider value={{ selection, open, close }}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error('useCheckout must be used within CheckoutProvider');
  return ctx;
}
