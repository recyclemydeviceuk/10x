import Link from 'next/link';
import { notFound } from 'next/navigation';

import StatTile from '@/components/admin/StatTile';
import {
  Avatar,
  EmptyState,
  Field,
  Money,
  Mono,
  OrderStatusPill,
  Panel,
  SubscriptionStatusPill,
  Table,
  Td,
  Th,
} from '@/components/admin/ui';
import {
  TODAY,
  getCustomer,
  getCustomerOrders,
  getSubscription,
} from '@/lib/admin/data';
import { dateTime, fullDate, initials, money, relativeDays } from '@/lib/admin/format';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = getCustomer(id);
  return { title: customer ? customer.name : 'Customer' };
}

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = getCustomer(id);
  if (!customer) notFound();

  const orders = getCustomerOrders(customer.id);
  const subscription = getSubscription(customer.subscriptionId);
  const delivered = orders.filter((o) => o.status === 'delivered').length;
  const averageOrder = orders.length
    ? Math.round(customer.lifetimeValue / Math.max(1, orders.length))
    : 0;

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/customers"
          className="inline-flex cursor-pointer items-center gap-1.5 font-quantico text-[10px] font-bold uppercase tracking-[0.14em] text-fg-muted transition-colors hover:text-ink"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          All customers
        </Link>

        <div className="mt-4 flex flex-col gap-4 border-b border-paper-200 pb-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-ink font-quantico text-base font-bold text-white">
              {initials(customer.name)}
            </span>
            <div className="min-w-0">
              <h1 className="font-quantico text-2xl font-bold uppercase tracking-[0.01em] text-ink">
                {customer.name}
              </h1>
              <p className="type-b2 mt-1 truncate text-fg-muted">
                {customer.email} · {customer.phone}
              </p>
            </div>
          </div>
          {subscription && <SubscriptionStatusPill status={subscription.status} />}
        </div>
      </div>

      <div className="grid gap-px bg-paper-200 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Lifetime value" value={money(customer.lifetimeValue)} />
        <StatTile label="Orders" value={String(orders.length)} footnote={`${delivered} delivered`} />
        <StatTile label="Average order" value={money(averageOrder)} />
        <StatTile
          label="Customer since"
          value={fullDate(customer.joinedAt).replace(/ \d{4}$/, '')}
          footnote={new Date(customer.joinedAt).getFullYear().toString()}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Panel title="Order history" bodyClassName="">
          {orders.length === 0 ? (
            <EmptyState title="No orders yet" />
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Order</Th>
                  <Th>Placed</Th>
                  <Th>Type</Th>
                  <Th>Status</Th>
                  <Th align="right">Total</Th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-paper-50">
                    <Td>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="cursor-pointer font-quantico text-[13px] font-bold text-ink hover:underline"
                      >
                        {order.reference}
                      </Link>
                    </Td>
                    <Td>
                      <span className="type-b2 whitespace-nowrap text-fg-muted">
                        {dateTime(order.placedAt)}
                      </span>
                    </Td>
                    <Td>
                      <span className="type-b2 capitalize text-fg-muted">{order.type}</span>
                    </Td>
                    <Td>
                      <OrderStatusPill status={order.status} />
                    </Td>
                    <Td align="right">
                      <span className="font-quantico text-[13px] font-bold text-ink">
                        {money(order.total)}
                      </span>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Panel>

        <div className="space-y-6">
          <Panel title="Details">
            <dl className="space-y-4">
              <Field label="Email">{customer.email}</Field>
              <Field label="Phone">{customer.phone}</Field>
              <Field label="Default address">
                <span className="block leading-relaxed">
                  {customer.address.line1}
                  {customer.address.line2 && (
                    <>
                      <br />
                      {customer.address.line2}
                    </>
                  )}
                  <br />
                  {customer.address.city}, {customer.address.state} {customer.address.pincode}
                </span>
              </Field>
              <Field label="Last order">
                {customer.lastOrderAt ? fullDate(customer.lastOrderAt) : '—'}
              </Field>
            </dl>
          </Panel>

          {subscription && (
            <Panel
              title="Subscription"
              action={<SubscriptionStatusPill status={subscription.status} />}
            >
              <dl className="space-y-4">
                <Field label="Plan">
                  <Money>{money(subscription.price)}</Money> every{' '}
                  {subscription.intervalWeeks} weeks
                </Field>
                <Field label="Next charge">
                  {subscription.nextChargeAt ? (
                    <>
                      {fullDate(subscription.nextChargeAt)}{' '}
                      <span className="text-fg-subtle">
                        ({relativeDays(subscription.nextChargeAt, TODAY)})
                      </span>
                    </>
                  ) : (
                    <span className="text-fg-subtle">Not scheduled</span>
                  )}
                </Field>
                <Field label="Cycles">
                  {subscription.cyclesCompleted} completed · {subscription.skips} skipped
                </Field>
                <Field label="Mandate">
                  {subscription.mandateReference ? (
                    <Mono>{subscription.mandateReference}</Mono>
                  ) : (
                    <span className="text-fg-subtle">Revoked</span>
                  )}
                </Field>
              </dl>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
