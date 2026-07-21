import type { Metadata } from 'next';

import OrderTracker from '../../components/OrderTracker';

export const metadata: Metadata = {
  title: 'Track Your Order',
  description: 'Enter the Order ID from your confirmation email to see the live status of your 10X shipment.',
  alternates: { canonical: '/track' },
  robots: { index: false, follow: true },
};

export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  return <OrderTracker initialId={id ?? ''} />;
}
