'use client';

import { Pencil } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FC, useState } from 'react';

import type { ProductSectionWithTranslations } from '@/backend/features/product-section';
import { Modal } from '@/frontend/components/Modal';
import { Button } from '@/frontend/components/ui/button';

import { ProductSectionFormFields } from './ProductSectionFormFields';
import { useEditProductSectionForm } from '../hooks/use-edit-product-section-form';

interface EditProductSectionModalProps {
  section: ProductSectionWithTranslations;
  productId: string;
}

export const EditProductSectionModal: FC<EditProductSectionModalProps> = ({ section, productId }) => {
  const [open, setOpen] = useState(false);
  const tVl = useTranslations('videoLesson');
  const t = useTranslations('common');

  const { register, control, fields, errors, onSubmit, isPending, error } =
    useEditProductSectionForm(section, productId, () => setOpen(false));

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button variant="ghost" size="icon" className="size-8">
          <Pencil size={14} />
        </Button>
      }
      title={tVl('editSection')}
    >
      <ProductSectionFormFields
        register={register}
        control={control}
        fields={fields}
        errors={errors}
        onSubmit={onSubmit}
        isPending={isPending}
        error={error}
        submitLabel={t('save')}
        pendingLabel={t('saving')}
      />
    </Modal>
  );
};
