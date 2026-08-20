/**
 * Cashfree Checkout, loaded on demand.
 *
 * The script is fetched the first time someone actually reaches the payment
 * step rather than on every page load — a visitor reading the science page has
 * no use for it.
 *
 * Loading is idempotent: a second call while the first is in flight waits on
 * the same promise instead of injecting a second `<script>`.
 */

const SRC = 'https://sdk.cashfree.com/js/v3/cashfree.js';

export type CashfreeMode = 'sandbox' | 'production';

export type CashfreeResult = {
  /** Set when the customer's payment failed or was declined. */
  error?: { message?: string };
  /** Set when the modal was dismissed and the flow moved to a redirect. */
  redirect?: boolean;
  paymentDetails?: { paymentMessage?: string };
};

type CashfreeInstance = {
  checkout: (options: {
    paymentSessionId: string;
    redirectTarget?: '_self' | '_blank' | '_modal';
  }) => Promise<CashfreeResult>;
  subscriptionsCheckout: (options: {
    subsSessionId: string;
    redirectTarget?: '_self' | '_blank' | '_modal';
  }) => Promise<CashfreeResult>;
};

declare global {
  interface Window {
    Cashfree?: (config: { mode: CashfreeMode }) => CashfreeInstance;
  }
}

let loading: Promise<boolean> | null = null;

export function loadCashfree(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (window.Cashfree) return Promise.resolve(true);
  if (loading) return loading;

  loading = new Promise<boolean>((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.src = SRC;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      // Let a later attempt retry rather than caching the failure forever.
      loading = null;
      resolve(false);
    };
    document.body.appendChild(script);
  });

  return loading;
}

/**
 * Open the hosted payment window for a checkout session.
 *
 * Whatever this returns is a hint, not a verdict: the order is only paid once
 * the API says so, either from Cashfree's webhook or from the confirmation
 * call the success page makes.
 */
export async function payWithCashfree(
  paymentSessionId: string,
  mode: CashfreeMode,
): Promise<{ ok: boolean; message?: string; setupIssue?: string }> {
  const ready = await loadCashfree();
  if (!ready || !window.Cashfree) {
    return { ok: false, message: 'We couldn’t open the payment window. Check your connection and try again.' };
  }

  const result = await window.Cashfree({ mode }).checkout({
    paymentSessionId,
    redirectTarget: '_modal',
  });

  if (result?.error) {
    const raw = result.error.message ?? '';
    // Cashfree refuses to open on an origin that isn't approved in the
    // merchant dashboard. On a live account that is a setup problem, not
    // something the customer did — and the raw "Broken Link!" text tells
    // them nothing.
    if (/not enabled or approved|whitelist/i.test(raw)) {
      return {
        ok: false,
        message:
          'Online payment isn’t available from this address yet. Nothing has been charged — use cash on delivery, or try again shortly.',
        setupIssue: raw,
      };
    }
    return { ok: false, message: raw || 'That payment didn’t go through.' };
  }
  return { ok: true };
}

/**
 * Open the mandate window for auto-pay (UPI Autopay / eNACH / card standing
 * instruction). Same rule as payments: the return value is a hint — the
 * mandate is only live once the API confirms it, via webhook or the refresh
 * call the subscriptions page makes on return.
 */
export async function subscribeWithCashfree(
  subscriptionSessionId: string,
  mode: CashfreeMode,
): Promise<{ ok: boolean; message?: string }> {
  const ready = await loadCashfree();
  if (!ready || !window.Cashfree) {
    return { ok: false, message: 'We couldn’t open the authorisation window. Check your connection and try again.' };
  }

  const result = await window.Cashfree({ mode }).subscriptionsCheckout({
    subsSessionId: subscriptionSessionId,
    redirectTarget: '_modal',
  });

  if (result?.error) {
    const raw = result.error.message ?? '';
    return { ok: false, message: raw || 'Auto-pay wasn’t set up. You can try again anytime.' };
  }
  return { ok: true };
}
