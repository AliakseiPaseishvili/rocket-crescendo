'use client';

import { ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { FC } from 'react';

import type { UserOrderItem } from '@/backend/features/order';

interface MyOrderItemThumbProps {
  item: UserOrderItem;
}

export const MyOrderItemThumb: FC<MyOrderItemThumbProps> = ({ item }) => (
  <div className="flex w-20 flex-col gap-1">
    <div className="relative h-20 w-20 overflow-hidden rounded-md bg-muted">
      {item.imageUrl ? (
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          className="object-cover"
          sizes="80px"
        />
      ) : (
        <div className="flex h-full items-center justify-center">
          <ImageIcon className="text-muted-foreground" size={24} />
        </div>
      )}
      <span className="absolute right-0 top-0 rounded-bl-md bg-foreground/80 px-1.5 py-0.5 text-xs font-medium text-background">
        ×{item.quantity}
      </span>
    </div>
    <span className="truncate text-xs text-muted-foreground" title={item.name}>
      {item.name}
    </span>
  </div>
);
