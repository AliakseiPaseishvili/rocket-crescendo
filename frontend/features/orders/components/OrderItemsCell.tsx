'use client';

import type { AdminOrderItem } from '@/backend/features/order';

type OrderItemsCellProps = {
  items: AdminOrderItem[];
};

export const OrderItemsCell = ({ items }: OrderItemsCellProps) => (
  <ul className="space-y-1 text-sm">
    {items.map((item) => (
      <li key={item.productId}>
        {item.name} × {item.quantity}
      </li>
    ))}
  </ul>
);
