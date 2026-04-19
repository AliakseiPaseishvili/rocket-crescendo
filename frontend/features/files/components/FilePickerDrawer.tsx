'use client';

import { Check, FileVideo, Search } from 'lucide-react';
import Image from 'next/image';
import { FC, useCallback, useState } from 'react';

import type { FileModel } from '@/backend/features/file';
import { Button } from '@/frontend/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/frontend/components/ui/drawer';
import { Input } from '@/frontend/components/ui/input';
import { cn } from '@/frontend/lib/utils';

import { useFiles } from '../hooks';

interface FilePickerDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileType: 'IMAGE' | 'VIDEO';
  maxSelection: number;
  alreadySelectedIds: number[];
  onConfirm: (files: FileModel[]) => void;
}

export const FilePickerDrawer: FC<FilePickerDrawerProps> = ({
  open,
  onOpenChange,
  fileType,
  maxSelection,
  alreadySelectedIds,
  onConfirm,
}) => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<FileModel[]>([]);

  const { data: files = [], isPending } = useFiles({
    fileType: fileType as never,
    name: search || undefined,
  });

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        setSearch('');
        setSelected([]);
      }
      onOpenChange(nextOpen);
    },
    [onOpenChange]
  );

  const toggleFile = useCallback(
    (file: FileModel) => {
      if (alreadySelectedIds.includes(file.id)) return;
      setSelected((prev) => {
        const isSelected = prev.some((f) => f.id === file.id);
        if (isSelected) return prev.filter((f) => f.id !== file.id);
        if (maxSelection === 1) return [file];
        if (prev.length >= maxSelection) return prev;
        return [...prev, file];
      });
    },
    [alreadySelectedIds, maxSelection]
  );

  const handleConfirm = useCallback(() => {
    onConfirm(selected);
    setSelected([]);
    setSearch('');
    onOpenChange(false);
  }, [onConfirm, selected, onOpenChange]);

  return (
    <Drawer open={open} onOpenChange={handleOpenChange} direction="right">
      <DrawerContent className="flex flex-col">
        <DrawerHeader className="border-b pb-4">
          <DrawerTitle>
            {fileType === 'IMAGE' ? 'Select Image' : 'Select Video'}
          </DrawerTitle>
          <div className="relative mt-2">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4">
          {isPending ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Loading...</p>
          ) : files.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No files found</p>
          ) : (
            <ul className="grid grid-cols-2 gap-3">
              {files.map((file) => {
                const isAlreadySelected = alreadySelectedIds.includes(file.id);
                const isSelected = selected.some((f) => f.id === file.id);
                return (
                  <li key={file.id}>
                    <button
                      type="button"
                      onClick={() => toggleFile(file)}
                      disabled={isAlreadySelected}
                      className={cn(
                        'relative w-full overflow-hidden rounded-lg border transition-all',
                        isSelected && 'border-primary ring-2 ring-primary',
                        isAlreadySelected && 'cursor-not-allowed opacity-40',
                        !isSelected && !isAlreadySelected && 'cursor-pointer hover:border-primary/50'
                      )}
                    >
                      {file.fileType === 'IMAGE' ? (
                        <div className="relative h-24 bg-muted">
                          <Image
                            src={file.fileUrl}
                            alt={file.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-24 items-center justify-center bg-muted">
                          <FileVideo className="text-muted-foreground" size={32} />
                        </div>
                      )}
                      <p className="truncate px-2 py-1 text-left text-xs">{file.name}</p>
                      {isSelected && (
                        <div className="absolute right-1.5 top-1.5 flex size-5 items-center justify-center rounded-full bg-primary">
                          <Check size={12} className="text-primary-foreground" />
                        </div>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <DrawerFooter className="border-t">
          <Button onClick={handleConfirm} disabled={selected.length === 0}>
            {selected.length > 0 ? `Select (${selected.length})` : 'Select'}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
