import type { Metadata } from 'next';

import LegalShell from '../../components/LegalShell';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'How and why 10X uses cookies and similar technologies.',
  alternates: { canonical: '/cookies' },
};

export default function CookiesPage() {
  return (
    <LegalShell
      title="Cookie Policy"
      updated="4 June 2026"
      intro="This policy explains how 10X uses cookies and similar technologies, and the choices you have."
      sections={[
        {
          heading: 'What Are Cookies',
          paragraphs: [
            'Cookies are small text files stored on your device when you visit a website. They help the site remember your actions and preferences over time.',
          ],
        },
        {
          heading: 'How We Use Them',
          paragraphs: [
            'We use essential cookies to keep the site working — for example, to remember the items in your cart and keep you signed in.',
            'We may also use analytics cookies to understand how the site is used so we can improve it. These are only set with your consent where required.',
          ],
        },
        {
          heading: 'Managing Cookies',
          paragraphs: [
            'You can control or delete cookies through your browser settings. Disabling essential cookies may affect how parts of the site function — such as the cart and checkout.',
          ],
        },
        {
          heading: 'Local Storage',
          paragraphs: [
            'Some features (like your cart and saved preferences) use your browser’s local storage rather than cookies. This data stays on your device and can be cleared from your browser at any time.',
          ],
        },
      ]}
    />
  );
}
