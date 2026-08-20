import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ImageProtection from '@/components/ImageProtection';
import { AuthProvider } from '@/components/account/AuthContext';
import { AccountDataProvider } from '@/components/account/AccountDataContext';
import { CartProvider } from '@/components/cart/CartContext';
import FloatingCart from '@/components/cart/FloatingCart';
import ThemeProvider from '@/components/ThemeProvider';
import { StoreSettingsProvider } from '@/components/StoreSettingsContext';
import { getStoreSettings } from '@/lib/catalog';

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // One read, server-side, for every page under this layout — so the cart and
  // the checkout show the store's real shipping rules from the first paint.
  const settings = await getStoreSettings();

  return (
    <ThemeProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:font-bold focus:text-ink"
      >
        Skip to main content
      </a>
      <ImageProtection />
      {/* Account data depends on the signed-in customer, so it nests inside auth. */}
      <StoreSettingsProvider settings={settings}>
      <AuthProvider>
        <AccountDataProvider>
          <CartProvider>
            <SiteHeader />
            {children}
            <SiteFooter />
            <FloatingCart />
          </CartProvider>
        </AccountDataProvider>
      </AuthProvider>
      </StoreSettingsProvider>
    </ThemeProvider>
  );
}
