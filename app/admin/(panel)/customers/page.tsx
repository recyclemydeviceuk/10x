import Link from 'next/link';
import { Suspense } from 'react';

import { SearchField } from '@/components/admin/Filters';
import {
  Avatar,
  EmptyState,
  PageHeader,
  Panel,
  SubscriptionStatusPill,
  Table,
  Td,
  Th,
} from '@/components/admin/ui';
import { CUSTOMERS, getSubscription, listCustomers } from '@/lib/admin/data';
import { fullDate, initials, money } from '@/lib/admin/format';

export const metadata = { title: 'Customers' };

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const customers = listCustomers(q);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Customers"
        subtitle="Who is buying, how often, and what they’re worth."
      />

      <div className="flex justify-end">
        <Suspense fallback={null}>
          <SearchField placeholder="Name, email or phone" />
        </Suspense>
      </div>

      <Panel bodyClassName="">
        {customers.length === 0 ? (
          <EmptyState title="No customers match" detail="Try a different search." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Customer</Th>
                <Th>Location</Th>
                <Th>Joined</Th>
                <Th>Subscription</Th>
                <Th align="right">Orders</Th>
                <Th align="right">Value</Th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => {
                const subscription = getSubscription(customer.subscriptionId);
                return (
                  <tr key={customer.id} className="transition-colors hover:bg-paper-50">
                    <Td className="max-w-[260px]">
                      <span className="flex items-center gap-3">
                        <Avatar initials={initials(customer.name)} />
                        <span className="min-w-0">
                          <Link
                            href={`/admin/customers/${customer.id}`}
                            className="type-b2 block cursor-pointer truncate font-bold text-ink hover:underline"
                          >
                            {customer.name}
                          </Link>
                          <span className="type-b2 block truncate text-fg-subtle">
                            {customer.email}
                          </span>
                        </span>
                      </span>
                    </Td>
                    <Td>
                      <span className="type-b2 whitespace-nowrap text-fg-muted">
                        {customer.address.city}, {customer.address.state}
                      </span>
                    </Td>
                    <Td>
                      <span className="type-b2 whitespace-nowrap text-fg-muted">
                        {fullDate(customer.joinedAt)}
                      </span>
                    </Td>
                    <Td>
                      {subscription ? (
                        <SubscriptionStatusPill status={subscription.status} />
                      ) : (
                        <span className="type-b2 text-fg-subtle">—</span>
                      )}
                    </Td>
                    <Td align="right">
                      <span className="font-quantico text-[13px] font-bold text-ink">
                        {customer.orderCount}
                      </span>
                    </Td>
                    <Td align="right">
                      <span className="font-quantico text-[13px] font-bold text-ink">
                        {money(customer.lifetimeValue)}
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
        Showing {customers.length} of {CUSTOMERS.length} customers.
      </p>
    </div>
  );
}
