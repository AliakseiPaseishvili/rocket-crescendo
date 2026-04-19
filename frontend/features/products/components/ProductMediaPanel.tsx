'use client';

import { useTranslations } from 'next-intl';
import { FC } from 'react';

import type { FileModel } from '@/backend/features/file';

import { AdditionalImagesPanel } from './AdditionalImagesPanel';
import { MediaPickerCard } from './MediaPickerCard';

interface ProductMediaPanelProps {
  mainImage: FileModel | null;
  video: FileModel | null;
  additionalImages: FileModel[];
  onSelectMainImage: (file: FileModel) => void;
  onRemoveMainImage: () => void;
  onSelectVideo: (file: FileModel) => void;
  onRemoveVideo: () => void;
  onSelectAdditionalImages: (files: FileModel[]) => void;
  onRemoveAdditionalImage: (id: number) => void;
}

export const ProductMediaPanel: FC<ProductMediaPanelProps> = ({
  mainImage,
  video,
  additionalImages,
  onSelectMainImage,
  onRemoveMainImage,
  onSelectVideo,
  onRemoveVideo,
  onSelectAdditionalImages,
  onRemoveAdditionalImage,
}) => {
  const t = useTranslations('product');

  return (
    <div className="flex flex-col gap-4 overflow-y-auto">
      <MediaPickerCard
        label={t('mainImage')}
        fileType="IMAGE"
        selectedFile={mainImage}
        onSelect={onSelectMainImage}
        onRemove={onRemoveMainImage}
      />

      <MediaPickerCard
        label={t('video')}
        fileType="VIDEO"
        selectedFile={video}
        onSelect={onSelectVideo}
        onRemove={onRemoveVideo}
      />

      <AdditionalImagesPanel
        additionalImages={additionalImages}
        onSelectAdditionalImages={onSelectAdditionalImages}
        onRemoveAdditionalImage={onRemoveAdditionalImage}
      />
    </div>
  );
};
