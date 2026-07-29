import Link from 'next/link';

import RevenueChart from '@/components/admin/RevenueChart';
import StatTile from '@/components/admin/StatTile';
import {
  Avatar,
  EmptyState,
  Money,
  OrderStatusPill,
  PageHeader,
  Panel,
  Table,
  Td,
  Th,
} from '@/components/admin/ui';
import {
  DAILY_REVENUE,
  SUBSCRIPTIONS,
  TODAY,
  getCustomer,
  getOverview,
  listOrders,
} from '@/lib/admin/data';
import {
  fullDate,
  initials,
  money,
  moneyCompact,
  relativeDays,
  timeOnly,
} from '@/lib/admin/format';

// Absolute because this page shares a segment with the panel layout, so the
// layout's "%s — 10X Admin" template doesn't apply to it — only to its children.
export const metadata = { title: { absolute: 'Overview — 10X Admin' } };

export default function AdminOverviewPage() {
  const overview = getOverview();
  const recent = listOrders().slice(0, 6);

  const upcoming = SUBSCRIPTIONS.filter((s) => s.status === 'active' && s.nextChargeAt)
    .sort((a, b) => a.nextChargeAt!.localeCompare(b.nextChargeAt!))
    .slice(0, 4);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Overview"
        subtitle="Everything that moved in the last seven days."
      />

      {/* The four numbers worth knowing before anything else. */}
      <div className="grid gap-px bg-paper-200 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Revenue · 7 days"
          value={moneyCompact(overview.revenue)}
          delta={overview.revenueDelta}
          footnote="vs previous 7"
        />
        <StatTile
          label="Orders · 7 days"
          value={String(overview.orderCount)}
          delta={overview.orderDelta}
          footnote="vs previous 7"
        />
        <StatTile
          label="Awaiting dispatch"
          value={String(overview.awaitingDispatch)}
          footnote="needs packing"
          href="/admin/orders?status=pending"
        />
        <StatTile
          label="Active subscriptions"
          value={String(overview.activeSubscriptions)}
          footnote={
            <>
              <Money>{money(overview.recurringPerCycle)}</Money> per cycle
            </>
          }
          href="/admin/subscriptions"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Net revenue" className="lg:col-span-2">
          <RevenueChart data={DAILY_REVENUE} />
        </Panel>

        <Panel title="Next charges">
          {upcoming.length === 0 ? (
            <EmptyState title="Nothing scheduled" />
          ) : (
            <ul className="divide-y divide-paper-100">
              {upcoming.map((sub) => {
                const customer = getCustomer(sub.customerId);
                return (
                  <li key={sub.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="type-b2 truncate font-bold text-ink">{customer?.name}</p>
                      <p className="type-b2 text-fg-subtle">
                        {relativeDays(sub.nextChargeAt!, TODAY)}
                      </p>
                    </div>
                    <span className="shrink-0 font-quantico text-sm font-bold text-ink">
                      {money(sub.price)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
          <Link
            href="/admin/subscriptions"
            className="mt-5 inline-flex cursor-pointer items-center gap-1.5 font-quantico text-[10px] font-bold uppercase tracking-[0.14em] text-ink transition-opacity hover:opacity-60"
          >
            All subscriptions
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </Panel>
      </div>

      <Panel
        title="Latest orders"
        bodyClassName=""
        action={
          <Link
            href="/admin/orders"
            className="cursor-pointer font-quantico text-[10px] font-bold uppercase tracking-[0.14em] text-ink transition-opacity hover:opacity-60"
          >
            View all
          </Link>
        }
      >
        <Table>
          <thead>
            <tr>
              <Th>Order</Th>
              <Th>Customer</Th>
              <Th>Placed</Th>
              <Th>Status</Th>
              <Th align="right">Total</Th>
            </tr>
          </thead>
          <tbody>
            {recent.map((order) => {
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
      </Panel>
    </div>
  );
}
