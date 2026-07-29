import { money, shortDate } from '@/lib/admin/format';

/**
 * Daily net revenue, last 14 days.
 *
 * One series, so there's no legend — the panel title names it. Bars are ink;
 * only the most recent day takes the pressed green (#4EA310), which clears 3:1
 * against this surface where the brand's #6DE325 does not (it measures 1.62:1
 * and would be near-invisible as a fill on white).
 *
 * Identity never rests on colour alone: today's bar is also the last one and
 * carries a direct label, and the full series is available as a table to screen
 * readers.
 */
export default function RevenueChart({
  data,
}: {
  data: { date: string; revenue: number; orders: number }[];
}) {
  const peak = Math.max(...data.map((d) => d.revenue));
  const latestIndex = data.length - 1;

  return (
    <figure className="m-0">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-nebula text-[10px] font-bold uppercase tracking-[0.16em] text-fg-subtle">
            Peak day
          </p>
          <p className="font-quantico text-sm font-bold text-ink">{money(peak)}</p>
        </div>
        <p className="type-b2 text-fg-subtle">Last 14 days</p>
      </div>

      {/* Plot. Bars sit on a hairline baseline; no gridlines — at this size they
          would out-weigh the data. */}
      <div className="mt-5 flex h-44 items-end gap-0.5 border-b border-paper-200">
        {data.map((day, i) => {
          const isLatest = i === latestIndex;
          // Floor the height so a quiet day is still a visible mark.
          const height = Math.max(6, Math.round((day.revenue / peak) * 100));
          return (
            <div key={day.date} className="group relative flex h-full flex-1 items-end">
              <div
                className={`w-full rounded-t-[4px] transition-colors ${
                  isLatest ? 'bg-[#4EA310]' : 'bg-ink group-hover:bg-ink-600'
                }`}
                style={{ height: `${height}%` }}
              />
              {/* Hover layer — an HTML chart should never be a static picture. */}
              <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap border border-paper-200 bg-white px-3 py-2 shadow-elevated group-hover:block">
                <p className="font-nebula text-[10px] font-bold uppercase tracking-[0.14em] text-fg-subtle">
                  {shortDate(day.date)}
                </p>
                <p className="font-quantico text-sm font-bold text-ink">{money(day.revenue)}</p>
                <p className="type-b2 text-fg-muted">
                  {day.orders} {day.orders === 1 ? 'order' : 'orders'}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Only the ends are labelled — a number under every bar is noise. */}
      <div className="mt-2.5 flex justify-between">
        <span className="type-b2 text-fg-subtle">{shortDate(data[0].date)}</span>
        <span className="font-quantico text-[11px] font-bold uppercase tracking-[0.1em] text-[#4EA310]">
          Today · {money(data[latestIndex].revenue)}
        </span>
      </div>

      <figcaption className="sr-only">
        Net revenue per day for the last 14 days.
        <table>
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Revenue</th>
              <th scope="col">Orders</th>
            </tr>
          </thead>
          <tbody>
            {data.map((day) => (
              <tr key={day.date}>
                <th scope="row">{shortDate(day.date)}</th>
                <td>{money(day.revenue)}</td>
                <td>{day.orders}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figcaption>
    </figure>
  );
}
