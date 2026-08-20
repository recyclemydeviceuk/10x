import type { Metadata } from 'next';

import OrdersList from '@/components/account/OrdersList';

export const metadata: Metadata = {
  title: 'My Orders',
  alternates: { canonical: '/account/orders' },
  robots: { index: false, follow: false },
};

export default function AccountOrdersPage() {
  return <OrdersList />;
}
