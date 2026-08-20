import type { Metadata } from 'next';
import { Suspense } from 'react';

import OrderSuccess from '@/components/checkout/OrderSuccess';

export const metadata: Metadata = {
  title: 'Order Confirmed',
  alternates: { canonical: '/checkout/success' },
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <main id="main" className="min-h-[70vh] bg-paper">
          <div className="mx-auto max-w-2xl px-6 pt-32">
            <div className="h-40 w-full animate-pulse bg-paper-200" />
          </div>
        </main>
      }
    >
      <OrderSuccess />
    </Suspense>
  );
}
