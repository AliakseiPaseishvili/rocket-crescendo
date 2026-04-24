'use client';

import { useTranslations } from 'next-intl';
import { FC } from 'react';
import { Control, Controller } from 'react-hook-form';

import type { FileModel } from '@/backend/features/file';

import { ProductFormValues } from '../types';
import { AdditionalImagesPanel } from './AdditionalImagesPanel';
import { MediaPickerCard } from './MediaPickerCard';

interface ProductMediaPanelProps {
  control: Control<ProductFormValues>;
  additionalImages: FileModel[];
  onSelectAdditionalImages: (files: FileModel[]) => void;
  onRemoveAdditionalImage: (id: string) => void;
}

export const ProductMediaPanel: FC<ProductMediaPanelProps> = ({
  control,
  additionalImages,
  onSelectAdditionalImages,
  onRemoveAdditionalImage,
}) => {
  const t = useTranslations('product');

  return (
    <div className="flex flex-col gap-4 overflow-y-auto">
      <Controller
        control={control}
        name="mainImage"
        render={({ field }) => (
          <MediaPickerCard
            label={t('mainImage')}
            fileType="IMAGE"
            selectedFile={field.value}
            onSelect={field.onChange}
            onRemove={() => field.onChange(null)}
          />
        )}
      />

      <Controller
        control={control}
        name="video"
        render={({ field }) => (
          <MediaPickerCard
            label={t('video')}
            fileType="VIDEO"
            selectedFile={field.value}
            onSelect={field.onChange}
            onRemove={() => field.onChange(null)}
          />
        )}
      />

      <AdditionalImagesPanel
        additionalImages={additionalImages}
        onSelectAdditionalImages={onSelectAdditionalImages}
        onRemoveAdditionalImage={onRemoveAdditionalImage}
      />
    </div>
  );
};
