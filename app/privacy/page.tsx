import type { Metadata } from 'next';

import LegalShell from '../../components/LegalShell';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How 10X collects, uses, and protects your personal information.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <LegalShell
      title="Privacy Policy"
      updated="4 June 2026"
      intro="Your privacy matters to us. This policy explains what information we collect, why we collect it, and the choices you have."
      sections={[
        {
          heading: 'Information We Collect',
          paragraphs: [
            'We collect details you provide directly — such as your name, email, phone number, and delivery address — when you create an account or place an order.',
            'We also collect limited technical information (such as device and usage data) to keep the site secure and improve your experience.',
          ],
        },
        {
          heading: 'How We Use It',
          paragraphs: [
            'We use your information to process orders, deliver products, provide support, send a one-time sign-in code, and — where you have opted in — share updates and offers.',
            'We do not sell your personal information.',
          ],
        },
        {
          heading: 'Sharing',
          paragraphs: [
            'We share information only with trusted partners who help us operate — for example, delivery and payment providers — and only to the extent needed to provide the service. We may also disclose information where required by law.',
          ],
        },
        {
          heading: 'Data Retention',
          paragraphs: [
            'We keep your information for as long as your account is active or as needed to provide services and meet legal obligations. You can ask us to delete your data at any time.',
          ],
        },
        {
          heading: 'Your Rights',
          paragraphs: [
            'You can access, correct, or delete your personal information, and opt out of marketing communications. To exercise these rights, contact us through our support channel.',
          ],
        },
        {
          heading: 'Security',
          paragraphs: [
            'We use reasonable technical and organisational measures to protect your information. No method of transmission or storage is completely secure, but we work to safeguard your data.',
          ],
        },
      ]}
    />
  );
}
