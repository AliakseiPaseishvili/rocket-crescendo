'use client';

import { useTranslations } from 'next-intl';
import { FC } from 'react';

import type { ProductSectionWithTranslations } from '@/backend/features/product-section';

import { ProductSectionFormFields } from './ProductSectionFormFields';
import { useEditProductSectionForm } from '../hooks/use-edit-product-section-form';
import { useVideoLessonsPanelStore } from '../store/video-lessons-panel.store';

interface EditSectionPanelContentProps {
  section: ProductSectionWithTranslations;
  productId: string;
}

export const EditSectionPanelContent: FC<EditSectionPanelContentProps> = ({ section, productId }) => {
  const t = useTranslations('common');
  const close = useVideoLessonsPanelStore((s) => s.close);
  const { register, control, fields, errors, onSubmit, isPending, error } =
    useEditProductSectionForm(section, productId, close);

  return (
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
  );
};
