import SiteLayout from './(site)/layout';
import NotFound from './(site)/not-found';

export { metadata } from './(site)/not-found';

/**
 * Unknown URLs resolve to the root not-found, which renders outside the
 * (site) group — so wrap it in the site layout ourselves: header, footer,
 * cart and theme stay exactly as on every other page.
 */
export default function RootNotFound() {
  return (
    <SiteLayout>
      <NotFound />
    </SiteLayout>
  );
}
