'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/frontend/components/ui/button';

import { useMyOrders } from '../hooks';
import { MyOrderCard } from './MyOrderCard';

export const MyOrders = () => {
  const t = useTranslations('myOrders');
  const { items, fetchNextPage, queryProps } = useMyOrders();
  const { isLoading, isError, hasNextPage, isFetchingNextPage } = queryProps;

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
      <h1 className="text-2xl font-semibold">{t('title')}</h1>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">{t('loading')}</p>
      ) : isError ? (
        <p className="text-sm text-destructive">{t('error')}</p>
      ) : !items?.length ? (
        <p className="text-sm text-muted-foreground">{t('empty')}</p>
      ) : (
        <>
          <ul className="flex flex-col gap-4">
            {items.map((order) => (
              <li key={order.id}>
                <MyOrderCard order={order} />
              </li>
            ))}
          </ul>
          {hasNextPage && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={fetchNextPage}
                disabled={isFetchingNextPage}
              >
                {t('loadMore')}
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
};
