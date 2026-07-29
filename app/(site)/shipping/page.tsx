import type { Metadata } from 'next';

import LegalShell from '@/components/LegalShell';

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description: 'Delivery options, timelines, and coverage for 10X orders across India.',
  alternates: { canonical: '/shipping' },
};

export default function ShippingPage() {
  return (
    <LegalShell
      title="Shipping Policy"
      updated="4 June 2026"
      intro="10X is built for speed. Here’s how and when your order reaches you."
      sections={[
        {
          heading: 'Delivery Options',
          paragraphs: [
            'Order directly from 10xdrink.com for standard delivery, or get 10X in minutes through our quick-commerce partners — Blinkit, Zepto, Swiggy Instamart, and Flipkart Minutes.',
          ],
        },
        {
          heading: 'Timelines',
          paragraphs: [
            'Quick-commerce orders are typically delivered within minutes, subject to availability in your area.',
            'Direct orders from 10xdrink.com are usually dispatched within 1–2 business days and delivered within 2–5 business days, depending on your location.',
          ],
        },
        {
          heading: 'Charges',
          paragraphs: [
            'Shipping charges, if any, are shown at checkout before you pay. Orders above the free-shipping threshold ship free.',
          ],
        },
        {
          heading: 'Coverage',
          paragraphs: [
            'We currently ship across serviceable pincodes in India. If your area isn’t covered yet, you may still be able to order through a quick-commerce partner.',
          ],
        },
        {
          heading: 'Tracking',
          paragraphs: [
            'Once your direct order ships, we’ll share tracking details by email. You can also view your orders any time from your account.',
          ],
        },
      ]}
    />
  );
}
