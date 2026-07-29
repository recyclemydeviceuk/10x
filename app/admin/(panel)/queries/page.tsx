import Link from 'next/link';
import { Suspense } from 'react';

import { FilterTabs, SearchField } from '@/components/admin/Filters';
import {
  Avatar,
  EmptyState,
  PageHeader,
  Panel,
  StatusPill,
  Table,
  Td,
  Th,
} from '@/components/admin/ui';
import { fullDate, initials, timeOnly } from '@/lib/admin/format';
import { countByStatus, listQueries } from '@/lib/queries/store';
import { topicLabel, type QueryStatus } from '@/lib/queries/types';

export const metadata = { title: 'Queries' };

const STATUSES: { value: QueryStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'open', label: 'In progress' },
  { value: 'answered', label: 'Answered' },
  { value: 'closed', label: 'Closed' },
];

export const QUERY_SIGNALS: Record<QueryStatus, { signal: 'attention' | 'progress' | 'good' | 'neutral'; label: string }> = {
  new: { signal: 'attention', label: 'New' },
  open: { signal: 'progress', label: 'In progress' },
  answered: { signal: 'good', label: 'Answered' },
  closed: { signal: 'neutral', label: 'Closed' },
};

export default async function QueriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status = 'all', q } = await searchParams;
  const queries = listQueries({ status: status as QueryStatus | 'all', query: q });

  const options = STATUSES.map((s) => ({ ...s, count: countByStatus(s.value) }));
  const waiting = countByStatus('new');

  return (
    <div className="space-y-8">
      <PageHeader
        title="Queries"
        subtitle={
          waiting > 0
            ? `${waiting} ${waiting === 1 ? 'question is' : 'questions are'} waiting on a reply.`
            : 'Everything that came in through the form on the site.'
        }
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Suspense fallback={null}>
          <FilterTabs options={options} />
        </Suspense>
        <Suspense fallback={null}>
          <SearchField placeholder="Reference, name or words in the message" />
        </Suspense>
      </div>

      <Panel bodyClassName="">
        {queries.length === 0 ? (
          <EmptyState
            title="Nothing here"
            detail="No queries match this filter yet."
          />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Ref</Th>
                <Th>From</Th>
                <Th>Topic</Th>
                <Th>Question</Th>
                <Th>Received</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {queries.map((query) => (
                <tr key={query.id} className="transition-colors hover:bg-paper-50">
                  <Td>
                    <Link
                      href={`/admin/queries/${query.id}`}
                      className="cursor-pointer whitespace-nowrap font-quantico text-[13px] font-bold text-ink hover:underline"
                    >
                      {query.reference}
                    </Link>
                  </Td>
                  <Td className="max-w-[220px]">
                    <span className="flex items-center gap-3">
                      <Avatar initials={initials(query.name)} />
                      <span className="min-w-0">
                        <span className="type-b2 block truncate font-bold text-ink">
                          {query.name}
                        </span>
                        <span className="type-b2 block truncate text-fg-subtle">
                          {query.email}
                        </span>
                      </span>
                    </span>
                  </Td>
                  <Td>
                    <span className="type-b2 whitespace-nowrap text-fg-muted">
                      {topicLabel(query.topic)}
                    </span>
                  </Td>
                  <Td className="max-w-[230px]">
                    <Link
                      href={`/admin/queries/${query.id}`}
                      className="type-b2 block cursor-pointer truncate text-fg-muted hover:text-ink"
                    >
                      {query.message}
                    </Link>
                  </Td>
                  <Td>
                    <span className="block whitespace-nowrap">
                      <span className="type-b2 block text-ink">
                        {fullDate(query.submittedAt)}
                      </span>
                      <span className="type-b2 block text-fg-subtle">
                        {timeOnly(query.submittedAt)}
                      </span>
                    </span>
                  </Td>
                  <Td>
                    <StatusPill {...QUERY_SIGNALS[query.status]} />
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Panel>
    </div>
  );
}
