'use client';

import { useTranslations } from 'next-intl';

import { OrderStatus } from '@/backend/app/generated/prisma/enums';
import { Badge } from '@/frontend/components/ui/badge';
import { Button } from '@/frontend/components/ui/button';

import { useUpdateOrderStatus } from '../hooks';

type OrderStatusCellProps = {
  id: string;
  status: OrderStatus;
};

/** The single allowed forward transition for each status. */
const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  [OrderStatus.PAID]: OrderStatus.PREPARED,
  [OrderStatus.PREPARED]: OrderStatus.SENT,
};

const BADGE_VARIANT: Record<OrderStatus, 'default' | 'secondary' | 'outline'> = {
  [OrderStatus.PENDING]: 'outline',
  [OrderStatus.FAILED]: 'outline',
  [OrderStatus.PAID]: 'outline',
  [OrderStatus.PREPARED]: 'secondary',
  [OrderStatus.SENT]: 'default',
};

export const OrderStatusCell = ({ id, status }: OrderStatusCellProps) => {
  const t = useTranslations('order');
  const { mutate, isPending } = useUpdateOrderStatus();
  const next = NEXT_STATUS[status];

  const statusLabels: Partial<Record<OrderStatus, string>> = {
    [OrderStatus.PAID]: t('statusPaid'),
    [OrderStatus.PREPARED]: t('statusPrepared'),
    [OrderStatus.SENT]: t('statusSent'),
  };

  return (
    <div className="flex items-center gap-2">
      <Badge variant={BADGE_VARIANT[status]}>
        {statusLabels[status] ?? status}
      </Badge>
      {next && (
        <Button
          size="sm"
          variant="outline"
          disabled={isPending}
          onClick={() => mutate({ params: { id }, body: { status: next } })}
        >
          {next === OrderStatus.PREPARED ? t('markPrepared') : t('markSent')}
        </Button>
      )}
    </div>
  );
};
