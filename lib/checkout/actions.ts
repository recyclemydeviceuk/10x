'use server';

import { CUSTOMERS } from '@/lib/admin/data';

import { issueCode, verifyCode } from './otp';

/**
 * Returning-customer sign-in.
 *
 * Deliberately never reveals whether an email is on file: an unknown address
 * gets the same "code sent" response as a known one, and only a correct code
 * returns a profile. Otherwise this endpoint becomes a way to enumerate the
 * customer list.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Only outside production is the code handed back to the browser. */
const isDev = process.env.NODE_ENV !== 'production';

export type SavedProfile = {
  name: string;
  phone: string;
  email: string;
  house: string;
  street: string;
  city: string;
  pincode: string;
};

export type SendCodeResult = {
  ok: boolean;
  message?: string;
  /** Development only — stands in for the email nobody is sending yet. */
  devCode?: string;
  retryInSeconds?: number;
};

export async function sendLoginCode(email: string): Promise<SendCodeResult> {
  const address = email.trim();
  if (!EMAIL.test(address)) {
    return { ok: false, message: 'That doesn’t look like an email address.' };
  }

  const result = issueCode(address);
  if (!result.ok) {
    return {
      ok: false,
      message: `Hang on — you can ask for another code in ${result.retryInSeconds}s.`,
      retryInSeconds: result.retryInSeconds,
    };
  }

  // TODO: send `result.code` to `address` through the mail provider. Until
  // that exists the code only reaches the browser, and only in development.
  if (isDev) {
    console.info(`[checkout] sign-in code for ${address}: ${result.code}`);
  }

  return { ok: true, devCode: isDev ? result.code : undefined };
}

export type VerifyResult =
  | { ok: true; profile: SavedProfile | null }
  | { ok: false; message: string };

export async function verifyLoginCode(email: string, code: string): Promise<VerifyResult> {
  const address = email.trim();
  const result = verifyCode(address, code);

  if (!result.ok) {
    const message =
      result.reason === 'expired'
        ? 'That code has expired — send a fresh one.'
        : result.reason === 'locked'
          ? 'Too many tries. Send a new code and start again.'
          : 'That code doesn’t match. Check and try again.';
    return { ok: false, message };
  }

  // Verified. Pull whatever we already hold for this address.
  const customer = CUSTOMERS.find(
    (c) => c.email.toLowerCase() === address.toLowerCase(),
  );

  if (!customer) {
    // Verified, but new to us — send them through the normal flow with the
    // email already filled rather than treating it as a failure.
    return { ok: true, profile: null };
  }

  return {
    ok: true,
    profile: {
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      house: customer.address.line1,
      street: customer.address.line2 ?? '',
      city: customer.address.city,
      pincode: customer.address.pincode,
    },
  };
}
