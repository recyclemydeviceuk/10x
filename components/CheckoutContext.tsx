'use client';

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import type { Plan } from './plans';

type CheckoutContextValue = {
  plan: Plan | null;
  open: (plan: Plan) => void;
  close: () => void;
};

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<Plan | null>(null);

  const open = (p: Plan) => setPlan(p);
  const close = () => setPlan(null);

  return (
    <CheckoutContext.Provider value={{ plan, open, close }}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error('useCheckout must be used within CheckoutProvider');
  return ctx;
}
