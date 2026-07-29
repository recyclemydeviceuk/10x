'use server';

import { redirect } from 'next/navigation';

import { verifyCredentials } from '@/lib/admin/auth';
import { endSession, requireSession, startSession } from '@/lib/admin/session';

export type LoginState = { error?: string };

/**
 * Only redirect to same-origin paths — an open `?next=` is a phishing hop.
 */
function safeNext(value: FormDataEntryValue | null): string {
  const next = typeof value === 'string' ? value : '';
  if (!next.startsWith('/admin') || next.startsWith('//')) return '/admin';
  return next;
}

export async function login(_state: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    return { error: 'Enter your email and password.' };
  }

  const admin = await verifyCredentials(email, password);
  if (!admin) {
    // One message for both cases — never confirm that an email exists.
    return { error: 'Those details don’t match an admin account.' };
  }

  await startSession(admin);
  redirect(safeNext(formData.get('next')));
}

export async function logout(): Promise<void> {
  await endSession();
  redirect('/admin/login');
}

/**
 * Placeholder mutations. They verify the session and would call the store's API
 * — wiring them up is the next step after the UI is signed off.
 */
export async function updateOrderStatus(orderId: string, status: string): Promise<void> {
  await requireSession();
  console.info('[admin] update order status', { orderId, status });
}

export async function pushToShiprocket(orderId: string): Promise<void> {
  await requireSession();
  console.info('[admin] push to shiprocket', { orderId });
}

export async function updateSubscription(
  subscriptionId: string,
  action: 'skip' | 'pause' | 'resume' | 'cancel',
): Promise<void> {
  await requireSession();
  console.info('[admin] subscription action', { subscriptionId, action });
}
