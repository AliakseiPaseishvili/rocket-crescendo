'use client';

import { useTranslations } from 'next-intl';
import { FC } from 'react';

import { ProductSectionFormFields } from './ProductSectionFormFields';
import { useCreateProductSectionForm } from '../hooks/use-create-product-section-form';
import { useVideoLessonsPanelStore } from '../store/video-lessons-panel.store';

interface CreateSectionPanelContentProps {
  productId: string;
}

export const CreateSectionPanelContent: FC<CreateSectionPanelContentProps> = ({ productId }) => {
  const t = useTranslations('common');
  const close = useVideoLessonsPanelStore((s) => s.close);
  const { register, control, fields, errors, onSubmit, isPending, error } =
    useCreateProductSectionForm(productId, close);

  return (
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
  );
};
