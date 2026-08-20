import type { Metadata } from 'next';
import { Chakra_Petch } from 'next/font/google';

import ComingSoonClient from './ComingSoonClient';

// The launch page keeps its own face — Chakra Petch, exactly like the
// original standalone build — loaded only here, not site-wide.
const chakra = Chakra_Petch({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: '10x — Coming Soon',
  description:
    'Your phone has a battery. Your laptop has a battery. Why not your brain? Get early access to 10x.',
  robots: { index: false },
};

export default function ComingSoonPage() {
  return (
    <div className={chakra.className}>
      <ComingSoonClient />
    </div>
  );
}
