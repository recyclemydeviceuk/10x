'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { api } from '@/lib/api/storefront';
import type { Order } from '@/lib/store/types';

/**
 * Order help — a small chat that answers from the order itself.
 *
 * Every answer is computed from live order data (status, courier words, AWB,
 * estimated delivery — all synced from Shiprocket), so "Where is my order?"
 * says what the courier last said, not a canned line. "Request a call back"
 * files a tagged query the support team sees in the panel inbox.
 */

type Bubble = { from: 'bot' | 'me'; text: string };

function longDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

function whereAnswer(order: Order): string {
  if (order.status === 'cancelled') return 'This order was cancelled, so nothing is on the way. If a payment was made, the refund follows automatically.';
  if (order.status === 'returned') return 'This order came back to us as a return — nothing further is in transit.';
  if (order.status === 'delivered') {
    const at = order.timeline.find((t) => t.stage === 'delivered')?.at;
    return `It was delivered${at ? ` on ${longDate(at)}` : ''}. If it never reached you, request a call back below and we'll chase it.`;
  }
  if (order.status === 'shipped' || order.status === 'out_for_delivery') {
    const courier = order.courier || 'our courier';
    const awb = order.trackingNumber ? ` (tracking ${order.trackingNumber})` : '';
    const latest = order.courierStatus ? ` The courier's latest word: ${order.courierStatus}.` : '';
    return `It's on the road with ${courier}${awb}.${latest}`;
  }
  return "It's still with our warehouse — packed and waiting for the courier pickup. You'll get the tracking number the moment it ships.";
}

function whenAnswer(order: Order): string {
  if (order.status === 'cancelled' || order.status === 'returned') return 'This order is closed, so there is no delivery on the way.';
  if (order.status === 'delivered') return 'It has already been delivered.';
  if (order.estimatedDelivery) return `The courier expects it by ${longDate(order.estimatedDelivery)}.`;
  if (order.status === 'shipped' || order.status === 'out_for_delivery') {
    return "The courier hasn't shared an exact date yet — most parcels land 2–4 days after dispatch. Check back here; the estimate appears as soon as they publish it.";
  }
  return 'It usually ships within 1–2 days of the order, then 2–4 days in transit depending on your pincode.';
}

export default function OrderHelpChat({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && bubbles.length === 0) {
      setBubbles([{ from: 'bot', text: `Hi! Ask me anything about order ${order.reference}.` }]);
    }
  }, [open, bubbles.length, order.reference]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [bubbles]);

  function ask(question: string, answer: string) {
    setBubbles((b) => [...b, { from: 'me', text: question }, { from: 'bot', text: answer }]);
  }

  async function requestCallback() {
    if (busy) return;
    setBusy(true);
    setBubbles((b) => [...b, { from: 'me', text: 'Request a call back' }]);
    const result = await api<{ reference: string; already: boolean }>(
      `/api/v1/me/orders/${encodeURIComponent(order.reference)}/callback`,
      { method: 'POST' },
    );
    setBusy(false);
    setBubbles((b) => [
      ...b,
      {
        from: 'bot',
        text: !result.ok
          ? "That didn't go through — try again in a moment."
          : result.data.already
            ? `You already have a call back on the way for this order (ticket ${result.data.reference}). The team calls on ${order.address.phone}.`
            : `Done — the support team will call you on ${order.address.phone}. Your ticket is ${result.data.reference}.`,
      },
    ]);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cursor-pointer border-2 border-paper-200 px-6 py-3.5 font-quantico text-caption font-bold uppercase tracking-[0.14em] text-fg transition-colors hover:border-accent"
      >
        Need help with this order?
      </button>
    );
  }

  return (
    <div className="w-full border-2 border-paper-200">
      <div className="flex items-center justify-between border-b-2 border-paper-200 px-5 py-3.5">
        <p className="font-quantico text-caption font-bold uppercase tracking-[0.14em] text-fg">
          Order help · {order.reference}
        </p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close order help"
          className="cursor-pointer font-quantico text-caption font-bold uppercase tracking-[0.12em] text-fg-subtle transition-colors hover:text-fg"
        >
          Close
        </button>
      </div>

      <div className="max-h-80 space-y-3 overflow-y-auto px-5 py-5">
        {bubbles.map((b, i) => (
          <div key={i} className={`flex ${b.from === 'me' ? 'justify-end' : 'justify-start'}`}>
            <p
              className={`max-w-[85%] px-4 py-2.5 font-pt text-body-sm leading-relaxed ${
                b.from === 'me' ? 'bg-accent text-ink' : 'bg-paper-100 text-fg dark:bg-paper-200'
              }`}
            >
              {b.text}
            </p>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="flex flex-wrap gap-2 border-t-2 border-paper-200 px-5 py-4">
        <Chip onClick={() => ask('Where is my order?', whereAnswer(order))}>Where is my order?</Chip>
        <Chip onClick={() => ask('When will it arrive?', whenAnswer(order))}>When will it arrive?</Chip>
        <Chip onClick={requestCallback} disabled={busy}>
          {busy ? 'Sending…' : 'Request a call back'}
        </Chip>
        <Link
          href="/queries"
          className="cursor-pointer rounded-full border-2 border-paper-200 px-4 py-2 font-quantico text-[11px] font-bold uppercase tracking-[0.1em] text-fg-muted transition-colors hover:border-accent hover:text-fg"
        >
          Something else
        </Link>
      </div>
    </div>
  );
}

function Chip({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="cursor-pointer rounded-full border-2 border-paper-200 px-4 py-2 font-quantico text-[11px] font-bold uppercase tracking-[0.1em] text-fg transition-colors hover:border-accent disabled:opacity-50"
    >
      {children}
    </button>
  );
}
