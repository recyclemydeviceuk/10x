import type { Metadata } from 'next';

import LegalShell from '../../components/LegalShell';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'The terms that govern your use of the 10X website and your purchase of 10X products.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <LegalShell
      title="Terms & Conditions"
      updated="4 June 2026"
      intro="Welcome to 10X. By accessing this website or placing an order, you agree to the terms below. Please read them carefully."
      sections={[
        {
          heading: 'Using This Site',
          paragraphs: [
            'You may use this website for lawful purposes only. You agree not to misuse the site, interfere with its operation, or attempt to access it in any way other than through the interface we provide.',
            'All content on this site — text, graphics, logos, and imagery — belongs to 10X Formulas and may not be reproduced without permission.',
          ],
        },
        {
          heading: 'Products & Information',
          paragraphs: [
            '10X products are food supplements intended to support a healthy lifestyle. They are not a substitute for a varied, balanced diet or medical advice.',
            'We make every effort to describe products accurately, but we do not warrant that product descriptions or other content are error-free. Statements have not been evaluated as medical claims.',
          ],
        },
        {
          heading: 'Orders & Pricing',
          paragraphs: [
            'All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise. We reserve the right to correct pricing errors and to refuse or cancel any order.',
            'Placing an order is an offer to purchase. A contract is formed only when we confirm dispatch of your order.',
          ],
        },
        {
          heading: 'Accounts',
          paragraphs: [
            'You are responsible for keeping your account details accurate and for activity that takes place under your account. Sign-in uses a one-time code sent to your email — keep access to that inbox secure.',
          ],
        },
        {
          heading: 'Limitation of Liability',
          paragraphs: [
            'To the fullest extent permitted by law, 10X is not liable for indirect or consequential loss arising from use of the site or products. Nothing in these terms limits liability that cannot be limited by law.',
          ],
        },
        {
          heading: 'Changes',
          paragraphs: [
            'We may update these terms from time to time. Continued use of the site after changes are posted means you accept the revised terms.',
          ],
        },
      ]}
    />
  );
}
