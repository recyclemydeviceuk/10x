import type { Metadata } from 'next';

import AddressesView from '@/components/account/AddressesView';

export const metadata: Metadata = {
  title: 'My Addresses',
  alternates: { canonical: '/account/addresses' },
  robots: { index: false, follow: false },
};

export default function AccountAddressesPage() {
  return <AddressesView />;
}
