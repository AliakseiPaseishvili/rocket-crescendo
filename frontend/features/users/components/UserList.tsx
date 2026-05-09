'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/frontend/components/ui/button';

import { USERS_PAGE_LIMIT } from '../constants';
import { useUsersQuery } from '../hooks';
import { UserRow } from './UserRow';

export const UserList = () => {
  const t = useTranslations('user');
  const [offset, setOffset] = useState(0);
  const { data, isPending, isError } = useUsersQuery(offset);

  if (isPending) return <p className="text-muted-foreground">{t('loadingUsers')}</p>;
  if (isError) return <p className="text-destructive">{t('errorLoadingUsers')}</p>;
  if (!data?.users.length) return <p className="text-muted-foreground">{t('noUsers')}</p>;

  const total = data.total ?? data.users.length;
  const hasPrev = offset > 0;
  const hasNext = offset + USERS_PAGE_LIMIT < total;

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="py-3 pr-4 text-left font-medium">{t('user')}</th>
              <th className="py-3 pr-4 text-left font-medium">{t('role')}</th>
              <th className="py-3 pr-4 text-left font-medium">{t('status')}</th>
              <th className="py-3 text-right font-medium">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {data.users.map((user) => (
              <UserRow
                key={user.id}
                id={user.id}
                username={(user as unknown as Record<string, unknown>).username as string | undefined}
                email={user.email}
                role={user.role ?? 'user'}
                banned={user.banned}
              />
            ))}
          </tbody>
        </table>
      </div>
      {(hasPrev || hasNext) && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            disabled={!hasPrev}
            onClick={() => setOffset(Math.max(0, offset - USERS_PAGE_LIMIT))}
          >
            {t('previous')}
          </Button>
          <span className="text-sm text-muted-foreground">
            {offset + 1}–{Math.min(offset + USERS_PAGE_LIMIT, total)} / {total}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={!hasNext}
            onClick={() => setOffset(offset + USERS_PAGE_LIMIT)}
          >
            {t('next')}
          </Button>
        </div>
      )}
    </div>
  );
};
