/**
 * The shapes the admin panel renders.
 *
 * These are written as the panel needs them, not as any one API returns them —
 * so when Shiprocket and Razorpay are wired up, the mapping happens in the data
 * layer and no screen changes.
 */

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'packed'
  | 'dispatched'
  | 'delivered'
  | 'cancelled'
  | 'rto';

export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'wallet' | 'cod';

export type SubscriptionStatus = 'active' | 'paused' | 'cancelled';

export type PurchaseType = 'one-time' | 'subscription';

export type Address = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  /** ISO date. */
  joinedAt: string;
  address: Address;
  orderCount: number;
  /** Lifetime value in paise-free rupees. */
  lifetimeValue: number;
  subscriptionId: string | null;
  lastOrderAt: string | null;
};

export type OrderItem = {
  sku: string;
  name: string;
  packets: string;
  quantity: number;
  unitPrice: number;
};

export type Shipment = {
  /** Shiprocket order id — null until it has been pushed. */
  shiprocketId: string | null;
  awb: string | null;
  courier: string | null;
  /** ISO timestamp of the last successful sync with Shiprocket. */
  lastSyncedAt: string | null;
  expectedDelivery: string | null;
  trackingUrl: string | null;
};

export type TimelineEvent = {
  at: string;
  label: string;
  detail?: string;
  /** Where the event came from, so manual edits are distinguishable. */
  source: 'store' | 'shiprocket' | 'razorpay' | 'admin';
};

export type Order = {
  id: string;
  /** Human-facing number, e.g. 10X-2041. */
  reference: string;
  customerId: string;
  placedAt: string;
  status: OrderStatus;
  type: PurchaseType;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  address: Address;
  payment: {
    status: PaymentStatus;
    method: PaymentMethod;
    transactionId: string | null;
  };
  shipment: Shipment;
  timeline: TimelineEvent[];
  note?: string;
};

export type Transaction = {
  id: string;
  orderId: string;
  orderReference: string;
  customerId: string;
  at: string;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  /** Razorpay payment id. */
  gatewayReference: string;
  /** Set only once a refund has been issued. */
  refundedAmount?: number;
  type: PurchaseType;
};

export type Subscription = {
  id: string;
  customerId: string;
  status: SubscriptionStatus;
  /** Recurring price per cycle. */
  price: number;
  /** Cycle length in weeks. */
  intervalWeeks: number;
  startedAt: string;
  nextChargeAt: string | null;
  cyclesCompleted: number;
  /** Cycles the customer chose to skip. */
  skips: number;
  /** Razorpay mandate / subscription id. */
  mandateReference: string | null;
  cancelledAt?: string;
  cancelReason?: string;
};
