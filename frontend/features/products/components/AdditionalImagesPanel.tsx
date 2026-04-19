'use client';

import { ImageIcon, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { FC, useState } from 'react';

import type { FileModel } from '@/backend/features/file';
import { Button } from '@/frontend/components/ui/button';
import { FilePickerDrawer } from '@/frontend/features/files';

const MAX_ADDITIONAL_IMAGES = 8;

interface AdditionalImagesPanelProps {
  additionalImages: FileModel[];
  onSelectAdditionalImages: (files: FileModel[]) => void;
  onRemoveAdditionalImage: (id: number) => void;
}

export const AdditionalImagesPanel: FC<AdditionalImagesPanelProps> = ({
  additionalImages,
  onSelectAdditionalImages,
  onRemoveAdditionalImage,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const alreadySelectedIds = additionalImages.map((f) => f.id);
  const maxAdditional = MAX_ADDITIONAL_IMAGES - additionalImages.length;

  return (
    <>
      {additionalImages.length > 0 && (
        <ul className="grid grid-cols-2 gap-2">
          {additionalImages.map((file) => (
            <li key={file.id} className="overflow-hidden rounded-lg border">
              <div className="relative h-24 bg-muted">
                <Image src={file.fileUrl} alt={file.name} fill className="object-cover" />
              </div>
              <div className="flex items-center justify-between px-2 py-1">
                <p className="truncate text-xs text-muted-foreground">{file.name}</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-6 shrink-0"
                  onClick={() => onRemoveAdditionalImage(file.id)}
                >
                  <Trash2 size={12} className="text-muted-foreground" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Button
        type="button"
        variant="outline"
        disabled={additionalImages.length >= MAX_ADDITIONAL_IMAGES}
        onClick={() => setDrawerOpen(true)}
        className="w-full"
      >
        <ImageIcon size={16} />
        {additionalImages.length > 0
          ? `Add Images (${additionalImages.length}/${MAX_ADDITIONAL_IMAGES})`
          : 'Add Images'}
      </Button>

      <FilePickerDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        fileType="IMAGE"
        maxSelection={maxAdditional}
        alreadySelectedIds={alreadySelectedIds}
        onConfirm={onSelectAdditionalImages}
      />
    </>
  );
};
