import Link from 'next/link';
import { Suspense } from 'react';

import { FilterTabs } from '@/components/admin/Filters';
import StatTile from '@/components/admin/StatTile';
import SubscriptionActions from '@/components/admin/SubscriptionActions';
import {
  Avatar,
  EmptyState,
  Money,
  PageHeader,
  Panel,
  SubscriptionStatusPill,
  Table,
  Td,
  Th,
} from '@/components/admin/ui';
import { SUBSCRIPTIONS, TODAY, getCustomer, listSubscriptions } from '@/lib/admin/data';
import type { SubscriptionStatus } from '@/lib/admin/types';
import { fullDate, initials, money, relativeDays } from '@/lib/admin/format';

export const metadata = { title: 'Subscriptions' };

const STATUSES: { value: SubscriptionStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default async function SubscriptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status = 'all' } = await searchParams;
  const subscriptions = listSubscriptions(status as SubscriptionStatus | 'all');

  const active = SUBSCRIPTIONS.filter((s) => s.status === 'active');
  const recurring = active.reduce((sum, s) => sum + s.price, 0);
  const cancelled = SUBSCRIPTIONS.filter((s) => s.status === 'cancelled').length;
  const retention = SUBSCRIPTIONS.length
    ? Math.round(((SUBSCRIPTIONS.length - cancelled) / SUBSCRIPTIONS.length) * 100)
    : 0;

  const options = STATUSES.map((s) => ({
    ...s,
    count:
      s.value === 'all'
        ? SUBSCRIPTIONS.length
        : SUBSCRIPTIONS.filter((sub) => sub.status === s.value).length,
  }));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Subscriptions"
        subtitle={
          <>
            Every 4 weeks at <Money>₹1,049</Money>. Skips and cancels apply from the
            next cycle.
          </>
        }
      />

      <div className="grid gap-px bg-paper-200 sm:grid-cols-3">
        <StatTile label="Active" value={String(active.length)} footnote="mandates live" />
        <StatTile label="Per cycle" value={money(recurring)} footnote="if none skip" />
        <StatTile label="Retained" value={`${retention}%`} footnote={`${cancelled} cancelled`} />
      </div>

      <Suspense fallback={null}>
        <FilterTabs options={options} />
      </Suspense>

      <Panel bodyClassName="">
        {subscriptions.length === 0 ? (
          <EmptyState title="No subscriptions here" detail="Try another status." />
        ) : (
          <Table>
            <thead>
              {/* Start date and mandate reference live on the customer page —
                  this list is about what's charging next and what needs doing. */}
              <tr>
                <Th>Customer</Th>
                <Th>Next charge</Th>
                <Th>Cycles</Th>
                <Th>Status</Th>
                <Th align="right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub) => {
                const customer = getCustomer(sub.customerId);
                return (
                  <tr key={sub.id} className="transition-colors hover:bg-paper-50">
                    <Td className="max-w-[260px]">
                      <span className="flex items-center gap-3">
                        <Avatar initials={initials(customer?.name ?? '')} />
                        <span className="min-w-0">
                          <Link
                            href={`/admin/customers/${customer?.id}`}
                            className="type-b2 block cursor-pointer truncate font-bold text-ink hover:underline"
                          >
                            {customer?.name}
                          </Link>
                          <span className="type-b2 block truncate text-fg-subtle">
                            <Money>{money(sub.price)}</Money> · every {sub.intervalWeeks} weeks
                          </span>
                        </span>
                      </span>
                    </Td>
                    <Td>
                      {sub.nextChargeAt ? (
                        <span className="block whitespace-nowrap">
                          <span className="type-b2 block text-ink">
                            {fullDate(sub.nextChargeAt)}
                          </span>
                          <span className="type-b2 block text-fg-subtle">
                            {relativeDays(sub.nextChargeAt, TODAY)}
                          </span>
                        </span>
                      ) : (
                        <span className="type-b2 text-fg-subtle">
                          {sub.status === 'paused' ? 'Paused' : 'Ended'}
                        </span>
                      )}
                    </Td>
                    <Td>
                      <span className="type-b2 whitespace-nowrap text-fg-muted">
                        {sub.cyclesCompleted} done
                        {sub.skips > 0 && ` · ${sub.skips} skipped`}
                      </span>
                    </Td>
                    <Td>
                      <SubscriptionStatusPill status={sub.status} />
                    </Td>
                    <Td align="right">
                      <SubscriptionActions subscriptionId={sub.id} status={sub.status} />
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Panel>

      <p className="type-b2 max-w-2xl text-fg-subtle">
        Cancelling here revokes the customer’s Razorpay mandate. Customers can also
        skip or cancel themselves from their account — this table is the same
        state, not a separate one.
      </p>
    </div>
  );
}
