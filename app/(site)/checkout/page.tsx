import type { Metadata } from 'next';

import CheckoutView from '@/components/checkout/CheckoutView';

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Confirm your delivery address and payment method.',
  alternates: { canonical: '/checkout' },
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
