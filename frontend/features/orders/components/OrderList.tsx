'use client';

import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { OrderStatus } from '@/backend/app/generated/prisma/enums';
import type { AdminOrder } from '@/backend/features/order';
import { DataTable } from '@/frontend/components/ui/data-table';
import { Tabs, TabsList, TabsTrigger } from '@/frontend/components/ui/tabs';
import { useInfiniteScroll } from '@/frontend/features/react-query';

import { useOrdersQuery } from '../hooks';
import { OrderAddressCell } from './OrderAddressCell';
import { OrderItemsCell } from './OrderItemsCell';
import { OrderStatusCell } from './OrderStatusCell';

const ALL_FILTER = 'all';

export const OrderList = () => {
  const t = useTranslations('order');
  const [status, setStatus] = useState<OrderStatus | undefined>(undefined);
  const { items, fetchNextPage, queryProps } = useOrdersQuery(status);
  const { isPending, isError } = queryProps;
  const sentinelRef = useInfiniteScroll(fetchNextPage);

  const columns: ColumnDef<AdminOrder>[] = [
    {
      id: 'orderNumber',
      header: () => t('orderNumber'),
      cell: ({ row }) => (
        <span className="font-medium">#{row.original.orderNumber}</span>
      ),
    },
    {
      id: 'status',
      header: () => t('status'),
      cell: ({ row }) => (
        <OrderStatusCell id={row.original.id} status={row.original.status} />
      ),
    },
    {
      id: 'items',
      header: () => t('items'),
      cell: ({ row }) => <OrderItemsCell items={row.original.items} />,
    },
    {
      id: 'address',
      header: () => t('address'),
      cell: ({ row }) => <OrderAddressCell address={row.original.address} />,
    },
    {
      id: 'email',
      header: () => t('email'),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.email}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Tabs
        value={status ?? ALL_FILTER}
        onValueChange={(value) =>
          setStatus(value === ALL_FILTER ? undefined : (value as OrderStatus))
        }
      >
        <TabsList>
          <TabsTrigger value={ALL_FILTER}>{t('filterAll')}</TabsTrigger>
          <TabsTrigger value={OrderStatus.PAID}>{t('filterPaid')}</TabsTrigger>
          <TabsTrigger value={OrderStatus.PREPARED}>
            {t('filterPrepared')}
          </TabsTrigger>
          <TabsTrigger value={OrderStatus.SENT}>{t('filterSent')}</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="max-h-[70vh] overflow-y-auto">
        <DataTable
          columns={columns}
          data={items ?? []}
          isLoading={isPending}
          isError={isError}
          loadingFallback={
            <p className="text-muted-foreground">{t('loadingOrders')}</p>
          }
          errorFallback={
            <p className="text-destructive">{t('errorLoadingOrders')}</p>
          }
          emptyFallback={<p className="text-muted-foreground">{t('noOrders')}</p>}
        />
        <div ref={sentinelRef} />
      </div>
    </div>
  );
};
