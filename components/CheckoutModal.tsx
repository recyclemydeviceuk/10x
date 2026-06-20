'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import { useCheckout } from './CheckoutContext';
import { PRODUCT_IMAGES } from './productMedia';

function fmt(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}

const STEPS = ['Details', 'Delivery', 'Review', 'Payment'] as const;

// Reference-style fields: dark filled, rounded, light text, green focus.
const inputCls =
  'w-full rounded-xl border-2 border-ink bg-ink px-5 py-3.5 font-pt text-body text-white outline-none transition-colors placeholder:text-white/35 focus:border-accent';
const labelCls =
  'mb-2 block font-quantico text-[11px] font-bold uppercase tracking-[0.16em] text-fg-muted';

const PAYMENTS = [
  { id: 'upi', title: 'UPI', sub: 'Google Pay, PhonePe, Paytm & more' },
  { id: 'card', title: 'Card', sub: 'Credit or debit card' },
  { id: 'cod', title: 'Cash on Delivery', sub: 'Pay when your order arrives' },
];

type Form = {
  name: string;
  phone: string;
  email: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
};

const EMPTY: Form = {
  name: '', phone: '', email: '',
  line1: '', line2: '', city: '', state: '', pincode: '',
};

export default function CheckoutModal() {
  const { selection, close } = useCheckout();

  const [step, setStep] = useState(0); // 0..3 steps, 4 = success
  const [form, setForm] = useState<Form>(EMPTY);
  const [qty, setQty] = useState(1);
  const [payment, setPayment] = useState('upi');
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    if (selection) {
      setStep(0);
      setError('');
      setPlacing(false);
      setOrderId('');
      setQty(1);
      setPayment('upi');
    }
  }, [selection]);

  useEffect(() => {
    if (!selection) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [selection, close]);

  if (!selection) return null;

  const isSubscription = selection.isSubscription;
  const lineQty = isSubscription ? 1 : qty;
  const total = selection.price * lineQty;

  function set<K extends keyof Form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function next() {
    setError('');
    if (step === 0) {
      if (!form.name.trim()) return setError('Please enter your full name.');
      if (!/^[+\d][\d\s-]{7,}$/.test(form.phone.trim()))
        return setError('Enter a valid phone number.');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
        return setError('Enter a valid email address.');
    }
    if (step === 1) {
      if (!form.line1.trim()) return setError('Please enter your address.');
      if (!form.city.trim()) return setError('Please enter your city.');
      if (!form.state.trim()) return setError('Please enter your state.');
      if (!/^\d{6}$/.test(form.pincode.trim()))
        return setError('Enter a valid 6-digit pincode.');
    }
    setStep((s) => s + 1);
  }

  function back() {
    setError('');
    setStep((s) => Math.max(0, s - 1));
  }

  function pay() {
    setPlacing(true);
    const id = `10X-${Math.floor(100000 + Math.random() * 900000)}`;
    const order = {
      id,
      date: new Date().toISOString(),
      status: 'Confirmed',
      product: selection!.productName,
      tier: selection!.tierName,
      subscription: selection!.isSubscription,
      qty: lineQty,
      total,
      payment,
      customer: { name: form.name, phone: form.phone, email: form.email },
      address: {
        line1: form.line1, line2: form.line2, city: form.city,
        state: form.state, pincode: form.pincode,
      },
    };
    try {
      window.localStorage.setItem(`10x:order:${id}`, JSON.stringify(order));
      window.localStorage.setItem('10x:order:last', id);
    } catch {
      // ignore
    }
    window.setTimeout(() => {
      setOrderId(id);
      setPlacing(false);
      setStep(4);
    }, 900);
  }

  const success = step === 4;

  return (
    <div
      className="fixed inset-0 z-[10000] flex flex-col bg-white"
      role="dialog"
      aria-modal="true"
      aria-label="Checkout"
    >
      {/* ===== Header (green) ===== */}
      <div className="flex shrink-0 items-center justify-between bg-accent px-6 py-4 sm:px-10">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden bg-white/40">
            <Image src={PRODUCT_IMAGES.front} alt="" fill sizes="40px" className="object-cover" />
          </div>
          <div>
            <p className="font-quantico text-[10px] font-bold uppercase tracking-[0.2em] text-ink/70">
              10X Day Time
            </p>
            <p className="font-quantico text-body-sm font-bold uppercase tracking-wide text-ink">
              {success ? 'Order Confirmed' : selection.tierName}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="flex h-10 w-10 cursor-pointer items-center justify-center text-ink/80 transition-colors hover:text-ink"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        </button>
      </div>

      {/* ===== Step indicator ===== */}
      {!success && (
        <div className="mx-auto flex w-full max-w-2xl shrink-0 items-center gap-1.5 px-6 py-5 sm:px-10">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-1 items-center gap-1.5">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center font-quantico text-[11px] font-bold ${
                  i < step
                    ? 'bg-ink text-white'
                    : i === step
                      ? 'bg-accent text-ink'
                      : 'bg-paper-100 text-fg-subtle'
                }`}
              >
                {i < step ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M5 12.5 10 17.5 19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </span>
              <span
                className={`hidden font-quantico text-[10px] font-bold uppercase tracking-wide sm:block ${
                  i === step ? 'text-fg' : 'text-fg-subtle'
                }`}
              >
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <span className={`h-px flex-1 ${i < step ? 'bg-ink' : 'bg-paper-200'}`} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* ===== Body ===== */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-2xl px-6 py-8 sm:px-10">
          {/* STEP 1 — Customer details */}
          {step === 0 && (
            <div className="space-y-5">
              <p className="font-condensed text-2xl font-black uppercase italic tracking-tight text-ink">
                Your Details
              </p>
              <div>
                <label htmlFor="co-name" className={labelCls}>Full Name</label>
                <input id="co-name" className={inputCls} value={form.name} autoComplete="name" onChange={(e) => set('name', e.target.value)} />
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="co-phone" className={labelCls}>Phone Number</label>
                  <input id="co-phone" type="tel" className={inputCls} value={form.phone} autoComplete="tel" placeholder="+91 …" onChange={(e) => set('phone', e.target.value)} />
                </div>
                <div>
                  <label htmlFor="co-email" className={labelCls}>Email Address</label>
                  <input id="co-email" type="email" className={inputCls} value={form.email} autoComplete="email" placeholder="you@example.com" onChange={(e) => set('email', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 — Delivery */}
          {step === 1 && (
            <div className="space-y-5">
              <p className="font-condensed text-2xl font-black uppercase italic tracking-tight text-ink">
                Delivery Address
              </p>
              <div>
                <label htmlFor="co-line1" className={labelCls}>Address</label>
                <input id="co-line1" className={inputCls} value={form.line1} autoComplete="address-line1" placeholder="House / flat, street" onChange={(e) => set('line1', e.target.value)} />
              </div>
              <div>
                <label htmlFor="co-line2" className={labelCls}>Apartment, landmark (optional)</label>
                <input id="co-line2" className={inputCls} value={form.line2} autoComplete="address-line2" onChange={(e) => set('line2', e.target.value)} />
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div>
                  <label htmlFor="co-city" className={labelCls}>City</label>
                  <input id="co-city" className={inputCls} value={form.city} autoComplete="address-level2" onChange={(e) => set('city', e.target.value)} />
                </div>
                <div>
                  <label htmlFor="co-state" className={labelCls}>State</label>
                  <input id="co-state" className={inputCls} value={form.state} autoComplete="address-level1" onChange={(e) => set('state', e.target.value)} />
                </div>
                <div>
                  <label htmlFor="co-pincode" className={labelCls}>Pincode</label>
                  <input id="co-pincode" inputMode="numeric" maxLength={6} className={inputCls} value={form.pincode} autoComplete="postal-code" onChange={(e) => set('pincode', e.target.value.replace(/\D/g, ''))} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 — Review */}
          {step === 2 && (
            <div className="space-y-5">
              <p className="font-condensed text-2xl font-black uppercase italic tracking-tight text-ink">
                Review Your Order
              </p>

              <div className="overflow-hidden rounded-xl border border-paper-200">
                <div className="flex items-start justify-between gap-3 border-b border-paper-200 p-5">
                  <div>
                    <p className="font-quantico text-body-sm font-bold uppercase tracking-wide text-fg">
                      {selection.tierName}
                    </p>
                    <p className="mt-0.5 font-pt text-caption text-fg-muted">{selection.packets}</p>
                  </div>
                  {!isSubscription ? (
                    <div className="flex shrink-0 items-center rounded-lg border border-paper-200">
                      <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-9 w-9 cursor-pointer items-center justify-center text-fg transition-colors hover:bg-paper-100">−</button>
                      <span className="w-8 text-center font-quantico text-body-sm font-bold text-fg">{qty}</span>
                      <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(9, q + 1))} className="flex h-9 w-9 cursor-pointer items-center justify-center text-fg transition-colors hover:bg-paper-100">+</button>
                    </div>
                  ) : (
                    <span className="shrink-0 bg-accent px-2 py-1 font-quantico text-[10px] font-bold uppercase tracking-wide text-ink">
                      Subscription
                    </span>
                  )}
                </div>

                <dl className="space-y-2.5 p-5 font-pt text-body-sm">
                  <div className="flex justify-between">
                    <dt className="text-fg-muted">Price</dt>
                    <dd className="font-quantico font-bold text-fg">{fmt(selection.price)}</dd>
                  </div>
                  {!isSubscription && (
                    <div className="flex justify-between">
                      <dt className="text-fg-muted">Quantity</dt>
                      <dd className="font-quantico font-bold text-fg">{qty}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-fg-muted">Shipping</dt>
                    <dd className="font-quantico font-bold text-success">Free</dd>
                  </div>
                </dl>

                <div className="flex items-baseline justify-between border-t border-paper-200 bg-paper-50 p-5">
                  <span className="font-quantico text-caption font-bold uppercase tracking-wider text-fg-muted">
                    {isSubscription ? 'Recurring Total' : 'Final Amount'}
                  </span>
                  <span className="font-quantico text-[1.6rem] font-bold text-ink">{fmt(total)}</span>
                </div>
              </div>

              <p className="font-pt text-caption text-fg-subtle">
                Price inclusive of all taxes. {isSubscription ? 'Auto-renews — edit or cancel anytime.' : 'No hidden charges.'}
              </p>
            </div>
          )}

          {/* STEP 4 — Payment */}
          {step === 3 && (
            <div className="space-y-5">
              <p className="font-condensed text-2xl font-black uppercase italic tracking-tight text-ink">
                Payment Method
              </p>
              <div className="space-y-3">
                {PAYMENTS.map((p) => (
                  <label
                    key={p.id}
                    className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 bg-white px-5 py-4 transition-colors ${
                      payment === p.id ? 'border-ink' : 'border-paper-200 hover:border-paper-300'
                    }`}
                  >
                    <input type="radio" name="co-payment" value={p.id} checked={payment === p.id} onChange={() => setPayment(p.id)} className="sr-only" />
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${payment === p.id ? 'border-ink' : 'border-paper-300'}`}>
                      {payment === p.id && <span className="h-2.5 w-2.5 rounded-full bg-accent" />}
                    </span>
                    <span>
                      <span className="block font-quantico text-body-sm font-bold uppercase tracking-wide text-fg">{p.title}</span>
                      <span className="block font-pt text-caption text-fg-muted">{p.sub}</span>
                    </span>
                  </label>
                ))}
              </div>
              <div className="flex items-baseline justify-between border-t border-paper-200 pt-4">
                <span className="font-quantico text-caption font-bold uppercase tracking-wider text-fg-muted">
                  {isSubscription ? 'Recurring Total' : 'Total'}
                </span>
                <span className="font-quantico text-[1.5rem] font-bold text-ink">{fmt(total)}</span>
              </div>
              <p className="flex items-center gap-1.5 font-pt text-caption text-fg-subtle">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <rect x="4" y="11" width="16" height="9" rx="1.5" />
                  <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                </svg>
                Secure, encrypted checkout. Payment is simulated for this demo.
              </p>
            </div>
          )}

          {/* STEP 5 — Success */}
          {success && (
            <div className="py-10 text-center">
              <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent text-ink">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12.5 10 17.5 19 7" />
                </svg>
              </span>
              <h3 className="mt-6 font-condensed text-3xl font-black uppercase italic leading-none tracking-tight text-ink md:text-4xl">
                You&rsquo;re All Set
              </h3>
              <p className="mx-auto mt-3 max-w-md font-pt text-body text-fg-muted">
                Thanks for fuelling better thinking with 10X. A confirmation has been
                sent to <span className="font-bold text-fg">{form.email}</span>.
              </p>
              <p className="mt-5 inline-block bg-paper-100 px-4 py-2 font-quantico text-body-sm font-bold uppercase tracking-wider text-fg">
                Order #{orderId}
              </p>

              <div className="mx-auto mt-7 max-w-md rounded-xl border border-paper-200 p-5 text-left">
                <p className="font-quantico text-[11px] font-bold uppercase tracking-[0.16em] text-fg-subtle">
                  What happens next
                </p>
                <ol className="mt-3 space-y-2.5 font-pt text-body-sm text-fg-muted">
                  <li className="flex gap-2.5"><span className="font-quantico font-bold text-ink">1</span> We&rsquo;re preparing your {selection.tierName.toLowerCase()}.</li>
                  <li className="flex gap-2.5"><span className="font-quantico font-bold text-ink">2</span> You&rsquo;ll get tracking on {form.phone}.</li>
                  <li className="flex gap-2.5"><span className="font-quantico font-bold text-ink">3</span> Delivered fast — start fuelling better thinking.</li>
                </ol>
              </div>
            </div>
          )}

          {error && !success && (
            <p role="alert" className="mt-4 font-pt text-body-sm text-danger">{error}</p>
          )}
        </div>
      </div>

      {/* ===== Footer actions ===== */}
      <div className="shrink-0 border-t border-paper-200">
        <div className="mx-auto w-full max-w-2xl px-6 py-4 sm:px-10">
          {success ? (
            <button
              type="button"
              onClick={close}
              className="inline-flex w-full cursor-pointer items-center justify-center bg-accent px-6 py-4 font-quantico text-body-sm font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-accent-hover"
            >
              Done
            </button>
          ) : (
            <div className="flex items-center gap-3">
              {step > 0 && (
                <button
                  type="button"
                  onClick={back}
                  disabled={placing}
                  className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-xl border border-paper-300 px-6 py-4 font-quantico text-caption font-bold uppercase tracking-wider text-fg transition-colors hover:border-fg disabled:opacity-50"
                >
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={next}
                  className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 bg-accent px-6 py-4 font-quantico text-body-sm font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-accent-hover"
                >
                  Continue
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={pay}
                  disabled={placing}
                  className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 bg-accent px-6 py-4 font-quantico text-body-sm font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-accent-hover disabled:opacity-70"
                >
                  {placing ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/30 border-t-ink" />
                      Processing…
                    </>
                  ) : (
                    <>Pay {fmt(total)}</>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
