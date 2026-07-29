import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Field, Panel, StatusPill } from '@/components/admin/ui';
import { dateTime } from '@/lib/admin/format';
import { getQuery } from '@/lib/queries/store';
import { topicLabel } from '@/lib/queries/types';

import QueryReply from '../QueryReply';
import { QUERY_SIGNALS } from '../page';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const query = getQuery(id);
  return { title: query ? query.reference : 'Query' };
}

export default async function QueryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const query = getQuery(id);
  if (!query) notFound();

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/queries"
          className="inline-flex cursor-pointer items-center gap-1.5 font-quantico text-[10px] font-bold uppercase tracking-[0.14em] text-fg-muted transition-colors hover:text-ink"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          All queries
        </Link>

        <div className="mt-4 flex flex-col gap-4 border-b border-paper-200 pb-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-quantico text-2xl font-bold uppercase tracking-[0.01em] text-ink md:text-[28px]">
                {query.reference}
              </h1>
              <StatusPill {...QUERY_SIGNALS[query.status]} />
            </div>
            <p className="type-b2 mt-2 text-fg-muted">
              {topicLabel(query.topic)} · received {dateTime(query.submittedAt)}
            </p>
          </div>

          <a
            href={`mailto:${query.email}?subject=Re: your 10X query ${query.reference}`}
            className="inline-flex shrink-0 cursor-pointer items-center gap-2 border border-paper-300 bg-white px-4 py-2.5 font-quantico text-[10px] font-bold uppercase tracking-[0.12em] text-ink transition-colors hover:border-ink"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
            Email {query.name.split(' ')[0]}
          </a>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <Panel title="The question">
            <p className="type-b1 whitespace-pre-wrap text-ink">{query.message}</p>
          </Panel>

          {query.reply && (
            <Panel title="Answer on record">
              <p className="type-b1 whitespace-pre-wrap text-ink">{query.reply}</p>
              <p className="type-b2 mt-4 border-t border-paper-100 pt-4 text-fg-subtle">
                {query.answeredBy}
                {query.answeredAt && <> · {dateTime(query.answeredAt)}</>}
              </p>
            </Panel>
          )}

          <Panel title={query.reply ? 'Revise the answer' : 'Answer'}>
            <QueryReply id={query.id} status={query.status} existingReply={query.reply} />
          </Panel>
        </div>

        <Panel title="Who asked">
          <dl className="space-y-4">
            <Field label="Name">{query.name}</Field>
            <Field label="Email">
              <a
                href={`mailto:${query.email}`}
                className="cursor-pointer break-all text-ink underline decoration-paper-300 underline-offset-2 hover:decoration-ink"
              >
                {query.email}
              </a>
            </Field>
            {query.phone && <Field label="Phone">{query.phone}</Field>}
            {query.orderReference && (
              <Field label="Order">
                <Link
                  href={`/admin/orders/ord_${query.orderReference.replace('10X-', '')}`}
                  className="cursor-pointer text-ink underline decoration-paper-300 underline-offset-2 hover:decoration-ink"
                >
                  {query.orderReference}
                </Link>
              </Field>
            )}
            <Field label="Topic">{topicLabel(query.topic)}</Field>
            <Field label="Received">{dateTime(query.submittedAt)}</Field>
          </dl>
        </Panel>
      </div>
    </div>
  );
}
