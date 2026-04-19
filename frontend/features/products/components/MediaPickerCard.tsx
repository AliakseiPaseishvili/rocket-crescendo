'use client';

import { FileVideo, ImageIcon, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { FC, useState } from 'react';

import type { FileModel } from '@/backend/features/file';
import { Button } from '@/frontend/components/ui/button';
import { FilePickerDrawer } from '@/frontend/features/files';

interface MediaPickerCardProps {
  label: string;
  fileType: 'IMAGE' | 'VIDEO';
  selectedFile: FileModel | null;
  onSelect: (file: FileModel) => void;
  onRemove: () => void;
}

export const MediaPickerCard: FC<MediaPickerCardProps> = ({
  label,
  fileType,
  selectedFile,
  onSelect,
  onRemove,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-label={selectedFile ? `Change ${label}` : `Select ${label}`}
        onClick={() => setDrawerOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setDrawerOpen(true);
          }
        }}
        className="w-full cursor-pointer overflow-hidden rounded-lg border-2 transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {selectedFile ? (
          <>
            {selectedFile.fileType === 'IMAGE' ? (
              <div className="relative h-44 bg-muted">
                <Image
                  src={selectedFile.fileUrl}
                  alt={selectedFile.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-44 items-center justify-center bg-muted">
                <FileVideo className="text-muted-foreground" size={40} />
              </div>
            )}
            <div className="flex items-center justify-between px-3 py-2">
              <p className="truncate text-xs text-muted-foreground">{selectedFile.name}</p>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-7 shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
              >
                <Trash2 size={14} className="text-muted-foreground" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex h-44 flex-col items-center justify-center gap-2 border-dashed text-muted-foreground">
            {fileType === 'IMAGE' ? <ImageIcon size={28} /> : <FileVideo size={28} />}
            <span className="text-sm font-medium">{label}</span>
          </div>
        )}
      </div>

      <FilePickerDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        fileType={fileType}
        maxSelection={1}
        alreadySelectedIds={[]}
        onConfirm={(files) => {
          if (files[0]) onSelect(files[0]);
        }}
      />
    </>
  );
};
