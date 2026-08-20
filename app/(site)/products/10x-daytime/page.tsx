import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ProductGallery, { type GalleryImage } from '@/components/ProductGallery';
import ProductPurchase from '@/components/ProductPurchase';
import ProductDetailsMobile from '@/components/ProductDetailsMobile';
import IngredientStrip from '@/components/IngredientStrip';
import ProductFAQ from '@/components/ProductFAQ';
import BuiltForMinds from '@/components/BuiltForMinds';
import { ProductConfigProvider } from '@/components/ProductConfigContext';
import { ProductContentProvider } from '@/components/ProductContentContext';
import { getStoreSettings, loadProduct, pickTier, type CatalogProduct } from '@/lib/catalog';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://10xdrink.com';

/** The slug this route serves. The catalogue owns everything else about it. */
const SLUG = '10x-daytime';

/**
 * Metadata comes from the product's own SEO fields, edited in the admin panel.
 * A hard-coded title with a price in it goes stale the first time that price
 * changes, and Google keeps showing the old one.
 */
export async function generateMetadata(): Promise<Metadata> {
  const result = await loadProduct(SLUG);
  if (result.state !== 'ok') {
    return { title: '10X', alternates: { canonical: `/products/${SLUG}` } };
  }
  const { product } = result;
  return {
    title: product.seo.title || `${product.name} | 10X`,
    description: product.seo.description || product.description,
    alternates: { canonical: `/products/${SLUG}` },
    openGraph: {
      title: product.seo.title || product.name,
      description: product.seo.description || product.description,
      images: product.images.slice(0, 1),
    },
  };
}

/** Offers Google can actually rely on, priced from the catalogue. */
function productJsonLd(product: CatalogProduct) {
  const offers = product.tiers.map((tier) => ({
    '@type': 'Offer',
    name: `${tier.name} — ${tier.packets} sticks`,
    price: String(tier.oneTimePrice),
    priceCurrency: 'INR',
    availability: tier.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    url: `${SITE_URL}/products/${product.slug}`,
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    ...(product.tagline ? { alternateName: product.tagline } : {}),
    description: product.description,
    brand: { '@type': 'Brand', name: '10X' },
    ...(product.images.length ? { image: product.images } : {}),
    ...(offers.length === 1 ? { offers: offers[0] } : offers.length ? { offers } : {}),
  };
}

export default async function ProductPage({
  searchParams,
}: {
  searchParams: Promise<{ pack?: string; plan?: string }>;
}) {
  const { pack, plan } = await searchParams;
  const [result, settings] = await Promise.all([loadProduct(SLUG), getStoreSettings()]);

  // A product that has been archived or removed is a 404, not a blank page.
  if (result.state === 'missing') notFound();

  const product = result.state === 'ok' ? result.product : null;
  const initialTier = product ? pickTier(product, pack) : null;

  // The gallery is the product's own images. No repo fallback: a stock photo
  // standing in for the real one is how a customer ends up seeing a pack that
  // isn't what ships.
  // Each slot carries both looks; the gallery picks by the theme on screen and
  // falls back to the light photo when no dark one was uploaded.
  const gallery: GalleryImage[] =
    product?.images.map((src, i) => ({
      src: { light: src, dark: product.imagesDark[i] ?? product.imagesDark[0] ?? src },
      alt: `${product.name} — view ${i + 1}`,
    })) ?? [];

  return (
    <main id="main" className="bg-white dark:bg-paper pt-14 md:pt-[72px]">
      {product && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }}
        />
      )}

      <ProductContentProvider product={product} settings={settings}>
        <ProductConfigProvider
          initialTierId={initialTier?.id ?? null}
          initialSubscribe={plan === 'subscribe'}
        >
          {/* ============ Screen 1 — Gallery + Purchase (hero) ============ */}
          <section className="mx-auto max-w-7xl px-6 py-6 sm:px-10 md:px-14 md:py-14">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-14">
              {gallery.length > 0 ? (
                <ProductGallery images={gallery} />
              ) : (
                <div className="flex aspect-square items-center justify-center border-2 border-dashed border-paper-300 p-8 text-center">
                  <p className="font-pt text-body-sm text-fg-subtle">
                    {product
                      ? 'No product photos yet — add them in the admin panel.'
                      : 'Product photos load with the catalogue.'}
                  </p>
                </div>
              )}

              {/* Dynamic purchase panel */}
              <div className="md:py-1">
                <ProductPurchase />
              </div>
            </div>
          </section>

          {/* ============ Screen 2 — Made with + details ============ */}
          <IngredientStrip />
          <ProductDetailsMobile />

          {/* ============ Screen 3 — Built for high-output minds ============ */}
          <BuiltForMinds />

          {/* ============ Screen 4 — FAQ (last) ============ */}
          <ProductFAQ />
        </ProductConfigProvider>
      </ProductContentProvider>
    </main>
  );
}
