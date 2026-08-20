import type { Metadata } from 'next';

import AccountDashboard from '@/components/account/AccountDashboard';

export const metadata: Metadata = {
  title: 'My Account',
  alternates: { canonical: '/account' },
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return <AccountDashboard />;
}
