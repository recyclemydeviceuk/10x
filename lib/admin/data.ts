import type {
  Customer,
  Order,
  OrderStatus,
  Subscription,
  Transaction,
} from './types';

/**
 * Sample dataset for the admin panel.
 *
 * Every value is fixed — no Date.now(), no Math.random() — so the server render
 * and the client hydration always agree, and so screenshots are stable.
 *
 * REPLACING THIS: each exported `list*` / `get*` function below is the seam.
 * Point them at the store's database (orders, customers), Shiprocket (shipment
 * fields) and Razorpay (transactions, subscription mandates) and the screens
 * need no changes.
 */

/** The dataset's "now". Real code should take this from the request. */
export const TODAY = new Date('2026-07-29T10:30:00+05:30');

const SKU = '10X-DAY-10';
const PRODUCT = '10X Day Time — Single Pack';
const PACKETS = '10 sticks';

/* ------------------------------------------------------------- customers */

export const CUSTOMERS: Customer[] = [
  {
    id: 'cus_01',
    name: 'Ananya Rao',
    email: 'ananya.rao@gmail.com',
    phone: '+91 98450 21188',
    joinedAt: '2026-02-14',
    address: { line1: '14, Dollars Colony', line2: 'RMV 2nd Stage', city: 'Bengaluru', state: 'Karnataka', pincode: '560094' },
    orderCount: 6,
    lifetimeValue: 6494,
    subscriptionId: 'sub_01',
    lastOrderAt: '2026-07-26',
  },
  {
    id: 'cus_02',
    name: 'Rohan Mehta',
    email: 'rohan.mehta@outlook.com',
    phone: '+91 99201 44530',
    joinedAt: '2026-03-02',
    address: { line1: 'B-1204, Oberoi Splendor', city: 'Mumbai', state: 'Maharashtra', pincode: '400060' },
    orderCount: 4,
    lifetimeValue: 4346,
    subscriptionId: 'sub_02',
    lastOrderAt: '2026-07-24',
  },
  {
    id: 'cus_03',
    name: 'Kavya Nair',
    email: 'kavya.nair@gmail.com',
    phone: '+91 97440 88213',
    joinedAt: '2026-04-11',
    address: { line1: '7/2, Panampilly Nagar', city: 'Kochi', state: 'Kerala', pincode: '682036' },
    orderCount: 3,
    lifetimeValue: 3247,
    subscriptionId: 'sub_03',
    lastOrderAt: '2026-07-22',
  },
  {
    id: 'cus_04',
    name: 'Arjun Sethi',
    email: 'arjun.sethi@work.co',
    phone: '+91 98110 76642',
    joinedAt: '2026-05-19',
    address: { line1: 'D-42, Defence Colony', city: 'New Delhi', state: 'Delhi', pincode: '110024' },
    orderCount: 2,
    lifetimeValue: 2398,
    subscriptionId: null,
    lastOrderAt: '2026-07-27',
  },
  {
    id: 'cus_05',
    name: 'Meera Iyer',
    email: 'meera.iyer@gmail.com',
    phone: '+91 90031 55127',
    joinedAt: '2026-05-28',
    address: { line1: '22, Boat Club Road', city: 'Chennai', state: 'Tamil Nadu', pincode: '600028' },
    orderCount: 3,
    lifetimeValue: 3297,
    subscriptionId: 'sub_04',
    lastOrderAt: '2026-07-28',
  },
  {
    id: 'cus_06',
    name: 'Vikram Shah',
    email: 'vikram@shahandco.in',
    phone: '+91 98250 31904',
    joinedAt: '2026-06-03',
    address: { line1: '9, Vastrapur Lake View', city: 'Ahmedabad', state: 'Gujarat', pincode: '380015' },
    orderCount: 1,
    lifetimeValue: 1199,
    subscriptionId: null,
    lastOrderAt: '2026-07-21',
  },
  {
    id: 'cus_07',
    name: 'Priya Deshmukh',
    email: 'priya.desh@gmail.com',
    phone: '+91 90280 61345',
    joinedAt: '2026-06-12',
    address: { line1: '18, Koregaon Park Annexe', city: 'Pune', state: 'Maharashtra', pincode: '411001' },
    orderCount: 2,
    lifetimeValue: 2248,
    subscriptionId: 'sub_05',
    lastOrderAt: '2026-07-25',
  },
  {
    id: 'cus_08',
    name: 'Aditya Menon',
    email: 'aditya.menon@gmail.com',
    phone: '+91 88610 20047',
    joinedAt: '2026-06-20',
    address: { line1: '502, Jubilee Hills Road 36', city: 'Hyderabad', state: 'Telangana', pincode: '500033' },
    orderCount: 1,
    lifetimeValue: 1199,
    subscriptionId: null,
    lastOrderAt: '2026-07-18',
  },
  {
    id: 'cus_09',
    name: 'Sneha Kulkarni',
    email: 'sneha.k@designstudio.in',
    phone: '+91 99870 41220',
    joinedAt: '2026-06-29',
    address: { line1: '3, Aundh Gaon', city: 'Pune', state: 'Maharashtra', pincode: '411007' },
    orderCount: 2,
    lifetimeValue: 2398,
    subscriptionId: null,
    lastOrderAt: '2026-07-28',
  },
  {
    id: 'cus_10',
    name: 'Karan Bhatia',
    email: 'karan.bhatia@gmail.com',
    phone: '+91 98730 55901',
    joinedAt: '2026-07-04',
    address: { line1: '211, Sector 15A', city: 'Chandigarh', state: 'Chandigarh', pincode: '160015' },
    orderCount: 1,
    lifetimeValue: 1199,
    subscriptionId: 'sub_06',
    lastOrderAt: '2026-07-23',
  },
  {
    id: 'cus_11',
    name: 'Tara Bose',
    email: 'tara.bose@gmail.com',
    phone: '+91 98300 12874',
    joinedAt: '2026-07-11',
    address: { line1: '5A, Ballygunge Circular Road', city: 'Kolkata', state: 'West Bengal', pincode: '700019' },
    orderCount: 1,
    lifetimeValue: 0,
    subscriptionId: null,
    lastOrderAt: '2026-07-27',
  },
  {
    id: 'cus_12',
    name: 'Nikhil Verma',
    email: 'nikhil.verma@gmail.com',
    phone: '+91 94150 33268',
    joinedAt: '2026-07-17',
    address: { line1: '88, Gomti Nagar Extension', city: 'Lucknow', state: 'Uttar Pradesh', pincode: '226010' },
    orderCount: 1,
    lifetimeValue: 1199,
    subscriptionId: null,
    lastOrderAt: '2026-07-29',
  },
];

/* ---------------------------------------------------------------- orders */

type OrderSeed = {
  n: number;
  customerId: string;
  placedAt: string;
  status: OrderStatus;
  subscription?: boolean;
  qty?: number;
  payment?: Order['payment'];
  shipment?: Partial<Order['shipment']>;
  note?: string;
};

const SEEDS: OrderSeed[] = [
  { n: 2058, customerId: 'cus_12', placedAt: '2026-07-29T09:12:00+05:30', status: 'pending', payment: { status: 'paid', method: 'upi', transactionId: 'pay_Qk81mL0aXr' } },
  { n: 2057, customerId: 'cus_05', placedAt: '2026-07-28T18:44:00+05:30', status: 'confirmed', subscription: true, payment: { status: 'paid', method: 'upi', transactionId: 'pay_Qk77dV2bWc' } },
  { n: 2056, customerId: 'cus_09', placedAt: '2026-07-28T14:02:00+05:30', status: 'packed', payment: { status: 'paid', method: 'card', transactionId: 'pay_Qk74nR9tQe' } },
  { n: 2055, customerId: 'cus_04', placedAt: '2026-07-27T20:31:00+05:30', status: 'dispatched', payment: { status: 'paid', method: 'netbanking', transactionId: 'pay_Qk6yTt4sZa' }, shipment: { awb: 'SR8841200391', courier: 'Delhivery Surface', expectedDelivery: '2026-07-31' } },
  { n: 2054, customerId: 'cus_11', placedAt: '2026-07-27T11:18:00+05:30', status: 'cancelled', payment: { status: 'failed', method: 'upi', transactionId: 'pay_Qk6vFj1mNb' }, note: 'UPI collect request expired. Customer asked to retry on card.' },
  { n: 2053, customerId: 'cus_01', placedAt: '2026-07-26T16:55:00+05:30', status: 'dispatched', subscription: true, payment: { status: 'paid', method: 'upi', transactionId: 'pay_Qk6pLw8kJd' }, shipment: { awb: 'SR8841198822', courier: 'Bluedart Express', expectedDelivery: '2026-07-30' } },
  { n: 2052, customerId: 'cus_07', placedAt: '2026-07-25T13:07:00+05:30', status: 'dispatched', subscription: true, payment: { status: 'paid', method: 'card', transactionId: 'pay_Qk6hBn3xSf' }, shipment: { awb: 'SR8841197043', courier: 'Delhivery Surface', expectedDelivery: '2026-07-30' } },
  { n: 2051, customerId: 'cus_02', placedAt: '2026-07-24T09:40:00+05:30', status: 'delivered', subscription: true, payment: { status: 'paid', method: 'upi', transactionId: 'pay_Qk69Yr6vHg' }, shipment: { awb: 'SR8841195517', courier: 'Bluedart Express', expectedDelivery: '2026-07-27' } },
  { n: 2050, customerId: 'cus_10', placedAt: '2026-07-23T17:26:00+05:30', status: 'delivered', payment: { status: 'paid', method: 'upi', transactionId: 'pay_Qk62Kd5pUh' }, shipment: { awb: 'SR8841193004', courier: 'Ekart Logistics', expectedDelivery: '2026-07-26' } },
  { n: 2049, customerId: 'cus_03', placedAt: '2026-07-22T12:15:00+05:30', status: 'delivered', subscription: true, payment: { status: 'paid', method: 'wallet', transactionId: 'pay_Qk5wGq7nTj' }, shipment: { awb: 'SR8841191288', courier: 'Delhivery Surface', expectedDelivery: '2026-07-25' } },
  { n: 2048, customerId: 'cus_06', placedAt: '2026-07-21T19:03:00+05:30', status: 'delivered', payment: { status: 'paid', method: 'card', transactionId: 'pay_Qk5rHs2wYk' }, shipment: { awb: 'SR8841189740', courier: 'Bluedart Express', expectedDelivery: '2026-07-24' } },
  { n: 2047, customerId: 'cus_08', placedAt: '2026-07-18T10:52:00+05:30', status: 'rto', payment: { status: 'refunded', method: 'upi', transactionId: 'pay_Qk5dMx4zPl' }, shipment: { awb: 'SR8841185126', courier: 'Ekart Logistics', expectedDelivery: '2026-07-22' }, note: 'Three delivery attempts failed — address unreachable. Refunded in full.' },
  { n: 2046, customerId: 'cus_05', placedAt: '2026-07-16T15:38:00+05:30', status: 'delivered', subscription: true, payment: { status: 'paid', method: 'upi', transactionId: 'pay_Qk58Nc9rVm' }, shipment: { awb: 'SR8841182390', courier: 'Delhivery Surface', expectedDelivery: '2026-07-19' } },
  { n: 2045, customerId: 'cus_09', placedAt: '2026-07-14T08:21:00+05:30', status: 'delivered', payment: { status: 'paid', method: 'netbanking', transactionId: 'pay_Qk51Zp3hKn' }, shipment: { awb: 'SR8841179655', courier: 'Bluedart Express', expectedDelivery: '2026-07-17' } },
  { n: 2044, customerId: 'cus_01', placedAt: '2026-07-12T21:09:00+05:30', status: 'delivered', subscription: true, payment: { status: 'paid', method: 'upi', transactionId: 'pay_Qk4vRb8dLp' }, shipment: { awb: 'SR8841176802', courier: 'Delhivery Surface', expectedDelivery: '2026-07-15' } },
  { n: 2043, customerId: 'cus_07', placedAt: '2026-07-10T11:47:00+05:30', status: 'delivered', payment: { status: 'paid', method: 'card', transactionId: 'pay_Qk4oJf5cMq' }, shipment: { awb: 'SR8841173411', courier: 'Ekart Logistics', expectedDelivery: '2026-07-13' } },
  { n: 2042, customerId: 'cus_04', placedAt: '2026-07-08T14:30:00+05:30', status: 'delivered', payment: { status: 'paid', method: 'upi', transactionId: 'pay_Qk4hWd1yBr' }, shipment: { awb: 'SR8841170077', courier: 'Bluedart Express', expectedDelivery: '2026-07-11' } },
  { n: 2041, customerId: 'cus_02', placedAt: '2026-07-06T09:55:00+05:30', status: 'delivered', subscription: true, payment: { status: 'paid', method: 'upi', transactionId: 'pay_Qk4bTn6qCs' }, shipment: { awb: 'SR8841166520', courier: 'Delhivery Surface', expectedDelivery: '2026-07-09' } },
  { n: 2040, customerId: 'cus_03', placedAt: '2026-07-03T16:12:00+05:30', status: 'delivered', subscription: true, payment: { status: 'paid', method: 'wallet', transactionId: 'pay_Qk44Vs2jDt' }, shipment: { awb: 'SR8841161933', courier: 'Delhivery Surface', expectedDelivery: '2026-07-06' } },
  { n: 2039, customerId: 'cus_10', placedAt: '2026-07-01T13:24:00+05:30', status: 'delivered', payment: { status: 'paid', method: 'card', transactionId: 'pay_Qk3xQl7fEu' }, shipment: { awb: 'SR8841158244', courier: 'Bluedart Express', expectedDelivery: '2026-07-04' } },
];

const SHIPPED: OrderStatus[] = ['dispatched', 'delivered', 'rto'];

function buildOrder(seed: OrderSeed): Order {
  const unitPrice = seed.subscription ? 1049 : 1199;
  const quantity = seed.qty ?? 1;
  const subtotal = unitPrice * quantity;
  const payment = seed.payment ?? { status: 'paid', method: 'upi', transactionId: null };
  const isPushed = SHIPPED.includes(seed.status) || seed.status === 'packed';

  const timeline: Order['timeline'] = [
    { at: seed.placedAt, label: 'Order placed', source: 'store' },
  ];
  if (payment.status === 'paid') {
    timeline.push({ at: seed.placedAt, label: 'Payment captured', detail: payment.transactionId ?? undefined, source: 'razorpay' });
  }
  if (payment.status === 'failed') {
    timeline.push({ at: seed.placedAt, label: 'Payment failed', detail: 'Collect request expired', source: 'razorpay' });
  }
  if (isPushed) {
    timeline.push({ at: seed.placedAt, label: 'Pushed to Shiprocket', detail: seed.shipment?.awb ? `AWB ${seed.shipment.awb}` : undefined, source: 'shiprocket' });
  }
  if (SHIPPED.includes(seed.status)) {
    timeline.push({ at: seed.placedAt, label: 'Dispatched', detail: seed.shipment?.courier ?? undefined, source: 'shiprocket' });
  }
  if (seed.status === 'delivered') {
    timeline.push({ at: seed.shipment?.expectedDelivery ?? seed.placedAt, label: 'Delivered', source: 'shiprocket' });
  }
  if (seed.status === 'rto') {
    timeline.push({ at: seed.shipment?.expectedDelivery ?? seed.placedAt, label: 'Returned to origin', detail: 'Three failed attempts', source: 'shiprocket' });
    timeline.push({ at: seed.shipment?.expectedDelivery ?? seed.placedAt, label: 'Refund issued', detail: 'Full amount', source: 'admin' });
  }
  if (seed.status === 'cancelled') {
    timeline.push({ at: seed.placedAt, label: 'Cancelled', detail: 'Payment never completed', source: 'admin' });
  }

  return {
    id: `ord_${seed.n}`,
    reference: `10X-${seed.n}`,
    customerId: seed.customerId,
    placedAt: seed.placedAt,
    status: seed.status,
    type: seed.subscription ? 'subscription' : 'one-time',
    items: [{ sku: SKU, name: PRODUCT, packets: PACKETS, quantity, unitPrice }],
    subtotal,
    shipping: 0,
    discount: 0,
    total: subtotal,
    address: CUSTOMERS.find((c) => c.id === seed.customerId)!.address,
    payment,
    shipment: {
      shiprocketId: isPushed ? `SR-${seed.n}` : null,
      awb: seed.shipment?.awb ?? null,
      courier: seed.shipment?.courier ?? null,
      lastSyncedAt: isPushed ? '2026-07-29T10:05:00+05:30' : null,
      expectedDelivery: seed.shipment?.expectedDelivery ?? null,
      trackingUrl: seed.shipment?.awb ? `https://shiprocket.co/tracking/${seed.shipment.awb}` : null,
    },
    timeline,
    note: seed.note,
  };
}

export const ORDERS: Order[] = SEEDS.map(buildOrder);

/* ---------------------------------------------------------- transactions */

export const TRANSACTIONS: Transaction[] = ORDERS.filter(
  (o) => o.payment.transactionId,
).map((o) => ({
  id: `txn_${o.reference.replace('10X-', '')}`,
  orderId: o.id,
  orderReference: o.reference,
  customerId: o.customerId,
  at: o.placedAt,
  amount: o.total,
  status: o.payment.status,
  method: o.payment.method,
  gatewayReference: o.payment.transactionId!,
  refundedAmount: o.payment.status === 'refunded' ? o.total : undefined,
  type: o.type,
}));

/* --------------------------------------------------------- subscriptions */

export const SUBSCRIPTIONS: Subscription[] = [
  { id: 'sub_01', customerId: 'cus_01', status: 'active', price: 1049, intervalWeeks: 4, startedAt: '2026-03-14', nextChargeAt: '2026-08-23', cyclesCompleted: 5, skips: 1, mandateReference: 'sub_QjA41mNpLc' },
  { id: 'sub_02', customerId: 'cus_02', status: 'active', price: 1049, intervalWeeks: 4, startedAt: '2026-04-02', nextChargeAt: '2026-08-21', cyclesCompleted: 4, skips: 0, mandateReference: 'sub_QjA48kRtWd' },
  { id: 'sub_03', customerId: 'cus_03', status: 'paused', price: 1049, intervalWeeks: 4, startedAt: '2026-04-22', nextChargeAt: null, cyclesCompleted: 3, skips: 2, mandateReference: 'sub_QjA52pYvXe' },
  { id: 'sub_04', customerId: 'cus_05', status: 'active', price: 1049, intervalWeeks: 4, startedAt: '2026-05-30', nextChargeAt: '2026-08-25', cyclesCompleted: 2, skips: 0, mandateReference: 'sub_QjA57bHnZf' },
  { id: 'sub_05', customerId: 'cus_07', status: 'active', price: 1049, intervalWeeks: 4, startedAt: '2026-06-14', nextChargeAt: '2026-08-22', cyclesCompleted: 2, skips: 0, mandateReference: 'sub_QjA63cJqAg' },
  { id: 'sub_06', customerId: 'cus_10', status: 'cancelled', price: 1049, intervalWeeks: 4, startedAt: '2026-07-05', nextChargeAt: null, cyclesCompleted: 1, skips: 0, mandateReference: null, cancelledAt: '2026-07-26', cancelReason: 'Travelling for two months' },
];

/* ------------------------------------------------------- revenue history */

/** Net revenue per day for the last fortnight — the overview trend. */
export const DAILY_REVENUE: { date: string; revenue: number; orders: number }[] = [
  { date: '2026-07-16', revenue: 2098, orders: 2 },
  { date: '2026-07-17', revenue: 1199, orders: 1 },
  { date: '2026-07-18', revenue: 2398, orders: 2 },
  { date: '2026-07-19', revenue: 1049, orders: 1 },
  { date: '2026-07-20', revenue: 3597, orders: 3 },
  { date: '2026-07-21', revenue: 2248, orders: 2 },
  { date: '2026-07-22', revenue: 4295, orders: 4 },
  { date: '2026-07-23', revenue: 2398, orders: 2 },
  { date: '2026-07-24', revenue: 3347, orders: 3 },
  { date: '2026-07-25', revenue: 5245, orders: 5 },
  { date: '2026-07-26', revenue: 3447, orders: 3 },
  { date: '2026-07-27', revenue: 2398, orders: 2 },
  { date: '2026-07-28', revenue: 4396, orders: 4 },
  { date: '2026-07-29', revenue: 5594, orders: 5 },
];

/* ------------------------------------------------------- derived analytics */

/** Orders per city, biggest first — where the demand actually is. */
export function ordersByCity(): { label: string; value: number }[] {
  const counts = new Map<string, number>();
  for (const order of ORDERS) {
    if (order.status === 'cancelled') continue;
    const city = getCustomer(order.customerId)?.address.city ?? 'Unknown';
    counts.set(city, (counts.get(city) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

/** How people pay. Failed attempts are excluded — this is captured money. */
export function revenueByMethod(): { label: string; value: number }[] {
  const totals = new Map<string, number>();
  for (const txn of TRANSACTIONS) {
    if (txn.status !== 'paid') continue;
    const key = txn.method;
    totals.set(key, (totals.get(key) ?? 0) + txn.amount);
  }
  return [...totals.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

/** The fulfilment pipeline, in the order an order actually moves through it. */
export function fulfilmentFunnel(): { label: string; value: number }[] {
  const live = ORDERS.filter((o) => o.status !== 'cancelled');
  const reached = (stages: OrderStatus[]) =>
    live.filter((o) => stages.includes(o.status)).length;

  return [
    { label: 'Paid', value: live.length },
    { label: 'Packed', value: reached(['packed', 'dispatched', 'delivered', 'rto']) },
    { label: 'Dispatched', value: reached(['dispatched', 'delivered', 'rto']) },
    { label: 'Delivered', value: reached(['delivered']) },
  ];
}

/** One-time vs subscription, by captured revenue. */
export function revenueByPurchaseType(): { label: string; value: number }[] {
  const totals = { 'One-time': 0, Subscription: 0 };
  for (const txn of TRANSACTIONS) {
    if (txn.status !== 'paid') continue;
    if (txn.type === 'subscription') totals.Subscription += txn.amount;
    else totals['One-time'] += txn.amount;
  }
  return [
    { label: 'One-time', value: totals['One-time'] },
    { label: 'Subscription', value: totals.Subscription },
  ];
}

/** Orders by weekday — tells you when to staff the packing bench. */
export function ordersByWeekday(): { label: string; value: number }[] {
  const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const counts = new Array(7).fill(0);
  for (const order of ORDERS) {
    counts[new Date(order.placedAt).getDay()] += 1;
  }
  // Monday-first reads better for a working week.
  const order = [1, 2, 3, 4, 5, 6, 0];
  return order.map((i) => ({ label: names[i], value: counts[i] }));
}

/** Average order value per day, for the trend line. */
export function averageOrderValueSeries(): { date: string; value: number }[] {
  return DAILY_REVENUE.map((d) => ({
    date: d.date,
    value: d.orders ? Math.round(d.revenue / d.orders) : 0,
  }));
}

/** Running total across the fortnight. */
export function cumulativeRevenueSeries(): { date: string; value: number }[] {
  let running = 0;
  return DAILY_REVENUE.map((d) => {
    running += d.revenue;
    return { date: d.date, value: running };
  });
}

/** Share of live orders that reached the customer without coming back. */
export function deliverySuccessRate(): number {
  const shipped = ORDERS.filter((o) => ['delivered', 'rto'].includes(o.status));
  if (shipped.length === 0) return 0;
  const delivered = shipped.filter((o) => o.status === 'delivered').length;
  return Math.round((delivered / shipped.length) * 100);
}

/** New customers per week over the last six weeks. */
export const NEW_CUSTOMERS_BY_WEEK: { label: string; value: number }[] = [
  { label: '23 Jun', value: 1 },
  { label: '30 Jun', value: 2 },
  { label: '07 Jul', value: 2 },
  { label: '14 Jul', value: 3 },
  { label: '21 Jul', value: 2 },
  { label: '28 Jul', value: 4 },
];

/* ---------------------------------------------------------------- lookups */

export function listOrders(options: { status?: OrderStatus | 'all'; query?: string } = {}): Order[] {
  const { status = 'all', query } = options;
  const needle = query?.trim().toLowerCase();

  return ORDERS.filter((order) => {
    if (status !== 'all' && order.status !== status) return false;
    if (!needle) return true;
    const customer = getCustomer(order.customerId);
    return [order.reference, customer?.name, customer?.email, order.shipment.awb]
      .filter(Boolean)
      .some((field) => field!.toLowerCase().includes(needle));
  });
}

export function getOrder(id: string): Order | undefined {
  return ORDERS.find((o) => o.id === id || o.reference.toLowerCase() === id.toLowerCase());
}

export function listCustomers(query?: string): Customer[] {
  const needle = query?.trim().toLowerCase();
  if (!needle) return CUSTOMERS;
  return CUSTOMERS.filter((c) =>
    [c.name, c.email, c.phone].some((field) => field.toLowerCase().includes(needle)),
  );
}

export function getCustomer(id: string): Customer | undefined {
  return CUSTOMERS.find((c) => c.id === id);
}

export function getCustomerOrders(customerId: string): Order[] {
  return ORDERS.filter((o) => o.customerId === customerId);
}

export function getSubscription(id: string | null): Subscription | undefined {
  if (!id) return undefined;
  return SUBSCRIPTIONS.find((s) => s.id === id);
}

export function listSubscriptions(status?: Subscription['status'] | 'all'): Subscription[] {
  if (!status || status === 'all') return SUBSCRIPTIONS;
  return SUBSCRIPTIONS.filter((s) => s.status === status);
}

export function listTransactions(options: { status?: Transaction['status'] | 'all'; query?: string } = {}): Transaction[] {
  const { status = 'all', query } = options;
  const needle = query?.trim().toLowerCase();

  return TRANSACTIONS.filter((txn) => {
    if (status !== 'all' && txn.status !== status) return false;
    if (!needle) return true;
    const customer = getCustomer(txn.customerId);
    return [txn.gatewayReference, txn.orderReference, customer?.name, customer?.email]
      .filter(Boolean)
      .some((field) => field!.toLowerCase().includes(needle));
  });
}

export function getTransaction(id: string): Transaction | undefined {
  return TRANSACTIONS.find((t) => t.id === id || t.gatewayReference === id);
}

/** Headline numbers for the overview. */
export function getOverview() {
  const fortnight = DAILY_REVENUE.slice(-7);
  const previous = DAILY_REVENUE.slice(-14, -7);

  const revenue = fortnight.reduce((sum, d) => sum + d.revenue, 0);
  const previousRevenue = previous.reduce((sum, d) => sum + d.revenue, 0);
  const orderCount = fortnight.reduce((sum, d) => sum + d.orders, 0);
  const previousOrders = previous.reduce((sum, d) => sum + d.orders, 0);

  const awaitingDispatch = ORDERS.filter((o) =>
    ['pending', 'confirmed', 'packed'].includes(o.status),
  ).length;
  const activeSubscriptions = SUBSCRIPTIONS.filter((s) => s.status === 'active').length;
  const notPushed = ORDERS.filter(
    (o) => !o.shipment.shiprocketId && !['cancelled'].includes(o.status),
  ).length;

  return {
    revenue,
    revenueDelta: percentChange(revenue, previousRevenue),
    orderCount,
    orderDelta: percentChange(orderCount, previousOrders),
    awaitingDispatch,
    activeSubscriptions,
    notPushed,
    /** Recurring revenue booked per cycle from active subscriptions. */
    recurringPerCycle: SUBSCRIPTIONS.filter((s) => s.status === 'active').reduce(
      (sum, s) => sum + s.price,
      0,
    ),
  };
}

function percentChange(current: number, previous: number): number | null {
  if (!previous) return null;
  return Math.round(((current - previous) / previous) * 100);
}
