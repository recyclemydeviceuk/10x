import type { Metadata } from 'next';

import CartView from '@/components/cart/CartView';

export const metadata: Metadata = {
  title: 'Your Cart',
  description: 'Review your 10X order before checkout.',
  alternates: { canonical: '/cart' },
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return <CartView />;
}
