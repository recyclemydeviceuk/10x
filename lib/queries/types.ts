/**
 * Customer queries — submitted on the storefront, answered in the admin panel.
 * One shape, shared by both, so the two can't drift apart.
 */

export const QUERY_TOPICS = [
  { value: 'product', label: 'Product & ingredients', hint: 'What’s in it, how it works, who it’s for' },
  { value: 'order', label: 'Order & delivery', hint: 'Where it is, when it lands, a wrong item' },
  { value: 'subscription', label: 'Subscription', hint: 'Skipping, pausing, cancelling, changing dates' },
  { value: 'refund', label: 'Returns & refunds', hint: 'Something arrived damaged, or you changed your mind' },
  { value: 'bulk', label: 'Bulk & corporate', hint: 'Offices, gyms, events, gifting' },
  { value: 'stockist', label: 'Stocking 10X', hint: 'Retail, distribution, partnerships' },
  { value: 'other', label: 'Something else', hint: 'Anything that doesn’t fit the boxes above' },
] as const;

export type QueryTopic = (typeof QUERY_TOPICS)[number]['value'];

export type QueryStatus = 'new' | 'open' | 'answered' | 'closed';

export type CustomerQuery = {
  id: string;
  /** Human-facing reference given to the customer on submit. */
  reference: string;
  topic: QueryTopic;
  name: string;
  email: string;
  phone?: string;
  /** Optional — only relevant for order and refund topics. */
  orderReference?: string;
  message: string;
  status: QueryStatus;
  submittedAt: string;
  /** Set once someone in the panel has replied. */
  answeredAt?: string;
  answeredBy?: string;
  reply?: string;
};

export function topicLabel(topic: QueryTopic | string): string {
  return QUERY_TOPICS.find((t) => t.value === topic)?.label ?? 'Something else';
}
