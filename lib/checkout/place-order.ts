'use client';

import { api, firstMessage } from '@/lib/api/storefront';
import type { Address, CartLine, PaymentMethod } from '@/lib/store/types';

import { payWithCashfree, subscribeWithCashfree, type CashfreeMode } from './cashfree';

/**
 * Placing an order.
 *
 * NOTHING here decides what an order costs. The browser sends the catalogue
 * ids, a quantity, an address and a payment method; the API prices the line,
 * applies the coupon, works out shipping and creates the order. A total
 * computed in a browser is a total the customer can edit.
 *
 * Online payments come back with a Cashfree session, which opens the hosted
 * payment window. The result of that window is only a hint — the order becomes
 * paid when the API says so, from the gateway's webhook or from the
 * confirmation call the success page makes.
 */

export type PlacedOrder = {
  /** Null until the payment clears — an online order has no id before that. */
  id: string | null;
  reference: string;
  total: number;
  paymentMethod: PaymentMethod;
  status: string;
};

export type PlaceOrderResult =
  | { ok: true; order: PlacedOrder; paid: boolean }
  | { ok: false; message: string; reference?: string };

/** Ten digits, however the customer typed it. */
export function normalisePhone(raw: string): string {
  return raw.replace(/\D/g, '').slice(-10);
}

export function toApiAddress(address: Address) {
  return {
    fullName: address.fullName,
    line1: address.house,
    line2: address.street,
    landmark: address.landmark ?? '',
    city: address.city,
    state: address.state,
    pincode: address.pincode,
    phone: normalisePhone(address.phone),
  };
}

export async function placeOrder(input: {
  line: CartLine;
  address: Address;
  paymentMethod: PaymentMethod;
  couponCode?: string;
}): Promise<PlaceOrderResult> {
  const { line, address, paymentMethod, couponCode } = input;

  if (normalisePhone(address.phone).length !== 10) {
    return { ok: false, message: 'That delivery address needs a valid 10-digit mobile number.' };
  }

  const created = await api<{
    order: PlacedOrder;
    payment?: { gateway: string; environment: CashfreeMode; paymentSessionId?: string; subscriptionSessionId?: string };
  }>('/api/v1/checkout', {
    method: 'POST',
    body: {
      items: [
        {
          productId: line.productId,
          tierId: line.tierId,
          quantity: line.quantity,
          subscribe: line.isSubscription,
        },
      ],
      address: toApiAddress(address),
      paymentMethod,
      couponCode: couponCode ?? '',
    },
  });

  if (!created.ok) return { ok: false, message: firstMessage(created) };

  const { order, payment } = created.data;

  // Cash on delivery is confirmed the moment it's placed.
  if (paymentMethod === 'cod' || !(payment?.paymentSessionId || payment?.subscriptionSessionId)) {
    return { ok: true, order, paid: false };
  }

  // A subscribe pack opens the auto-pay approval instead of a plain payment:
  // one approval charges this box AND sets up every box after it.
  const paid = payment.subscriptionSessionId
    ? await subscribeWithCashfree(payment.subscriptionSessionId, payment.environment)
    : await payWithCashfree(payment.paymentSessionId!, payment.environment);
  if (!paid.ok) {
    // Surface gateway setup problems in the console for whoever is running
    // the store — the customer only sees the plain message.
    if (paid.setupIssue) console.error('[checkout] payment gateway refused:', paid.setupIssue);
    // Nothing was charged and NO ORDER EXISTS — the checkout is simply closed.
    // Say that plainly instead of handing over a reference that would look
    // like an order the customer has to chase.
    return { ok: false, message: paid.message ?? 'That payment didn’t go through. Nothing has been charged.' };
  }

  // The order is created the moment the gateway confirms the money. The
  // webhook usually gets there first; this covers the customer landing back
  // before Cashfree has called us.
  const confirmed = await api<{ order?: { paymentStatus: string } }>(
    `/api/v1/me/orders/${encodeURIComponent(order.reference)}/confirm-payment`,
    { method: 'POST' },
  );

  return {
    ok: true,
    order,
    // 202 means the bank hasn't settled yet — the confirmation page keeps
    // asking rather than claiming an order that doesn't exist.
    paid: confirmed.ok && confirmed.data.order?.paymentStatus === 'paid',
  };
}
