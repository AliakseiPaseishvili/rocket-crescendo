'use client';

import { Check, FileVideo } from 'lucide-react';
import Image from 'next/image';
import { FC } from 'react';

import type { FileModel } from '@/backend/features/file';
import { Button } from '@/frontend/components/ui/button';
import { cn } from '@/frontend/lib/utils';

interface FilePickerItemProps {
  file: FileModel;
  isSelected: boolean;
  isAlreadySelected: boolean;
  onToggle: (file: FileModel) => void;
}

export const FilePickerItem: FC<FilePickerItemProps> = ({ file, isSelected, isAlreadySelected, onToggle }) => (
  <li>
    <Button
      type="button"
      variant="outline"
      onClick={() => onToggle(file)}
      disabled={isAlreadySelected}
      className={cn(
        'relative h-auto w-full overflow-hidden rounded-lg border p-0 transition-all flex flex-col',
        isSelected && 'border-primary ring-2 ring-primary',
        isAlreadySelected && 'cursor-not-allowed opacity-40',
        !isSelected && !isAlreadySelected && 'cursor-pointer hover:border-primary/50'
      )}
    >
      {file.fileType === 'IMAGE' ? (
        <div className="relative w-full h-24 bg-muted">
          <Image src={file.fileUrl} alt={file.name} fill className="object-cover" />
        </div>
      ) : (
        <div className="flex w-full h-24 items-center justify-center bg-muted">
          <FileVideo className="text-muted-foreground" size={32} />
        </div>
      )}
      <p className="truncate px-2 py-1 text-left text-xs max-w-[calc(100%-16px)]">{file.name}</p>
      {isSelected && (
        <div className="absolute right-1.5 top-1.5 flex size-5 items-center justify-center rounded-full bg-primary">
          <Check size={12} className="text-primary-foreground" />
        </div>
      )}
    </Button>
  </li>
);
