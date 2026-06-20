'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import { useCheckout } from './CheckoutContext';
import { PRODUCT_IMAGES } from './productMedia';

function fmt(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}

const STEPS = ['Details', 'Delivery', 'Review', 'Payment'] as const;

const inputCls =
  'w-full border border-paper-200 bg-white px-4 py-3 font-pt text-body text-fg outline-none transition-colors placeholder:text-fg-subtle focus:border-brand-blue';
const labelCls =
  'mb-1.5 block font-quantico text-[11px] font-bold uppercase tracking-[0.14em] text-fg-muted';

const PAYMENTS = [
  { id: 'upi', title: 'UPI', sub: 'Google Pay, PhonePe, Paytm & more' },
  { id: 'card', title: 'Card', sub: 'Credit or debit card' },
  { id: 'cod', title: 'Cash on Delivery', sub: 'Pay when your order arrives' },
];

const ctaGradient =
  'linear-gradient(90deg, #000204 0%, #02063A 35%, #0821D2 100%)';

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
  const { plan, close } = useCheckout();

  const [step, setStep] = useState(0); // 0..3 steps, 4 = success
  const [form, setForm] = useState<Form>(EMPTY);
  const [qty, setQty] = useState(1);
  const [payment, setPayment] = useState('upi');
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Reset whenever a new plan is opened.
  useEffect(() => {
    if (plan) {
      setStep(0);
      setError('');
      setPlacing(false);
      setOrderId('');
      setQty(1);
      setPayment('upi');
    }
  }, [plan]);

  // Lock body scroll while open; close on Escape.
  useEffect(() => {
    if (!plan) return;
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
  }, [plan, close]);

  if (!plan) return null;

  const isSubscription = plan.id === 'subscription';
  const lineQty = isSubscription ? 1 : qty;
  const total = plan.price * lineQty;

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
      plan: { id: plan!.id, name: plan!.name },
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
      className="fixed inset-0 z-[10000] flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Checkout"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close checkout"
        onClick={close}
        className="absolute inset-0 cursor-default bg-ink/70 backdrop-blur-sm"
      />

      {/* Panel */}
      <div className="relative flex max-h-[94vh] w-full max-w-lg flex-col overflow-hidden bg-white shadow-elevated sm:max-h-[90vh]">
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 text-white"
          style={{ background: ctaGradient }}
        >
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 shrink-0 overflow-hidden bg-white/10">
              <Image
                src={PRODUCT_IMAGES.front}
                alt=""
                fill
                sizes="36px"
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-quantico text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                The Brain Battery
              </p>
              <p className="font-quantico text-body-sm font-bold uppercase tracking-wide">
                {success ? 'Order Confirmed' : plan.name}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="flex h-9 w-9 cursor-pointer items-center justify-center text-white/80 transition-colors hover:text-white"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </div>

        {/* Step indicator */}
        {!success && (
          <div className="flex items-center gap-1.5 border-b border-paper-200 px-6 py-3">
            {STEPS.map((label, i) => (
              <div key={label} className="flex flex-1 items-center gap-1.5">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center font-quantico text-[11px] font-bold ${
                    i < step
                      ? 'bg-brand-blue text-white'
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
                  <span className={`h-px flex-1 ${i < step ? 'bg-brand-blue' : 'bg-paper-200'}`} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* STEP 1 — Customer details */}
          {step === 0 && (
            <div className="space-y-4">
              <p className="font-quantico text-body-sm font-bold uppercase tracking-wide text-fg">
                Your Details
              </p>
              <div>
                <label htmlFor="co-name" className={labelCls}>Full Name</label>
                <input id="co-name" className={inputCls} value={form.name} autoComplete="name" onChange={(e) => set('name', e.target.value)} />
              </div>
              <div>
                <label htmlFor="co-phone" className={labelCls}>Phone Number</label>
                <input id="co-phone" type="tel" className={inputCls} value={form.phone} autoComplete="tel" placeholder="+91 …" onChange={(e) => set('phone', e.target.value)} />
              </div>
              <div>
                <label htmlFor="co-email" className={labelCls}>Email Address</label>
                <input id="co-email" type="email" className={inputCls} value={form.email} autoComplete="email" placeholder="you@example.com" onChange={(e) => set('email', e.target.value)} />
              </div>
            </div>
          )}

          {/* STEP 2 — Delivery */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="font-quantico text-body-sm font-bold uppercase tracking-wide text-fg">
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="co-city" className={labelCls}>City</label>
                  <input id="co-city" className={inputCls} value={form.city} autoComplete="address-level2" onChange={(e) => set('city', e.target.value)} />
                </div>
                <div>
                  <label htmlFor="co-state" className={labelCls}>State</label>
                  <input id="co-state" className={inputCls} value={form.state} autoComplete="address-level1" onChange={(e) => set('state', e.target.value)} />
                </div>
              </div>
              <div>
                <label htmlFor="co-pincode" className={labelCls}>Pincode</label>
                <input id="co-pincode" inputMode="numeric" maxLength={6} className={inputCls} value={form.pincode} autoComplete="postal-code" onChange={(e) => set('pincode', e.target.value.replace(/\D/g, ''))} />
              </div>
            </div>
          )}

          {/* STEP 3 — Review */}
          {step === 2 && (
            <div className="space-y-5">
              <p className="font-quantico text-body-sm font-bold uppercase tracking-wide text-fg">
                Review Your Order
              </p>

              <div className="border border-paper-200">
                <div className="flex items-start justify-between gap-3 border-b border-paper-200 p-4">
                  <div>
                    <p className="font-quantico text-body-sm font-bold uppercase tracking-wide text-fg">
                      {plan.name}
                    </p>
                    <p className="mt-0.5 font-pt text-caption text-fg-muted">{plan.servings}</p>
                  </div>
                  {!isSubscription ? (
                    <div className="flex shrink-0 items-center border border-paper-200">
                      <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-8 w-8 cursor-pointer items-center justify-center text-fg transition-colors hover:bg-paper-100">−</button>
                      <span className="w-8 text-center font-quantico text-body-sm font-bold text-fg">{qty}</span>
                      <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(9, q + 1))} className="flex h-8 w-8 cursor-pointer items-center justify-center text-fg transition-colors hover:bg-paper-100">+</button>
                    </div>
                  ) : (
                    <span className="shrink-0 bg-accent px-2 py-1 font-quantico text-[10px] font-bold uppercase tracking-wide text-ink">
                      Monthly
                    </span>
                  )}
                </div>

                <dl className="space-y-2.5 p-4 font-pt text-body-sm">
                  <div className="flex justify-between">
                    <dt className="text-fg-muted">Price</dt>
                    <dd className="font-quantico font-bold text-fg">{fmt(plan.price)}{isSubscription ? ' / mo' : ''}</dd>
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

                <div className="flex items-baseline justify-between border-t border-paper-200 bg-paper-50 p-4">
                  <span className="font-quantico text-caption font-bold uppercase tracking-wider text-fg-muted">
                    {isSubscription ? 'Billed Monthly' : 'Final Amount'}
                  </span>
                  <span className="font-quantico text-[1.5rem] font-bold text-fg">
                    {fmt(total)}{isSubscription ? ' / mo' : ''}
                  </span>
                </div>
              </div>

              <p className="font-pt text-caption text-fg-subtle">
                Price inclusive of all taxes. {isSubscription ? 'Cancel anytime — no lock-in.' : 'No hidden charges.'}
              </p>
            </div>
          )}

          {/* STEP 4 — Payment */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="font-quantico text-body-sm font-bold uppercase tracking-wide text-fg">
                Payment Method
              </p>
              <div className="space-y-3">
                {PAYMENTS.map((p) => (
                  <label
                    key={p.id}
                    className={`flex cursor-pointer items-center gap-4 border bg-white px-4 py-3.5 transition-colors ${
                      payment === p.id ? 'border-brand-blue ring-1 ring-brand-blue' : 'border-paper-200 hover:border-paper-300'
                    }`}
                  >
                    <input type="radio" name="co-payment" value={p.id} checked={payment === p.id} onChange={() => setPayment(p.id)} className="sr-only" />
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
              <div className="flex items-baseline justify-between border-t border-paper-200 pt-4">
                <span className="font-quantico text-caption font-bold uppercase tracking-wider text-fg-muted">
                  {isSubscription ? 'Billed Monthly' : 'Total'}
                </span>
                <span className="font-quantico text-[1.375rem] font-bold text-fg">
                  {fmt(total)}{isSubscription ? ' / mo' : ''}
                </span>
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
            <div className="py-4 text-center">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent text-ink">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12.5 10 17.5 19 7" />
                </svg>
              </span>
              <h3 className="mt-5 font-condensed text-3xl font-black uppercase italic leading-none tracking-tight text-fg md:text-4xl">
                You&rsquo;re All Set
              </h3>
              <p className="mx-auto mt-3 max-w-sm font-pt text-body text-fg-muted">
                Thanks for fuelling better thinking with 10X. A confirmation has been
                sent to <span className="font-bold text-fg">{form.email}</span>.
              </p>
              <p className="mt-5 inline-block bg-paper-100 px-4 py-2 font-quantico text-body-sm font-bold uppercase tracking-wider text-fg">
                Order #{orderId}
              </p>

              <div className="mt-6 border border-paper-200 p-4 text-left">
                <p className="font-quantico text-[11px] font-bold uppercase tracking-[0.14em] text-fg-subtle">
                  What happens next
                </p>
                <ol className="mt-3 space-y-2.5 font-pt text-body-sm text-fg-muted">
                  <li className="flex gap-2.5"><span className="font-quantico font-bold text-brand-blue">1</span> We&rsquo;re preparing your {plan.name.toLowerCase()}.</li>
                  <li className="flex gap-2.5"><span className="font-quantico font-bold text-brand-blue">2</span> You&rsquo;ll get tracking on {form.phone}.</li>
                  <li className="flex gap-2.5"><span className="font-quantico font-bold text-brand-blue">3</span> Delivered fast — start fuelling better thinking.</li>
                </ol>
              </div>
            </div>
          )}

          {error && !success && (
            <p role="alert" className="mt-4 font-pt text-body-sm text-danger">{error}</p>
          )}
        </div>

        {/* Footer actions */}
        <div className="border-t border-paper-200 px-6 py-4">
          {success ? (
            <button
              type="button"
              onClick={close}
              className="inline-flex w-full cursor-pointer items-center justify-center bg-accent px-6 py-3.5 font-quantico text-body-sm font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-accent-hover"
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
                  className="inline-flex shrink-0 cursor-pointer items-center justify-center border border-paper-200 px-5 py-3.5 font-quantico text-caption font-bold uppercase tracking-wider text-fg transition-colors hover:border-paper-300 disabled:opacity-50"
                >
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={next}
                  className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 px-6 py-3.5 font-quantico text-body-sm font-bold uppercase tracking-[0.16em] text-white transition hover:opacity-90"
                  style={{ background: ctaGradient }}
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
                  className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 bg-accent px-6 py-3.5 font-quantico text-body-sm font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-accent-hover disabled:opacity-70"
                >
                  {placing ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/30 border-t-ink" />
                      Processing…
                    </>
                  ) : (
                    <>Pay {fmt(total)}{isSubscription ? ' / mo' : ''}</>
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
