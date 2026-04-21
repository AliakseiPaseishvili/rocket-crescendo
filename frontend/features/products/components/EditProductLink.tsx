'use client';

import { Pencil } from 'lucide-react';
import { FC } from 'react';

import { Button } from '@/frontend/components/ui/button';
import { Link } from '@/frontend/features/translation/i18n/navigation';

interface EditProductLinkProps {
  productId: number;
  disabled?: boolean;
}

export const EditProductLink: FC<EditProductLinkProps> = ({ productId, disabled }) => {
  return (
    <Button variant="ghost" size="icon" className="size-7" disabled={disabled} asChild>
      <Link href={`/admin/products/${productId}/edit`}>
        <Pencil className="text-muted-foreground" size={16} />
      </Link>
    </Button>
  );
};
