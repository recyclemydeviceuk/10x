import Link from 'next/link';

import {
  AreaLine,
  BarList,
  ChartFrame,
  ColumnChart,
  Funnel,
  Ring,
  ShareBar,
} from '@/components/admin/charts';
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
  NEW_CUSTOMERS_BY_WEEK,
  SUBSCRIPTIONS,
  TODAY,
  averageOrderValueSeries,
  cumulativeRevenueSeries,
  deliverySuccessRate,
  fulfilmentFunnel,
  getCustomer,
  getOverview,
  listOrders,
  ordersByCity,
  ordersByWeekday,
  revenueByMethod,
  revenueByPurchaseType,
} from '@/lib/admin/data';
import {
  fullDate,
  initials,
  methodLabel,
  money,
  moneyCompact,
  relativeDays,
  timeOnly,
} from '@/lib/admin/format';
import { countByStatus } from '@/lib/queries/store';

// Absolute because this page shares a segment with the panel layout, so the
// layout's "%s — 10X Admin" template doesn't apply to it — only to its children.
export const metadata = { title: { absolute: 'Overview — 10X Admin' } };

export default function AdminOverviewPage() {
  const overview = getOverview();
  const recent = listOrders().slice(0, 5);

  const upcoming = SUBSCRIPTIONS.filter((s) => s.status === 'active' && s.nextChargeAt)
    .sort((a, b) => a.nextChargeAt!.localeCompare(b.nextChargeAt!))
    .slice(0, 4);

  const cities = ordersByCity().slice(0, 5);
  const methods = revenueByMethod().map((m) => ({ ...m, label: methodLabel(m.label) }));
  const funnel = fulfilmentFunnel();
  const split = revenueByPurchaseType();
  const weekdays = ordersByWeekday();
  const aov = averageOrderValueSeries();
  const cumulative = cumulativeRevenueSeries();
  const successRate = deliverySuccessRate();
  const openQueries = countByStatus('new');

  const latestAov = aov[aov.length - 1].value;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Overview"
        subtitle="Everything that moved in the last seven days."
      />

      {/* Headline numbers */}
      <div className="grid gap-px bg-paper-200 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Revenue · 7 days"
          value={moneyCompact(overview.revenue)}
          delta={overview.revenueDelta}
          footnote="vs previous 7"
          spark={DAILY_REVENUE.slice(-7).map((d) => d.revenue)}
        />
        <StatTile
          label="Orders · 7 days"
          value={String(overview.orderCount)}
          delta={overview.orderDelta}
          footnote="vs previous 7"
          spark={DAILY_REVENUE.slice(-7).map((d) => d.orders)}
        />
        <StatTile
          label="Average order"
          value={money(latestAov)}
          footnote="today"
          spark={aov.map((d) => d.value)}
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

      {/* Things that need a person */}
      <div className="grid gap-px bg-paper-200 sm:grid-cols-3">
        <StatTile
          label="Awaiting dispatch"
          value={String(overview.awaitingDispatch)}
          footnote="needs packing"
          href="/admin/orders?status=pending"
        />
        <StatTile
          label="Not pushed to Shiprocket"
          value={String(overview.notPushed)}
          footnote="won’t reach the courier"
          href="/admin/orders"
        />
        <StatTile
          label="Unanswered queries"
          value={String(openQueries)}
          footnote="waiting on a reply"
          href="/admin/queries?status=new"
        />
      </div>

      {/* Revenue — the daily bars plus the running total */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <RevenueChart data={DAILY_REVENUE} />
        </Panel>

        <Panel>
          <ChartFrame title="Cumulative revenue" hint="Fortnight to date">
            <AreaLine data={cumulative} format={(v) => moneyCompact(v)} />
          </ChartFrame>
        </Panel>
      </div>

      {/* The three questions a store owner asks next */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel>
          <ChartFrame title="Fulfilment funnel" hint="Live orders">
            <Funnel data={funnel} />
          </ChartFrame>
        </Panel>

        <Panel>
          <ChartFrame title="Where it sells" hint="Top 5 cities">
            <BarList data={cities} format={(v) => `${v}`} />
          </ChartFrame>
        </Panel>

        <Panel>
          <ChartFrame title="How they pay" hint="Captured">
            <BarList data={methods} format={(v) => moneyCompact(v)} />
          </ChartFrame>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel>
          <ChartFrame title="One-time vs subscription" hint="By revenue">
            <ShareBar data={split} format={(v) => moneyCompact(v)} />
          </ChartFrame>
        </Panel>

        <Panel>
          <ChartFrame title="Orders by weekday" hint="All time">
            <ColumnChart data={weekdays} format={(v) => `${v} orders`} />
          </ChartFrame>
        </Panel>

        <Panel>
          <ChartFrame
            title="Delivered first time"
            hint="Of shipped"
            footer={
              <p className="type-b2 text-center text-fg-subtle">
                The rest came back as RTO. Worth watching — every return is paid
                for twice.
              </p>
            }
          >
            <div className="flex h-full items-center justify-center">
              <Ring percent={successRate} label="Delivered first time" />
            </div>
          </ChartFrame>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <ChartFrame title="New customers" hint="Per week, last six">
            <ColumnChart data={NEW_CUSTOMERS_BY_WEEK} format={(v) => `${v} new`} />
          </ChartFrame>
        </Panel>

        <Panel title="Next charges">
          {upcoming.length === 0 ? (
            <EmptyState title="Nothing scheduled" />
          ) : (
            <ul className="divide-y divide-paper-100">
              {upcoming.map((sub) => {
                const customer = getCustomer(sub.customerId);
                return (
                  <li
                    key={sub.id}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
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
                  <Td className="max-w-[240px]">
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
