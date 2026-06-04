'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useCart } from '../../components/CartContext';

function fmt(n: number) {
  return `₹${Math.floor(n).toLocaleString('en-IN')}`;
}

const inputCls =
  'w-full border-2 border-paper-200 bg-white px-4 py-3 font-pt text-body text-fg outline-none transition-colors placeholder:text-fg-subtle focus:border-brand-blue';

const labelCls = 'mb-1.5 block font-quantico text-caption font-bold uppercase tracking-wider text-fg-muted';

const PAYMENTS = [
  { id: 'cod', title: 'Cash on Delivery', sub: 'Pay when your order arrives' },
  { id: 'upi', title: 'UPI', sub: 'Google Pay, PhonePe, Paytm & more' },
  { id: 'card', title: 'Card', sub: 'Credit or debit card' },
];

export default function CheckoutPage() {
  const { items, totals, count, clear } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    name: '', email: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '',
  });
  const [payment, setPayment] = useState('cod');
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.line1.trim() || !form.city.trim()) {
      setError('Please fill in your name, phone, address and city.');
      return;
    }
    if (!/^\d{6}$/.test(form.pincode.trim())) {
      setError('Enter a valid 6-digit pincode.');
      return;
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('Enter a valid email address.');
      return;
    }
    setError('');
    setPlacing(true);

    const id = `10X-${Math.floor(100000 + Math.random() * 900000)}`;
    const order = {
      id,
      date: new Date().toISOString(),
      items: items.map((i) => ({ name: i.name, pack: i.pack, qty: i.quantity, price: i.price })),
      totals: {
        subtotal: totals.subtotal,
        shipping: totals.shipping,
        gst: totals.gst,
        grandTotal: totals.grandTotal,
      },
      address: { ...form },
      payment,
    };
    try {
      window.localStorage.setItem(`10x:order:${id}`, JSON.stringify(order));
      window.localStorage.setItem('10x:order:last', id);
    } catch {
      // ignore
    }
    window.setTimeout(() => {
      router.push(`/checkout/success?id=${id}`);
      window.setTimeout(() => clear(), 200);
    }, 700);
  }

  // Placing state — avoids empty-cart flash while navigating.
  if (placing) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-paper-100 px-6 pt-16 md:pt-20">
        <div className="text-center">
          <span className="mx-auto flex h-12 w-12 animate-spin items-center justify-center rounded-full border-2 border-paper-200 border-t-brand-blue" />
          <p className="mt-5 font-quantico text-body font-bold uppercase tracking-wide text-fg">Placing your order…</p>
        </div>
      </main>
    );
  }

  if (count === 0) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-paper-100 px-6 pt-16 md:pt-20">
        <div className="text-center">
          <h1 className="font-condensed text-display-md font-black uppercase italic tracking-tight text-fg">
            Your cart is empty
          </h1>
          <p className="mt-2 font-pt text-body text-fg-muted">Add 10X Daytime to get started.</p>
          <Link
            href="/products/10x-daytime"
            className="mt-6 inline-flex cursor-pointer items-center bg-accent px-7 py-3 font-quantico text-body-sm font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-accent-hover"
          >
            Shop 10X Daytime
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main id="main" className="bg-paper-100 pt-16 md:pt-20">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10 md:px-14 md:py-14">
        {/* Heading */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 font-pt text-caption text-fg-muted">
          <Link href="/products/10x-daytime" className="transition-colors hover:text-fg">Shop</Link>
          <span aria-hidden>/</span>
          <span className="text-fg">Checkout</span>
        </nav>
        <h1 className="font-condensed text-[clamp(2rem,4.5vw,3rem)] font-black uppercase italic leading-none tracking-tight text-fg">
          Checkout
        </h1>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
          {/* ===== Left: form ===== */}
          <form id="checkout-form" onSubmit={placeOrder} className="space-y-10">
            {/* Contact */}
            <section>
              <h2 className="mb-5 flex items-center gap-3 font-quantico text-body-lg font-bold uppercase tracking-wide text-fg">
                <span className="flex h-7 w-7 items-center justify-center bg-ink font-quantico text-caption text-white">1</span>
                Contact
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className={labelCls}>Full name *</label>
                  <input id="name" className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" />
                </div>
                <div>
                  <label htmlFor="phone" className={labelCls}>Phone *</label>
                  <input id="phone" type="tel" className={inputCls} value={form.phone} onChange={(e) => set('phone', e.target.value)} autoComplete="tel" placeholder="+91 …" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="email" className={labelCls}>Email</label>
                  <input id="email" type="email" className={inputCls} value={form.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" placeholder="you@example.com" />
                </div>
              </div>
            </section>

            {/* Address */}
            <section>
              <h2 className="mb-5 flex items-center gap-3 font-quantico text-body-lg font-bold uppercase tracking-wide text-fg">
                <span className="flex h-7 w-7 items-center justify-center bg-ink font-quantico text-caption text-white">2</span>
                Delivery Address
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="line1" className={labelCls}>Address line 1 *</label>
                  <input id="line1" className={inputCls} value={form.line1} onChange={(e) => set('line1', e.target.value)} autoComplete="address-line1" />
                </div>
                <div>
                  <label htmlFor="line2" className={labelCls}>Address line 2</label>
                  <input id="line2" className={inputCls} value={form.line2} onChange={(e) => set('line2', e.target.value)} autoComplete="address-line2" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label htmlFor="city" className={labelCls}>City *</label>
                    <input id="city" className={inputCls} value={form.city} onChange={(e) => set('city', e.target.value)} autoComplete="address-level2" />
                  </div>
                  <div>
                    <label htmlFor="state" className={labelCls}>State</label>
                    <input id="state" className={inputCls} value={form.state} onChange={(e) => set('state', e.target.value)} autoComplete="address-level1" />
                  </div>
                  <div>
                    <label htmlFor="pincode" className={labelCls}>Pincode *</label>
                    <input id="pincode" inputMode="numeric" className={inputCls} value={form.pincode} onChange={(e) => set('pincode', e.target.value)} autoComplete="postal-code" />
                  </div>
                </div>
              </div>
            </section>

            {/* Payment */}
            <section>
              <h2 className="mb-5 flex items-center gap-3 font-quantico text-body-lg font-bold uppercase tracking-wide text-fg">
                <span className="flex h-7 w-7 items-center justify-center bg-ink font-quantico text-caption text-white">3</span>
                Payment
              </h2>
              <div className="space-y-3">
                {PAYMENTS.map((p) => (
                  <label
                    key={p.id}
                    className={`flex cursor-pointer items-center gap-4 border-2 bg-white px-5 py-4 transition-colors ${
                      payment === p.id ? 'border-brand-blue' : 'border-paper-200 hover:border-paper-300'
                    }`}
                  >
                    <input type="radio" name="payment" value={p.id} checked={payment === p.id} onChange={() => setPayment(p.id)} className="sr-only" />
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${payment === p.id ? 'border-brand-blue' : 'border-paper-300'}`}>
                      {payment === p.id && <span className="h-2.5 w-2.5 rounded-full bg-brand-blue" />}
                    </span>
                    <span>
                      <span className="block font-quantico text-body-sm font-bold uppercase tracking-wide text-fg">{p.title}</span>
                      <span className="block font-pt text-caption text-fg-muted">{p.sub}</span>
                    </span>
                  </label>
                ))}
              </div>
              <p className="mt-3 font-pt text-caption text-fg-subtle">
                Payment is simulated for this demo — no real charge is made.
              </p>
            </section>

            {error && <p role="alert" className="font-pt text-body-sm text-danger">{error}</p>}
          </form>

          {/* ===== Right: order summary ===== */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="border border-paper-200 bg-white p-6 shadow-card md:p-7">
              <h2 className="font-quantico text-body-lg font-bold uppercase tracking-wide text-fg">Order Summary</h2>

              <ul className="mt-5 space-y-4 border-b border-paper-200 pb-5">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-3">
                    <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-paper-100">
                      <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                    </div>
                    <div className="flex min-w-0 flex-1 items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-quantico text-body-sm font-bold text-fg">{item.name}</p>
                        <p className="mt-0.5 font-pt text-caption text-fg-muted">{item.pack} · Qty {item.quantity}</p>
                      </div>
                      <p className="whitespace-nowrap font-quantico text-body-sm font-bold text-fg">{fmt(item.price * item.quantity)}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <dl className="mt-5 space-y-2 font-pt text-body-sm">
                <div className="flex justify-between"><dt className="text-fg-muted">Subtotal</dt><dd className="font-quantico font-bold text-fg">{fmt(totals.subtotal)}</dd></div>
                <div className="flex justify-between">
                  <dt className="text-fg-muted">Shipping</dt>
                  <dd className="font-quantico font-bold">{totals.shippingIsFree ? <span className="text-success">FREE</span> : <span className="text-fg">{fmt(totals.shipping)}</span>}</dd>
                </div>
                <div className="flex justify-between"><dt className="text-fg-muted">GST (18%)</dt><dd className="font-quantico font-bold text-fg">{fmt(totals.gst)}</dd></div>
              </dl>

              <div className="mt-4 flex items-baseline justify-between border-t border-paper-200 pt-4">
                <span className="font-quantico text-caption font-bold uppercase tracking-wider text-fg-muted">Total</span>
                <span className="font-quantico text-[1.5rem] font-bold text-fg">{fmt(totals.grandTotal)}</span>
              </div>

              <button
                type="submit"
                form="checkout-form"
                className="mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-2 px-6 py-4 font-quantico text-body font-bold uppercase tracking-[0.18em] text-white shadow-elevated transition hover:opacity-90"
                style={{ background: 'linear-gradient(90deg, #000204 0%, #02063A 35%, #0821D2 100%)' }}
              >
                Place Order · {fmt(totals.grandTotal)}
              </button>
              <Link href="/products/10x-daytime" className="mt-3 block text-center font-quantico text-caption font-bold uppercase tracking-wider text-fg-muted transition-colors hover:text-fg">
                Continue Shopping
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
