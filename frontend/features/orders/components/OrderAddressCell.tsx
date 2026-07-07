'use client';

import type { OrderAddressModel } from '@/backend/features/order';

type OrderAddressCellProps = {
  address: OrderAddressModel | null;
};

export const OrderAddressCell = ({ address }: OrderAddressCellProps) => {
  if (!address) return <span className="text-muted-foreground">—</span>;

  const lines = [
    [address.flatNumber, address.addressLine1].filter(Boolean).join(', '),
    address.addressLine2,
    address.city,
    address.postcode,
    address.region,
    address.country,
    address.additionalInfo,
  ].filter((line): line is string => Boolean(line && line.trim()));

  return (
    <div className="space-y-0.5 text-sm text-muted-foreground">
      {lines.map((line, index) => (
        <div key={index}>{line}</div>
      ))}
    </div>
  );
};
