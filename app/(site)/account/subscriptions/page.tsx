import type { Metadata } from 'next';

import SubscriptionsView from '@/components/account/SubscriptionsView';

export const metadata: Metadata = {
  title: 'My Subscription',
  alternates: { canonical: '/account/subscriptions' },
  robots: { index: false, follow: false },
};

export default function AccountSubscriptionsPage() {
  return <SubscriptionsView />;
}
