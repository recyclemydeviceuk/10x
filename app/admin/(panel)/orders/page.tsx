import Link from 'next/link';
import { Suspense } from 'react';

import { FilterTabs, SearchField } from '@/components/admin/Filters';
import {
  Avatar,
  EmptyState,
  Mono,
  OrderStatusPill,
  PageHeader,
  PaymentStatusPill,
  Panel,
  Table,
  Td,
  Th,
} from '@/components/admin/ui';
import { ORDERS, getCustomer, listOrders } from '@/lib/admin/data';
import type { OrderStatus } from '@/lib/admin/types';
import { fullDate, initials, money, timeOnly } from '@/lib/admin/format';

export const metadata = { title: 'Orders' };

const STATUSES: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'packed', label: 'Packed' },
  { value: 'dispatched', label: 'Dispatched' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'rto', label: 'Returned' },
];

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status = 'all', q } = await searchParams;
  const orders = listOrders({ status: status as OrderStatus | 'all', query: q });

  const options = STATUSES.map((s) => ({
    ...s,
    count:
      s.value === 'all'
        ? ORDERS.length
        : ORDERS.filter((o) => o.status === s.value).length,
  }));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Orders"
        subtitle="Every order, with its payment and its Shiprocket shipment on the same row."
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Suspense fallback={null}>
          <FilterTabs options={options} />
        </Suspense>
        <Suspense fallback={null}>
          <SearchField placeholder="Order, customer or AWB" />
        </Suspense>
      </div>

      <Panel bodyClassName="">
        {orders.length === 0 ? (
          <EmptyState
            title="No orders match"
            detail="Try a different status, or clear the search."
          />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Order</Th>
                <Th>Customer</Th>
                <Th>Placed</Th>
                <Th>Payment</Th>
                <Th>Shipment</Th>
                <Th>Status</Th>
                <Th align="right">Total</Th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const customer = getCustomer(order.customerId);
                return (
                  <tr key={order.id} className="transition-colors hover:bg-paper-50">
                    <Td>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="cursor-pointer font-quantico text-[13px] font-bold text-ink hover:underline"
                      >
                        {order.reference}
                      </Link>
                      {order.type === 'subscription' && (
                        <span className="mt-1 block font-nebula text-[9px] font-bold uppercase tracking-[0.14em] text-[#4EA310]">
                          Subscription
                        </span>
                      )}
                    </Td>
                    <Td>
                      <span className="flex items-center gap-3">
                        <Avatar initials={initials(customer?.name ?? '')} />
                        <span className="min-w-0">
                          <span className="type-b2 block truncate text-ink">{customer?.name}</span>
                          <span className="type-b2 block truncate text-fg-subtle">
                            {customer?.address.city}
                          </span>
                        </span>
                      </span>
                    </Td>
                    <Td>
                      <span className="block whitespace-nowrap">
                        <span className="type-b2 block text-ink">{fullDate(order.placedAt)}</span>
                        <span className="type-b2 block text-fg-subtle">
                          {timeOnly(order.placedAt)}
                        </span>
                      </span>
                    </Td>
                    <Td>
                      <PaymentStatusPill status={order.payment.status} />
                    </Td>
                    <Td>
                      {order.shipment.awb ? (
                        <span className="block">
                          <Mono>{order.shipment.awb}</Mono>
                          <span className="type-b2 block text-fg-subtle">
                            {order.shipment.courier}
                          </span>
                        </span>
                      ) : (
                        <span className="type-b2 whitespace-nowrap text-fg-subtle">Not pushed</span>
                      )}
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
                );
              })}
            </tbody>
          </Table>
        )}
      </Panel>

      <p className="type-b2 text-fg-subtle">
        Showing {orders.length} of {ORDERS.length} orders.
      </p>
    </div>
  );
}
