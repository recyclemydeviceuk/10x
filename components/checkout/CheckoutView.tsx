'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { useAccountData } from '@/components/account/AccountDataContext';
import { useAuth } from '@/components/account/AuthContext';
import { useTheme } from '@/components/ThemeProvider';
import { useCart } from '@/components/cart/CartContext';
import { IconArrow } from '@/components/ui/Field';
import { placeOrder } from '@/lib/checkout/place-order';
import { inr, type PaymentMethod } from '@/lib/store/types';

import AddressPicker from './AddressPicker';
import PaymentPicker from './PaymentPicker';

/**
 * Checkout — address and payment on one page.
 *
 * Guards first: no cart means nothing to buy, and a signed-out visitor has no
 * account to attach the order to. Both redirect rather than render a dead end.
 */
export default function CheckoutView() {
  const router = useRouter();
  const { loading: authLoading, isAuthed } = useAuth();
  const {
    line, loading: cartLoading, loadError: cartError, subtotal, shipping, shippingKnown, delivery, deliveryLoading, setDeliveryPincode,
    total, savings, discount, coupon, settings,
    clear,
  } = useCart();
  const { addresses, defaultAddress, loading: dataLoading, refresh } = useAccountData();

  const [addressId, setAddressId] = useState<string | null>(null);
  const [payment, setPayment] = useState<PaymentMethod>('online');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  /** Set the moment an order is committed, so the empty-cart guard stands down. */
  const submitted = useRef(false);

  const isSubscription = line?.isSubscription ?? false;
  // The cart line carries the product's own photo from the catalogue, in both
  // looks — so the thumbnail matches the theme and the pack that ships.
  const { theme } = useTheme();
  const thumb = (theme === 'light' ? line?.image : line?.imageDark || line?.image) || '';

  // Preselect the default address once addresses have loaded.
  useEffect(() => {
    if (!addressId && defaultAddress) setAddressId(defaultAddress.id);
  }, [addressId, defaultAddress]);

  // A subscription can't be paid in cash — force it back to online. The same
  // goes if the store has cash on delivery switched off.
  useEffect(() => {
    if ((isSubscription || !settings.codEnabled) && payment === 'cod') setPayment('online');
  }, [isSubscription, settings.codEnabled, payment]);

  // Guards. Wait for both contexts so we never bounce a valid session, and
  // stand down once an order is placed — clearing the cart empties `line`,
  // which would otherwise bounce the customer back instead of letting the
  // confirmation page load.
  useEffect(() => {
    if (authLoading || cartLoading || submitted.current) return;
    // A cart we couldn't read is sent back to the cart page, which explains
    // and retries — never to a checkout with nothing in it.
    if (!isAuthed || !line || cartError) router.replace('/cart');
  }, [authLoading, cartLoading, cartError, isAuthed, line, router]);

  // Every hook above this line, none below: the skeleton early-return must
  // not change the hook count between renders (that is what threw when the
  // tab came back and account data reloaded).
  const selectedAddress = addresses.find((a) => a.id === addressId) ?? null;
  // The delivery fee follows the address: the moment one is chosen, the cart
  // re-quotes for that pincode (instant for rule modes, Shiprocket for live).
  const selectedPincode = selectedAddress?.pincode ?? '';
  useEffect(() => {
    if (selectedPincode) setDeliveryPincode(selectedPincode);
  }, [selectedPincode, setDeliveryPincode]);

  if (submitted.current || authLoading || cartLoading || dataLoading || !line || !isAuthed) {
    return (
      <main id="main" className="min-h-[70vh] bg-paper">
        <div className="mx-auto max-w-6xl px-6 pb-20 pt-28 sm:px-10 md:px-14 md:pt-36">
          <div className="h-8 w-44 animate-pulse bg-paper-200" />
          <div className="mt-8 h-64 w-full animate-pulse bg-paper-200" />
        </div>
      </main>
    );
  }

  async function submit() {
    setError('');
    if (!selectedAddress) {
      return setError('Choose a delivery address, or add a new one, before placing your order.');
    }
    setPlacing(true);

    const result = await placeOrder({
      line: line!,
      address: selectedAddress,
      paymentMethod: payment,
      couponCode: coupon?.code,
    });

    if (!result.ok) {
      setPlacing(false);
      // The order may already exist and simply be unpaid — say which one, so
      // nobody starts again and pays twice.
      setError(
        result.reference
          ? `${result.message} Your order ${result.reference} is saved and unpaid — you can pay for it from your account.`
          : result.message,
      );
      return;
    }

    // From here the order is placed — the cart is about to be emptied, and the
    // empty-cart guard must not read that as "nothing to buy".
    submitted.current = true;
    clear();
    // Pull the new order (and any subscription it started) into the account.
    await refresh();
    router.push(`/checkout/success?ref=${encodeURIComponent(result.order.reference)}`);
  }

  return (
    <main id="main" className="bg-paper">
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-28 sm:px-10 md:px-14 md:pt-36">
        {/* Heading */}
        <div className="flex items-end justify-between gap-6">
          <h1 className="font-condensed text-[clamp(2.25rem,6vw,4rem)] font-black uppercase italic leading-[0.9] tracking-tight text-fg">
            Checkout
          </h1>
          <Link
            href="/cart"
            className="hidden shrink-0 font-quantico text-body-sm font-bold uppercase tracking-[0.12em] text-fg-muted underline decoration-paper-300 underline-offset-4 transition-colors hover:text-fg sm:block"
          >
            Back to cart
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-14">
          <div className="space-y-10">
            {/* Address */}
            <section aria-labelledby="ck-address">
              <h2 id="ck-address" className="mb-4 font-quantico text-caption font-bold uppercase tracking-[0.16em] text-fg-muted">
                Deliver to
              </h2>
              <AddressPicker selectedId={addressId} onSelect={setAddressId} />
            </section>

            {/* Payment */}
            <section aria-labelledby="ck-payment">
              <h2 id="ck-payment" className="mb-4 font-quantico text-caption font-bold uppercase tracking-[0.16em] text-fg-muted">
                Pay with
              </h2>
              <PaymentPicker
                value={payment}
                onChange={setPayment}
                isSubscription={isSubscription}
                codEnabled={settings.codEnabled}
              />
            </section>
          </div>

          {/* =========================== SUMMARY =========================== */}
          <aside aria-label="Order summary" className="lg:sticky lg:top-28 lg:self-start">
            <div className="border-2 border-paper-200 p-6">
              <h2 className="font-condensed text-2xl font-black uppercase italic tracking-tight text-fg">
                Your Order
              </h2>

              {/* Line */}
              <div className="mt-6 flex gap-4 border-b border-paper-200 pb-5">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-white dark:bg-paper">
                  {thumb ? <Image src={thumb} alt="" fill sizes="64px" className="object-contain" /> : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-quantico text-body-sm font-bold uppercase tracking-wide text-fg">
                    {line.tierName}
                  </p>
                  <p className="mt-0.5 font-pt text-caption text-fg-muted">
                    {line.packets}
                    {isSubscription ? ' · every 4 weeks' : ` · qty ${line.quantity}`}
                  </p>
                </div>
                <p className="shrink-0 font-quantico text-body-sm font-bold text-fg">
                  {inr(line.price * line.quantity)}
                </p>
              </div>

              <dl className="mt-5 space-y-3.5 font-pt text-body-sm">
                <div className="flex justify-between">
                  <dt className="text-fg-muted">Subtotal</dt>
                  <dd className="font-quantico font-bold text-fg">{inr(subtotal)}</dd>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-fg-muted">Subscription saving</dt>
                    <dd className="font-quantico font-bold text-accent-pressed dark:text-accent">
                      −{inr(savings)}
                    </dd>
                  </div>
                )}
                {discount > 0 && coupon && (
                  <div className="flex justify-between">
                    <dt className="text-fg-muted">
                      Coupon <span className="font-bold text-fg">{coupon.code}</span>
                    </dt>
                    <dd className="font-quantico font-bold text-accent-pressed dark:text-accent">
                      −{inr(discount)}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-fg-muted">Delivery</dt>
                  <dd
                    className={`text-right font-quantico font-bold uppercase tracking-wide ${
                      shippingKnown && shipping === 0 ? 'text-accent-pressed dark:text-accent' : 'text-fg'
                    }`}
                  >
                    {!shippingKnown ? (deliveryLoading ? 'Checking…' : 'Choose address') : shipping === 0 ? 'Free' : inr(shipping)}
                  </dd>
                </div>
                {delivery?.source === 'shiprocket' && delivery.courier && (
                  <div className="flex justify-between">
                    <dt className="text-fg-muted">Courier</dt>
                    <dd className="text-right text-fg">
                      {delivery.courier}
                      {delivery.days ? ` · ${delivery.days} day${delivery.days === 1 ? '' : 's'}` : delivery.etd ? ` · by ${delivery.etd}` : ''}
                    </dd>
                  </div>
                )}
              </dl>

              <div className="mt-5 flex items-baseline justify-between border-t-2 border-paper-200 pt-5">
                <span className="font-quantico text-caption font-bold uppercase tracking-[0.12em] text-fg-muted">
                  {isSubscription ? 'Per cycle' : 'Total'}
                </span>
                <span className="font-condensed text-3xl font-black tracking-tight text-fg">
                  {inr(total)}
                </span>
              </div>

              {error && (
                <p role="alert" className="mt-5 bg-danger/10 px-4 py-3 font-pt text-body-sm font-bold text-danger">
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={submit}
                disabled={placing || (Boolean(selectedAddress) && !shippingKnown)}
                className="mt-6 flex min-h-[56px] w-full cursor-pointer items-center justify-center gap-2 bg-accent px-6 py-4 font-quantico text-body-sm font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-accent-hover disabled:opacity-70"
              >
                {placing ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/30 border-t-ink" />
                    {payment === 'cod' ? 'Placing order…' : 'Opening payment…'}
                  </>
                ) : (
                  <>
                    {payment === 'cod' ? 'Place Order' : `Pay ${inr(total)}`}
                    {IconArrow}
                  </>
                )}
              </button>

              <p className="mt-3.5 text-center font-pt text-caption text-fg-subtle">
                {payment === 'cod'
                  ? 'Pay in cash when your order arrives.'
                  : 'You’ll be taken to a secure Cashfree window.'}
              </p>
            </div>

            <Link
              href="/cart"
              className="mt-5 block text-center font-quantico text-body-sm font-bold uppercase tracking-[0.12em] text-fg-muted underline decoration-paper-300 underline-offset-4 transition-colors hover:text-fg sm:hidden"
            >
              Back to cart
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
