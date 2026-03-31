'use client';

import { Pencil } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FC, useCallback, useState } from 'react';

import type { ProductWithTranslations } from '@/backend/features/product';
import { Button } from '@/frontend/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/frontend/components/ui/dialog';

import { ProductFormFields } from './ProductFormFields';
import { useEditProductForm } from '../hooks/use-edit-product-form';

interface EditProductModalProps {
  product: ProductWithTranslations;
  disabled?: boolean;
}

export const EditProductModal: FC<EditProductModalProps> = ({ product, disabled }) => {
  const tProduct = useTranslations('product');
  const tCommon = useTranslations('common');
  const [open, setOpen] = useState(false);

  const handleSuccess = useCallback(() => setOpen(false), []);

  const { register, control, fields, errors, onSubmit, isPending, isSuccess, error } =
    useEditProductForm(product, handleSuccess);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="size-7" disabled={disabled}>
          <Pencil className="text-muted-foreground" size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{tProduct('editProduct')}</DialogTitle>
        </DialogHeader>
        <ProductFormFields
          register={register}
          control={control}
          fields={fields}
          errors={errors}
          onSubmit={onSubmit}
          isPending={isPending}
          isSuccess={isSuccess}
          error={error}
          submitLabel={tProduct('editProduct')}
          pendingLabel={tCommon('saving')}
          successMessage={tProduct('editSuccess')}
        />
      </DialogContent>
    </Dialog>
  );
};
