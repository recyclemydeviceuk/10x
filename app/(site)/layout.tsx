import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ImageProtection from '@/components/ImageProtection';
import { CheckoutProvider } from '@/components/CheckoutContext';
import CheckoutModal from '@/components/CheckoutModal';
import ChatWidget from '@/components/ChatWidget';

/**
 * Storefront shell. Everything a shopper sees is wrapped here; the admin panel
 * sits outside this group so it inherits the fonts and the reset but none of
 * the header, footer, checkout or support furniture.
 */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:font-bold focus:text-ink"
      >
        Skip to main content
      </a>
      <ImageProtection />
      <CheckoutProvider>
        <SiteHeader />
        {children}
        <SiteFooter />
        <CheckoutModal />
        <ChatWidget />
      </CheckoutProvider>
    </>
  );
}
