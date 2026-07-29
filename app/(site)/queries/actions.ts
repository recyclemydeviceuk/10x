'use server';

import { createQuery } from '@/lib/queries/store';
import { QUERY_TOPICS, type QueryTopic } from '@/lib/queries/types';

export type QueryFormState = {
  status: 'idle' | 'error' | 'sent';
  /** Field name → message. */
  errors?: Record<string, string>;
  /** Shown on the confirmation so the customer can quote it back to us. */
  reference?: string;
  firstName?: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function submitQuery(
  _state: QueryFormState,
  formData: FormData,
): Promise<QueryFormState> {
  const get = (key: string) => String(formData.get(key) ?? '').trim();

  // Honeypot — a real person never fills a field they can't see.
  if (get('company')) {
    // Look successful rather than telling a bot what gave it away.
    return { status: 'sent', reference: 'Q-0000', firstName: '' };
  }

  const topic = get('topic');
  const name = get('name');
  const email = get('email');
  const phone = get('phone');
  const orderReference = get('orderReference');
  const message = get('message');

  const errors: Record<string, string> = {};

  if (!QUERY_TOPICS.some((t) => t.value === topic)) {
    errors.topic = 'Pick the closest topic.';
  }
  if (name.length < 2) {
    errors.name = 'Tell us what to call you.';
  }
  if (!EMAIL.test(email)) {
    errors.email = 'We need a working email to reply to.';
  }
  if (phone && phone.replace(/\D/g, '').length < 8) {
    errors.phone = 'That doesn’t look like a phone number.';
  }
  if (message.length < 15) {
    errors.message = 'A little more detail helps us answer properly.';
  }
  if (message.length > 4000) {
    errors.message = 'That’s longer than we can take — trim it a little.';
  }

  if (Object.keys(errors).length > 0) {
    return { status: 'error', errors };
  }

  const query = createQuery({
    topic: topic as QueryTopic,
    name,
    email,
    phone: phone || undefined,
    orderReference: orderReference || undefined,
    message,
    submittedAt: new Date().toISOString(),
  });

  // TODO: when the store is on a real database, also notify the team here —
  // right now a query is only seen if someone opens the admin panel.
  return {
    status: 'sent',
    reference: query.reference,
    firstName: name.split(' ')[0] ?? '',
  };
}
