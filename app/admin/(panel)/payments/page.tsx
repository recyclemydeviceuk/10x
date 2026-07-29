import Link from 'next/link';
import { Suspense } from 'react';

import { FilterTabs, SearchField } from '@/components/admin/Filters';
import StatTile from '@/components/admin/StatTile';
import {
  Avatar,
  EmptyState,
  Money,
  Mono,
  PageHeader,
  Panel,
  PaymentStatusPill,
  Table,
  Td,
  Th,
} from '@/components/admin/ui';
import { TRANSACTIONS, getCustomer, listTransactions } from '@/lib/admin/data';
import type { PaymentStatus } from '@/lib/admin/types';
import { fullDate, initials, methodLabel, money, timeOnly } from '@/lib/admin/format';

export const metadata = { title: 'Payments' };

const STATUSES: { value: PaymentStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' },
];

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status = 'all', q } = await searchParams;
  const transactions = listTransactions({ status: status as PaymentStatus | 'all', query: q });

  const captured = TRANSACTIONS.filter((t) => t.status === 'paid');
  const refunded = TRANSACTIONS.filter((t) => t.status === 'refunded');
  const failed = TRANSACTIONS.filter((t) => t.status === 'failed');
  const settled = captured.reduce((sum, t) => sum + t.amount, 0);
  const refundedTotal = refunded.reduce((sum, t) => sum + (t.refundedAmount ?? 0), 0);

  const options = STATUSES.map((s) => ({
    ...s,
    count:
      s.value === 'all'
        ? TRANSACTIONS.length
        : TRANSACTIONS.filter((t) => t.status === s.value).length,
  }));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Payments"
        subtitle="Every Razorpay transaction, with a receipt you can hand to a customer."
      />

      <div className="grid gap-px bg-paper-200 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Captured" value={money(settled)} footnote={`${captured.length} payments`} />
        <StatTile label="Refunded" value={money(refundedTotal)} footnote={`${refunded.length} refunds`} />
        <StatTile label="Failed" value={String(failed.length)} footnote="worth chasing" />
        <StatTile
          label="Net"
          value={money(settled - refundedTotal)}
          footnote="after refunds"
        />
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Suspense fallback={null}>
          <FilterTabs options={options} />
        </Suspense>
        <Suspense fallback={null}>
          <SearchField placeholder="Payment ID, order or customer" />
        </Suspense>
      </div>

      <Panel bodyClassName="">
        {transactions.length === 0 ? (
          <EmptyState title="No transactions match" detail="Try a different status or search." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Payment</Th>
                <Th>Customer</Th>
                <Th>Order</Th>
                <Th>Date</Th>
                <Th>Status</Th>
                <Th align="right">Amount</Th>
                <Th align="right">PDF</Th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => {
                const customer = getCustomer(txn.customerId);
                return (
                  <tr key={txn.id} className="transition-colors hover:bg-paper-50">
                    <Td>
                      <Mono>{txn.gatewayReference}</Mono>
                      {/* Method rides along here rather than owning a column —
                          it's metadata about the payment, not a sort key. */}
                      <span className="mt-1 block whitespace-nowrap font-nebula text-[9px] font-bold uppercase tracking-[0.14em] text-fg-subtle">
                        {methodLabel(txn.method)}
                        {txn.type === 'subscription' && (
                          <span className="text-[#4EA310]"> · Recurring</span>
                        )}
                      </span>
                    </Td>
                    <Td className="max-w-[240px]">
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
                            {customer?.email}
                          </span>
                        </span>
                      </span>
                    </Td>
                    <Td>
                      <Link
                        href={`/admin/orders/${txn.orderId}`}
                        className="cursor-pointer whitespace-nowrap font-quantico text-[13px] font-bold text-ink hover:underline"
                      >
                        {txn.orderReference}
                      </Link>
                    </Td>
                    <Td>
                      <span className="block whitespace-nowrap">
                        <span className="type-b2 block text-ink">{fullDate(txn.at)}</span>
                        <span className="type-b2 block text-fg-subtle">{timeOnly(txn.at)}</span>
                      </span>
                    </Td>
                    <Td>
                      <PaymentStatusPill status={txn.status} />
                    </Td>
                    <Td align="right">
                      <span className="font-quantico text-[13px] font-bold text-ink">
                        {money(txn.amount)}
                      </span>
                      {txn.refundedAmount && (
                        <span className="type-b2 block text-fg-subtle">
                          −<Money>{money(txn.refundedAmount)}</Money>
                        </span>
                      )}
                    </Td>
                    <Td align="right">
                      {txn.status === 'failed' ? (
                        <span className="type-b2 text-fg-subtle">—</span>
                      ) : (
                        <a
                          href={`/admin/transactions/${txn.id}/receipt`}
                          className="inline-flex cursor-pointer items-center gap-1.5 font-quantico text-[10px] font-bold uppercase tracking-[0.12em] text-ink transition-opacity hover:opacity-60"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <path d="M12 3v12M7 11l5 5 5-5M5 21h14" />
                          </svg>
                          PDF
                        </a>
                      )}
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Panel>

      <p className="type-b2 text-fg-subtle">
        Showing {transactions.length} of {TRANSACTIONS.length} transactions.
      </p>
    </div>
  );
}
