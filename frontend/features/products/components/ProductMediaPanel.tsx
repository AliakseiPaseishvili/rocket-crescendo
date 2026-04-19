'use client';

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
  return (
    <div className="flex flex-col gap-4 overflow-y-auto">
      <MediaPickerCard
        label="Main Image"
        fileType="IMAGE"
        selectedFile={mainImage}
        onSelect={onSelectMainImage}
        onRemove={onRemoveMainImage}
      />

      <MediaPickerCard
        label="Video"
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
