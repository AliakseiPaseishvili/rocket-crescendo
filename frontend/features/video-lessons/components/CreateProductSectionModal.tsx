'use client';

import { useTranslations } from 'next-intl';
import { FC, useState } from 'react';

import { Modal } from '@/frontend/components/Modal';
import { Button } from '@/frontend/components/ui/button';

import { ProductSectionFormFields } from './ProductSectionFormFields';
import { useCreateProductSectionForm } from '../hooks/use-create-product-section-form';

interface CreateProductSectionModalProps {
  productId: string;
}

export const CreateProductSectionModal: FC<CreateProductSectionModalProps> = ({ productId }) => {
  const [open, setOpen] = useState(false);
  const tVl = useTranslations('videoLesson');
  const t = useTranslations('common');

  const { register, control, fields, errors, onSubmit, isPending, error } =
    useCreateProductSectionForm(productId, () => setOpen(false));

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      trigger={<Button variant="outline" size="sm">{tVl('addSection')}</Button>}
      title={tVl('addSection')}
    >
      <ProductSectionFormFields
        register={register}
        control={control}
        fields={fields}
        errors={errors}
        onSubmit={onSubmit}
        isPending={isPending}
        error={error}
        submitLabel={t('create')}
        pendingLabel={t('creating')}
      />
    </Modal>
  );
};
