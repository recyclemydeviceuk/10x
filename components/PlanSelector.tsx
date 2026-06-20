'use client';

import Image from 'next/image';
import { useState } from 'react';

import { PLAN_LIST, PLANS, type PlanId } from './plans';
import { useCheckout } from './CheckoutContext';

import blinkit from '../10x-Assets/Blinkit.png';
import zepto from '../10x-Assets/Zepto.png';

function Check() {
  return (
    <span className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center bg-accent text-ink">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M5 12.5 10 17.5 19 7" />
      </svg>
    </span>
  );
}

export default function PlanSelector() {
  const { open } = useCheckout();
  const [selected, setSelected] = useState<PlanId>('subscription');

  return (
    <div>
      {/* Plan options */}
      <div className="grid grid-cols-1 border border-paper-200 sm:grid-cols-2">
        {PLAN_LIST.map((plan, i) => {
          const active = selected === plan.id;
          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => setSelected(plan.id)}
              aria-pressed={active}
              className={`relative flex flex-col p-5 text-left transition-shadow ${
                i === 0 ? 'border-b border-paper-200 sm:border-b-0 sm:border-r' : ''
              } ${active ? 'z-10 ring-2 ring-brand-blue' : 'hover:bg-paper-50'}`}
            >
              {plan.badge && (
                <span className="absolute right-3 top-3 bg-accent px-2 py-0.5 font-quantico text-[9px] font-bold uppercase tracking-wide text-ink">
                  {plan.badge}
                </span>
              )}

              <div className="flex items-center gap-2.5">
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    active ? 'border-brand-blue' : 'border-paper-300'
                  }`}
                >
                  {active && <span className="h-2.5 w-2.5 rounded-full bg-brand-blue" />}
                </span>
                <span className="font-quantico text-caption font-bold uppercase tracking-wide text-fg-muted">
                  {plan.name}
                </span>
              </div>

              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-condensed text-3xl font-black italic leading-none tracking-tight text-ink">
                  {plan.priceLabel}
                </span>
                {plan.cadence && (
                  <span className="font-quantico text-caption font-bold uppercase tracking-wide text-fg-muted">
                    {plan.cadence}
                  </span>
                )}
              </div>
              <p className="mt-1.5 font-pt text-caption text-fg-muted">{plan.servings}</p>

              <ul className="mt-4 space-y-2">
                {plan.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2 font-pt text-caption text-fg">
                    <Check />
                    {item}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      {/* Marketplace availability */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <span className="font-quantico text-[10px] font-bold uppercase tracking-[0.18em] text-fg-muted">
          Also available on
        </span>
        <a href="https://blinkit.com/" target="_blank" rel="noopener noreferrer" aria-label="Order on Blinkit" className="relative h-5 w-16 transition-opacity hover:opacity-70">
          <Image src={blinkit} alt="Blinkit" fill sizes="64px" className="object-contain" />
        </a>
        <a href="https://www.zepto.in/" target="_blank" rel="noopener noreferrer" aria-label="Order on Zepto" className="relative h-5 w-16 transition-opacity hover:opacity-70">
          <Image src={zepto} alt="Zepto" fill sizes="64px" className="object-contain" />
        </a>
      </div>

      {/* Proceed */}
      <button
        type="button"
        onClick={() => open(PLANS[selected])}
        className="mt-5 inline-flex w-full cursor-pointer items-center justify-center gap-2 bg-accent px-6 py-4 font-quantico text-body-sm font-bold uppercase tracking-[0.18em] text-ink shadow-glow-soft transition-colors hover:bg-accent-hover"
      >
        Proceed To Check Out
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
    </div>
  );
}
