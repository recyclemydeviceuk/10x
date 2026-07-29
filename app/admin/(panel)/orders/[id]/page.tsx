import Link from 'next/link';
import { notFound } from 'next/navigation';

import OrderStatusControl from '@/components/admin/OrderStatusControl';
import {
  Avatar,
  ButtonLink,
  Field,
  Money,
  Mono,
  OrderStatusPill,
  Panel,
  PaymentStatusPill,
} from '@/components/admin/ui';
import { getCustomer, getOrder, getSubscription } from '@/lib/admin/data';
import { dateTime, fullDate, initials, methodLabel, money } from '@/lib/admin/format';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = getOrder(id);
  return { title: order ? order.reference : 'Order' };
}

const SOURCE_LABEL: Record<string, string> = {
  store: '10X',
  shiprocket: 'Shiprocket',
  razorpay: 'Razorpay',
  admin: 'Admin',
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = getOrder(id);
  if (!order) notFound();

  const customer = getCustomer(order.customerId);
  const subscription = getSubscription(customer?.subscriptionId ?? null);

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/orders"
          className="inline-flex cursor-pointer items-center gap-1.5 font-quantico text-[10px] font-bold uppercase tracking-[0.14em] text-fg-muted transition-colors hover:text-ink"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          All orders
        </Link>

        <div className="mt-4 flex flex-col gap-5 border-b border-paper-200 pb-7 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-quantico text-2xl font-bold uppercase tracking-[0.01em] text-ink md:text-[28px]">
                {order.reference}
              </h1>
              <OrderStatusPill status={order.status} />
              {order.type === 'subscription' && (
                <span className="font-nebula text-[9px] font-bold uppercase tracking-[0.14em] text-[#4EA310]">
                  Subscription order
                </span>
              )}
            </div>
            <p className="type-b2 mt-2 text-fg-muted">Placed {dateTime(order.placedAt)}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <OrderStatusControl orderId={order.id} status={order.status} />
          </div>
        </div>
      </div>

      {order.note && (
        <p className="border-l-2 border-warning bg-white px-4 py-3 font-pt text-[14px] text-fg-muted">
          {order.note}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* ------------------------------------------------ left: the order */}
        <div className="space-y-6">
          <Panel title="Items" bodyClassName="">
            <ul className="divide-y divide-paper-100">
              {order.items.map((item) => (
                <li key={item.sku} className="flex items-center justify-between gap-4 px-6 py-5">
                  <div className="min-w-0">
                    <p className="type-b2 font-bold text-ink">{item.name}</p>
                    <p className="type-b2 text-fg-subtle">
                      {item.packets} · <Mono>{item.sku}</Mono>
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-quantico text-[13px] font-bold text-ink">
                      {money(item.unitPrice)}
                    </p>
                    <p className="type-b2 text-fg-subtle">× {item.quantity}</p>
                  </div>
                </li>
              ))}
            </ul>

            <dl className="space-y-2.5 border-t border-paper-200 px-6 py-5">
              <div className="flex justify-between">
                <dt className="type-b2 text-fg-muted">Subtotal</dt>
                <dd className="font-quantico text-[13px] font-bold text-ink">
                  {money(order.subtotal)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="type-b2 text-fg-muted">Shipping</dt>
                <dd className="font-quantico text-[13px] font-bold text-ink">
                  {order.shipping === 0 ? 'Free' : money(order.shipping)}
                </dd>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between">
                  <dt className="type-b2 text-fg-muted">Discount</dt>
                  <dd className="font-quantico text-[13px] font-bold text-[#4EA310]">
                    −{money(order.discount)}
                  </dd>
                </div>
              )}
              <div className="flex items-baseline justify-between border-t border-paper-200 pt-3.5">
                <dt className="font-nebula text-[10px] font-bold uppercase tracking-[0.16em] text-fg-subtle">
                  Total · incl. GST
                </dt>
                <dd className="font-quantico text-xl font-bold text-ink">{money(order.total)}</dd>
              </div>
            </dl>
          </Panel>

          <Panel title="Timeline">
            <ol className="space-y-0">
              {order.timeline.map((event, i) => (
                <li key={`${event.label}-${i}`} className="relative flex gap-4 pb-6 last:pb-0">
                  {/* Connector */}
                  {i < order.timeline.length - 1 && (
                    <span aria-hidden className="absolute left-[5px] top-3 h-full w-px bg-paper-200" />
                  )}
                  <span
                    aria-hidden
                    className={`relative mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                      i === order.timeline.length - 1 ? 'bg-[#4EA310]' : 'bg-paper-300'
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <p className="type-b2 font-bold text-ink">{event.label}</p>
                      <p className="type-b2 whitespace-nowrap text-fg-subtle">
                        {dateTime(event.at)}
                      </p>
                    </div>
                    <p className="type-b2 text-fg-muted">
                      <span className="font-nebula text-[9px] font-bold uppercase tracking-[0.14em] text-fg-subtle">
                        {SOURCE_LABEL[event.source]}
                      </span>
                      {event.detail && <> · {event.detail}</>}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Panel>
        </div>

        {/* ------------------------------------------ right: who, paid, sent */}
        <div className="space-y-6">
          <Panel title="Customer">
            <div className="flex items-center gap-3">
              <Avatar initials={initials(customer?.name ?? '')} />
              <div className="min-w-0">
                <Link
                  href={`/admin/customers/${customer?.id}`}
                  className="type-b2 block cursor-pointer truncate font-bold text-ink hover:underline"
                >
                  {customer?.name}
                </Link>
                <p className="type-b2 truncate text-fg-subtle">{customer?.email}</p>
              </div>
            </div>

            <dl className="mt-5 space-y-4 border-t border-paper-100 pt-5">
              <Field label="Phone">{customer?.phone}</Field>
              <Field label="Orders">
                {customer?.orderCount} · <Money>{money(customer?.lifetimeValue ?? 0)}</Money>{' '}
                lifetime
              </Field>
              <Field label="Delivery address">
                <span className="block leading-relaxed">
                  {order.address.line1}
                  {order.address.line2 && (
                    <>
                      <br />
                      {order.address.line2}
                    </>
                  )}
                  <br />
                  {order.address.city}, {order.address.state} {order.address.pincode}
                </span>
              </Field>
              {subscription && (
                <Field label="Subscription">
                  <Link
                    href="/admin/subscriptions"
                    className="cursor-pointer text-ink underline decoration-paper-300 underline-offset-2 hover:decoration-ink"
                  >
                    {subscription.status === 'active' ? 'Active' : subscription.status} · every{' '}
                    {subscription.intervalWeeks} weeks
                  </Link>
                </Field>
              )}
            </dl>
          </Panel>

          <Panel
            title="Payment"
            action={<PaymentStatusPill status={order.payment.status} />}
          >
            <dl className="space-y-4">
              <Field label="Amount">
                <span className="font-quantico text-base font-bold">{money(order.total)}</span>
              </Field>
              <Field label="Method">{methodLabel(order.payment.method)} · Razorpay</Field>
              <Field label="Payment ID">
                {order.payment.transactionId ? (
                  <Mono>{order.payment.transactionId}</Mono>
                ) : (
                  <span className="text-fg-subtle">Not captured</span>
                )}
              </Field>
            </dl>

            {order.payment.transactionId && order.payment.status !== 'failed' && (
              <ButtonLink
                href={`/admin/transactions/txn_${order.reference.replace('10X-', '')}/receipt`}
                className="mt-5 w-full"
                target="_blank"
                rel="noopener"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M12 3v12M7 11l5 5 5-5M5 21h14" />
                </svg>
                Download receipt
              </ButtonLink>
            )}
          </Panel>

          <Panel title="Shipment">
            {order.shipment.shiprocketId ? (
              <dl className="space-y-4">
                <Field label="AWB">
                  {order.shipment.awb ? <Mono>{order.shipment.awb}</Mono> : 'Awaiting AWB'}
                </Field>
                <Field label="Courier">{order.shipment.courier ?? '—'}</Field>
                <Field label="Expected delivery">
                  {order.shipment.expectedDelivery
                    ? fullDate(order.shipment.expectedDelivery)
                    : '—'}
                </Field>
                <Field label="Last synced">
                  {order.shipment.lastSyncedAt ? dateTime(order.shipment.lastSyncedAt) : 'Never'}
                </Field>
              </dl>
            ) : (
              <p className="type-b2 text-fg-muted">
                This order hasn’t been pushed to Shiprocket yet. It won’t appear in the
                courier’s manifest until it is.
              </p>
            )}

            {order.shipment.trackingUrl && (
              <ButtonLink
                href={order.shipment.trackingUrl}
                className="mt-5 w-full"
                target="_blank"
                rel="noopener noreferrer"
              >
                Track shipment
              </ButtonLink>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
