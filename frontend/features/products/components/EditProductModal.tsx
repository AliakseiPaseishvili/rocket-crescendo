'use client';

import { Pencil } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FC, useCallback, useState } from 'react';

import type { ProductWithTranslations } from '@/backend/features/product';
import { Modal } from '@/frontend/components/Modal';
import { Button } from '@/frontend/components/ui/button';

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
    <Modal
      open={open}
      onOpenChange={setOpen}
      title={tProduct('editProduct')}
      contentClassName="max-w-lg"
      trigger={
        <Button variant="ghost" size="icon" className="size-7" disabled={disabled}>
          <Pencil className="text-muted-foreground" size={16} />
        </Button>
      }
    >
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
    </Modal>
  );
};
