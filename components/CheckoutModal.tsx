'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import { useCheckout } from './CheckoutContext';
import { PRODUCT_IMAGES } from './productMedia';

function fmt(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}

// ── Shared field styling — light, minimal, green focus ─────────────────
const labelCls =
  'mb-2 block font-quantico text-[11px] font-bold uppercase tracking-[0.14em] text-fg-muted';
const inputBase =
  'w-full rounded-2xl bg-paper-100 py-4 font-pt text-body text-ink outline-none ring-2 ring-transparent transition-colors placeholder:text-fg-subtle focus:bg-white focus:ring-accent';

// ── Icons ──────────────────────────────────────────────────────────────
const IconUser = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const IconPhone = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const IconMail = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" />
  </svg>
);
const IconPin = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IconPencil = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);
const IconArrow = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

// ── Reusable input with optional leading icon ──────────────────────────
function Field({
  id, label, icon, className = '', ...props
}: {
  id: string;
  label: string;
  icon?: ReactNode;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <label htmlFor={id} className={labelCls}>{label}</label>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fg-subtle">
            {icon}
          </span>
        )}
        <input id={id} className={`${inputBase} ${icon ? 'pl-12 pr-4' : 'px-4'}`} {...props} />
      </div>
    </div>
  );
}

const PAYMENTS = [
  { id: 'upi', title: 'UPI', sub: 'Instant payment via Google Pay, PhonePe, Paytm, BHIM' },
  { id: 'card', title: 'Card', sub: 'Securely supports Visa, Mastercard, RuPay, AMEX' },
  { id: 'netbanking', title: 'Net Banking', sub: 'All major Indian banks supported' },
  { id: 'wallet', title: 'Wallet', sub: 'Paytm, PhonePe & electronic mobile wallets' },
  { id: 'cod', title: 'Cash on Delivery', sub: 'Pay cash on delivery at your doorstep' },
] as const;

const BANKS = ['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra Bank'];

type Form = {
  name: string;
  phone: string;
  email: string;
  house: string;
  floor: string;
  street: string;
  landmark: string;
  city: string;
  pincode: string;
};

const EMPTY: Form = {
  name: '', phone: '', email: '',
  house: '', floor: '', street: '', landmark: '', city: '', pincode: '',
};

type GeoState = 'idle' | 'locating' | 'done' | 'error';

export default function CheckoutModal() {
  const { selection, close } = useCheckout();

  const [step, setStep] = useState(0); // 0..3 = steps, 4 = confirmation
  const [form, setForm] = useState<Form>(EMPTY);
  const [qty, setQty] = useState(1);
  const [payment, setPayment] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [bank, setBank] = useState(BANKS[0]);
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [arrival, setArrival] = useState('');
  const [copied, setCopied] = useState(false);
  const [geo, setGeo] = useState<GeoState>('idle');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset everything whenever a new selection opens the sheet.
  useEffect(() => {
    if (selection) {
      setStep(0);
      setForm(EMPTY);
      setError('');
      setPlacing(false);
      setOrderId('');
      setQty(1);
      setPayment('upi');
      setUpiId('');
      setBank(BANKS[0]);
      setGeo('idle');
      setCopied(false);
    }
  }, [selection]);

  // Lock body scroll + escape to close while open.
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

  // Scroll to top on every step change.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [step]);

  if (!selection) return null;

  const isSubscription = selection.isSubscription;
  const lineQty = isSubscription ? 1 : qty;
  const total = selection.price * lineQty;

  function set<K extends keyof Form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  // ── Auto-detect location via the browser + free reverse geocode ──────
  function detectLocation() {
    setError('');
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setGeo('error');
      return;
    }
    setGeo('locating');
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=en`,
          );
          const d = await res.json();
          setForm((f) => ({
            ...f,
            street: f.street || [d.locality, d.city].filter(Boolean).join(', '),
            city: f.city || d.city || d.locality || '',
            pincode: f.pincode || (d.postcode ? String(d.postcode).replace(/\D/g, '').slice(0, 6) : ''),
            landmark: f.landmark || d.principalSubdivision || '',
          }));
          setGeo('done');
        } catch {
          // Coordinates resolved but reverse lookup failed — let the user fill in.
          setGeo('done');
        }
      },
      () => setGeo('error'),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  function next() {
    setError('');
    if (step === 0) {
      if (!form.name.trim()) return setError('Please enter your full name.');
      if (!/^[+\d][\d\s-]{7,}$/.test(form.phone.trim()))
        return setError('Enter a valid mobile number.');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
        return setError('Enter a valid email address.');
    }
    if (step === 1) {
      if (!form.house.trim()) return setError('Please enter your house / flat number.');
      if (!form.street.trim()) return setError('Please enter your street / area.');
      if (!form.city.trim()) return setError('Please enter your city.');
      if (!/^\d{6}$/.test(form.pincode.trim()))
        return setError('Enter a valid 6-digit pin code.');
    }
    setStep((s) => s + 1);
  }

  function back() {
    setError('');
    setStep((s) => Math.max(0, s - 1));
  }

  function placeOrder() {
    if (payment === 'upi' && upiId.trim() && !/^[\w.\-]+@[a-zA-Z]{2,}$/.test(upiId.trim())) {
      return setError('Enter a valid UPI ID (e.g. name@okaxis).');
    }
    setError('');
    setPlacing(true);
    const rand = Math.floor(1000 + Math.random() * 9000);
    const id = `10X-${Math.floor(100 + Math.random() * 900)}-${rand}`;
    const eta = new Date();
    eta.setDate(eta.getDate() + 3);
    const etaLabel = eta.toLocaleDateString('en-IN', {
      weekday: 'long', day: 'numeric', month: 'short', year: 'numeric',
    });

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
        house: form.house, floor: form.floor, street: form.street,
        landmark: form.landmark, city: form.city, pincode: form.pincode,
      },
    };
    try {
      window.localStorage.setItem(`10x:order:${id}`, JSON.stringify(order));
      window.localStorage.setItem('10x:order:last', id);
    } catch {
      // ignore storage failures
    }
    window.setTimeout(() => {
      setOrderId(id);
      setArrival(etaLabel);
      setPlacing(false);
      setStep(4);
    }, 900);
  }

  function copyId() {
    navigator.clipboard?.writeText(orderId).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      },
      () => {},
    );
  }

  const success = step === 4;
  const ctaLabel = ['Continue to Delivery', 'Confirm & Review', 'Continue to Payment', 'Complete Order'][step];

  return (
    <div
      className="fixed inset-0 z-[10000] flex flex-col bg-white"
      role="dialog"
      aria-modal="true"
      aria-label="Checkout"
    >
      {/* ===== Header — single back control on the left ===== */}
      {!success && (
        <header className="shrink-0">
          <div className="mx-auto flex w-full max-w-xl items-center px-5 py-4 sm:px-8">
            <button
              type="button"
              onClick={step === 0 ? close : back}
              aria-label={step === 0 ? 'Close checkout' : 'Go back'}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-paper-200 text-fg transition-colors hover:border-fg"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          </div>
        </header>
      )}

      {/* ===== Body ===== */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-xl px-5 py-8 sm:px-8">
          {/* STEP 1 — Contact details */}
          {step === 0 && (
            <div>
              <h2 className="font-condensed text-[2rem] font-black uppercase italic leading-none tracking-tight text-ink sm:text-4xl">
                Contact Details
              </h2>
              <p className="mt-3 font-pt text-body text-fg-muted">
                Enter your details so we can confirm and dispatch your order.
              </p>
              <div className="mt-7 space-y-5">
                <Field id="co-name" label="Full Name" icon={IconUser} value={form.name} autoComplete="name" placeholder="e.g. Liam Sterling" onChange={(e) => set('name', e.target.value)} />
                <Field id="co-phone" label="Mobile Number" icon={IconPhone} type="tel" value={form.phone} autoComplete="tel" placeholder="e.g. +91 98765 43210" onChange={(e) => set('phone', e.target.value)} />
                <Field id="co-email" label="Email Address" icon={IconMail} type="email" value={form.email} autoComplete="email" placeholder="e.g. you@email.com" onChange={(e) => set('email', e.target.value)} />
              </div>
            </div>
          )}

          {/* STEP 2 — Delivery address */}
          {step === 1 && (
            <div>
              <h2 className="font-condensed text-[2rem] font-black uppercase italic leading-none tracking-tight text-ink sm:text-4xl">
                Delivery Address
              </h2>
              <p className="mt-3 font-pt text-body text-fg-muted">
                Tell us where to ship your 10X. Auto-detect or enter it manually.
              </p>

              {/* Auto-detect card */}
              <div className="mt-6 rounded-2xl bg-paper-100 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent-pressed">
                      {IconPin}
                    </span>
                    <div>
                      <p className="font-quantico text-body-sm font-bold uppercase tracking-wide text-fg">
                        Auto-Detect Location
                      </p>
                      <p className="mt-0.5 font-pt text-caption text-fg-muted">
                        Use secure browser GPS
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={detectLocation}
                    disabled={geo === 'locating'}
                    className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-accent px-4 py-2.5 font-quantico text-[11px] font-bold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-accent-hover disabled:opacity-70"
                  >
                    {geo === 'locating' ? (
                      <>
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-ink/30 border-t-ink" />
                        Locating
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                        GPS Locate
                      </>
                    )}
                  </button>
                </div>
                {geo === 'done' && (
                  <p className="mt-3 rounded-xl bg-accent/15 px-3 py-2 font-pt text-caption font-bold text-accent-pressed">
                    Location resolved — review the fields below.
                  </p>
                )}
                {geo === 'error' && (
                  <p className="mt-3 rounded-xl bg-danger/10 px-3 py-2 font-pt text-caption font-bold text-danger">
                    Couldn&rsquo;t access location. Please enter your address manually.
                  </p>
                )}
              </div>

              {/* Divider */}
              <div className="my-6 flex items-center gap-4">
                <span className="h-px flex-1 bg-paper-200" />
                <span className="font-quantico text-[10px] font-bold uppercase tracking-[0.16em] text-fg-subtle">
                  Or enter manually
                </span>
                <span className="h-px flex-1 bg-paper-200" />
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-3 gap-4">
                  <Field id="co-house" label="House / Flat No." className="col-span-2" value={form.house} autoComplete="address-line1" placeholder="e.g. Flat 902, Tower B" onChange={(e) => set('house', e.target.value)} />
                  <Field id="co-floor" label="Floor" value={form.floor} placeholder="e.g. 9" onChange={(e) => set('floor', e.target.value)} />
                </div>
                <Field id="co-street" label="Street / Area" icon={IconPencil} value={form.street} autoComplete="address-line2" placeholder="e.g. Senapati Bapat Road" onChange={(e) => set('street', e.target.value)} />
                <Field id="co-landmark" label="Landmark (optional)" value={form.landmark} placeholder="e.g. Near Kamala Mills" onChange={(e) => set('landmark', e.target.value)} />
                <div className="grid grid-cols-2 gap-4">
                  <Field id="co-city" label="City" value={form.city} autoComplete="address-level2" placeholder="e.g. Mumbai" onChange={(e) => set('city', e.target.value)} />
                  <Field id="co-pincode" label="Pin Code" inputMode="numeric" maxLength={6} value={form.pincode} autoComplete="postal-code" placeholder="e.g. 400013" onChange={(e) => set('pincode', e.target.value.replace(/\D/g, ''))} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 — Review */}
          {step === 2 && (
            <div>
              <h2 className="font-condensed text-[2rem] font-black uppercase italic leading-none tracking-tight text-ink sm:text-4xl">
                Order Summary
              </h2>
              <p className="mt-3 font-pt text-body text-fg-muted">
                Review your pack and adjust the quantity before payment.
              </p>

              {/* Product card */}
              <div className="mt-6 flex items-center gap-4 rounded-2xl border border-paper-200 p-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-paper-100">
                  <Image src={PRODUCT_IMAGES.front} alt="" fill sizes="64px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-quantico text-body-sm font-bold uppercase tracking-wide text-fg">
                    {selection.tierName}
                  </p>
                  <p className="mt-0.5 font-pt text-caption text-fg-muted">{selection.packets}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-quantico text-body font-bold text-ink">{fmt(selection.price)}</p>
                  <p className="font-pt text-[11px] uppercase tracking-wide text-fg-subtle">
                    {isSubscription ? '/ cycle' : 'each'}
                  </p>
                </div>
              </div>

              {/* Quantity */}
              <div className="mt-4 flex items-center justify-between rounded-2xl bg-paper-100 p-4">
                <div>
                  <p className="font-quantico text-body-sm font-bold uppercase tracking-wide text-fg">
                    {isSubscription ? 'Subscription' : 'Adjust Quantity'}
                  </p>
                  <p className="mt-0.5 font-pt text-caption text-fg-muted">
                    {isSubscription ? 'Auto-renews · cancel anytime' : 'How many packs?'}
                  </p>
                </div>
                {isSubscription ? (
                  <span className="rounded-full bg-accent px-3 py-1.5 font-quantico text-[10px] font-bold uppercase tracking-wide text-ink">
                    Recurring
                  </span>
                ) : (
                  <div className="flex items-center rounded-full bg-white p-1 shadow-card">
                    <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-fg transition-colors hover:bg-paper-100">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    </button>
                    <span className="w-9 text-center font-quantico text-body font-bold text-ink">{qty}</span>
                    <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(9, q + 1))} className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-fg transition-colors hover:bg-paper-100">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Breakdown */}
              <dl className="mt-6 space-y-3 font-pt text-body-sm">
                <div className="flex justify-between">
                  <dt className="text-fg-muted">Base price</dt>
                  <dd className="font-quantico font-bold text-fg">{fmt(selection.price)}</dd>
                </div>
                {!isSubscription && (
                  <div className="flex justify-between">
                    <dt className="text-fg-muted">Quantity</dt>
                    <dd className="font-quantico font-bold text-fg">× {qty}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-fg-muted">Delivery</dt>
                  <dd className="font-quantico font-bold uppercase tracking-wide text-success">Free Express</dd>
                </div>
              </dl>

              <div className="mt-5 flex items-baseline justify-between border-t border-paper-200 pt-5">
                <span className="font-quantico text-caption font-bold uppercase tracking-[0.12em] text-fg-muted">
                  {isSubscription ? 'Recurring Total' : 'Total Amount'}
                </span>
                <span className="font-condensed text-3xl font-black tracking-tight text-ink">{fmt(total)}</span>
              </div>
              <p className="mt-3 flex items-center gap-1.5 font-pt text-caption text-fg-subtle">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Secured shipment · inclusive of all taxes
              </p>
            </div>
          )}

          {/* STEP 4 — Payment */}
          {step === 3 && (
            <div>
              <h2 className="font-condensed text-[2rem] font-black uppercase italic leading-none tracking-tight text-ink sm:text-4xl">
                Payment Method
              </h2>
              <p className="mt-3 font-pt text-body text-fg-muted">
                Choose a secure checkout route to finalize your order.
              </p>

              <div className="mt-6 space-y-3">
                {PAYMENTS.map((p) => {
                  const selected = payment === p.id;
                  return (
                    <div
                      key={p.id}
                      className={`overflow-hidden rounded-2xl border-2 transition-colors ${
                        selected ? 'border-accent bg-accent/[0.06]' : 'border-paper-200 bg-white'
                      }`}
                    >
                      <label className="flex cursor-pointer items-center gap-3 px-4 py-4">
                        <input type="radio" name="co-payment" value={p.id} checked={selected} onChange={() => setPayment(p.id)} className="sr-only" />
                        <span className="min-w-0 flex-1">
                          <span className="block font-quantico text-body-sm font-bold uppercase tracking-wide text-fg">{p.title}</span>
                          <span className="mt-0.5 block font-pt text-caption text-fg-muted">{p.sub}</span>
                        </span>
                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${selected ? 'border-accent' : 'border-paper-300'}`}>
                          {selected && <span className="h-2.5 w-2.5 rounded-full bg-accent" />}
                        </span>
                      </label>

                      {/* Inline UPI input */}
                      {selected && p.id === 'upi' && (
                        <div className="border-t border-accent/30 px-4 pb-4 pt-3">
                          <label htmlFor="co-upi" className={labelCls}>Enter UPI ID</label>
                          <input id="co-upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="e.g. username@okaxis" className={`${inputBase} bg-white px-4 ring-paper-200`} />
                        </div>
                      )}

                      {/* Inline bank picker */}
                      {selected && p.id === 'netbanking' && (
                        <div className="border-t border-accent/30 px-4 pb-4 pt-3">
                          <label htmlFor="co-bank" className={labelCls}>Select Bank</label>
                          <select id="co-bank" value={bank} onChange={(e) => setBank(e.target.value)} className={`${inputBase} appearance-none bg-white px-4 ring-paper-200`}>
                            {BANKS.map((b) => <option key={b} value={b}>{b}</option>)}
                          </select>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-between rounded-2xl bg-paper-100 px-4 py-4">
                <div>
                  <p className="font-quantico text-[10px] font-bold uppercase tracking-[0.14em] text-fg-muted">
                    Payable Total
                  </p>
                  <p className="mt-1 font-condensed text-2xl font-black tracking-tight text-ink">{fmt(total)}</p>
                </div>
                <p className="flex items-center gap-1.5 font-pt text-caption font-bold text-fg-muted">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <rect x="4" y="11" width="16" height="9" rx="1.5" /><path d="M8 11V8a4 4 0 0 1 8 0v3" />
                  </svg>
                  256-bit SSL
                </p>
              </div>
            </div>
          )}

          {/* STEP 5 — Confirmation */}
          {success && (
            <div className="py-6 text-center">
              <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent text-ink shadow-glow">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12.5 10 17.5 19 7" />
                </svg>
              </span>
              <h2 className="mt-6 font-condensed text-4xl font-black uppercase italic leading-[0.9] tracking-tight text-ink sm:text-5xl">
                Order<br />Confirmed
              </h2>
              <p className="mx-auto mt-4 max-w-sm font-pt text-body text-fg-muted">
                Thank you, <span className="font-bold text-fg">{form.name || 'friend'}</span>. Your{' '}
                {selection.tierName.toLowerCase()} is registered for express shipment.
              </p>

              {/* Tracking ID */}
              <div className="mx-auto mt-7 max-w-sm rounded-2xl bg-paper-100 p-5">
                <p className="font-quantico text-[10px] font-bold uppercase tracking-[0.16em] text-fg-subtle">
                  Order Tracking ID
                </p>
                <div className="mt-2 flex items-center justify-center gap-2">
                  <span className="font-quantico text-lg font-bold tracking-[0.08em] text-ink">{orderId}</span>
                  <button type="button" onClick={copyId} aria-label="Copy tracking ID" className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-white text-fg-muted transition-colors hover:text-ink">
                    {copied ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12.5 10 17.5 19 7" /></svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Summary rows */}
              <dl className="mx-auto mt-4 max-w-sm space-y-3 rounded-2xl border border-paper-200 p-5 text-left font-pt text-body-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-fg-muted">Delivery status</dt>
                  <dd className="rounded-full bg-accent/20 px-3 py-1 font-quantico text-[10px] font-bold uppercase tracking-wide text-accent-pressed">
                    Preparing for dispatch
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-paper-200 pt-3">
                  <dt className="text-fg-muted">Estimated arrival</dt>
                  <dd className="font-quantico font-bold text-fg">{arrival}</dd>
                </div>
                <div className="flex items-center justify-between border-t border-paper-200 pt-3">
                  <dt className="text-fg-muted">Total paid</dt>
                  <dd className="font-quantico font-bold text-ink">{fmt(total)}</dd>
                </div>
              </dl>
            </div>
          )}

          {error && !success && (
            <p role="alert" className="mt-5 rounded-xl bg-danger/10 px-4 py-3 font-pt text-body-sm font-bold text-danger">
              {error}
            </p>
          )}
        </div>
      </div>

      {/* ===== Footer / CTA ===== */}
      <footer className="shrink-0 border-t border-paper-200 bg-white pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto w-full max-w-xl px-5 py-4 sm:px-8">
          {success ? (
            <button
              type="button"
              onClick={close}
              className="flex w-full cursor-pointer items-center justify-center rounded-full bg-ink px-6 py-4 font-quantico text-body-sm font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-ink-900"
            >
              Done
            </button>
          ) : step < 3 ? (
            <button
              type="button"
              onClick={next}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 font-quantico text-body-sm font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-accent-hover"
            >
              {ctaLabel}
              {IconArrow}
            </button>
          ) : (
            <button
              type="button"
              onClick={placeOrder}
              disabled={placing}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 font-quantico text-body-sm font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:bg-accent-hover disabled:opacity-70"
            >
              {placing ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/30 border-t-ink" />
                  Processing…
                </>
              ) : (
                <>Complete Order · {fmt(total)}</>
              )}
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
