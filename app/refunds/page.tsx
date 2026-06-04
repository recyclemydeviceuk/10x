import type { Metadata } from 'next';

import LegalShell from '../../components/LegalShell';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy',
  description: 'How cancellations, returns, and refunds work for 10X orders.',
  alternates: { canonical: '/refunds' },
};

export default function RefundsPage() {
  return (
    <LegalShell
      title="Refund & Cancellation Policy"
      updated="4 June 2026"
      intro="We want you to be happy with your order. Here’s how cancellations, returns, and refunds work."
      sections={[
        {
          heading: 'Cancellations',
          paragraphs: [
            'You can cancel an order any time before it is dispatched. Once an order has shipped, it can no longer be cancelled, but you may be eligible for a return.',
            'To cancel, contact our support team with your order number as soon as possible.',
          ],
        },
        {
          heading: 'Returns',
          paragraphs: [
            'As 10X is a consumable product, we can only accept returns for items that arrive damaged, defective, or incorrect.',
            'If something’s wrong with your order, reach out within 7 days of delivery with your order number and a photo of the issue, and we’ll make it right.',
          ],
        },
        {
          heading: 'Refunds',
          paragraphs: [
            'Approved refunds are processed to your original payment method. For Cash on Delivery orders, we’ll arrange a refund via bank transfer or store credit.',
            'Refunds are typically processed within 5–7 business days after approval. The time it takes to appear in your account depends on your bank or provider.',
          ],
        },
        {
          heading: 'Quick-Commerce Orders',
          paragraphs: [
            'If you purchased 10X through a partner app (Blinkit, Zepto, Swiggy Instamart, or Flipkart Minutes), cancellations and refunds for that order are handled under that platform’s policy. Contact them directly for the fastest resolution.',
          ],
        },
        {
          heading: 'Need Help?',
          paragraphs: [
            'Our team is happy to help with any cancellation or refund question — get in touch and we’ll sort it out quickly.',
          ],
        },
      ]}
    />
  );
}
