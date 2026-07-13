'use client';

import { useLocale, useTranslations } from 'next-intl';
import { FC } from 'react';

import type { UserOrder } from '@/backend/features/order';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/frontend/components/ui/card';

import { formatMoney } from '../utils';
import { MyOrderItemThumb } from './MyOrderItemThumb';

interface MyOrderCardProps {
  order: UserOrder;
}

export const MyOrderCard: FC<MyOrderCardProps> = ({ order }) => {
  const t = useTranslations('myOrders');
  const locale = useLocale();

  const orderDate = new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
  }).format(new Date(order.createdAt));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {t('orderNumber', { number: order.orderNumber })}
        </CardTitle>
        <span className="text-sm text-muted-foreground">{orderDate}</span>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3">
          {order.items.map((item) => (
            <MyOrderItemThumb key={item.productId} item={item} />
          ))}
        </div>
        <div className="flex items-center justify-between border-t pt-3 text-sm">
          <span className="text-muted-foreground">
            {t('itemCount', { count: order.itemCount })}
          </span>
          <span className="font-semibold">
            {t('total')}: {formatMoney(order.amountTotal, order.currency, locale)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
