'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
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

import { useFiles } from '../hooks';
import { FilePickerItem } from './FilePickerItem';

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
  const t = useTranslations('file');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<FileModel[]>([]);

  const { items: files = [], fetchNextPage, queryProps: { isPending, hasNextPage, isFetchingNextPage } } = useFiles({
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
            {fileType === 'IMAGE' ? t('selectImage') : t('selectVideo')}
          </DrawerTitle>
          <div className="relative mt-2">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <Input
              placeholder={t('searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4">
          {isPending ? (
            <p className="py-8 text-center text-sm text-muted-foreground">{t('loading')}</p>
          ) : files.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">{t('noFilesFound')}</p>
          ) : (
            <ul className="grid grid-cols-2 gap-3">
              {files.map((file) => (
                <FilePickerItem
                  key={file.id}
                  file={file}
                  isSelected={selected.some((f) => f.id === file.id)}
                  isAlreadySelected={alreadySelectedIds.includes(file.id)}
                  onToggle={toggleFile}
                />
              ))}
            </ul>
          )}
          {hasNextPage && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="mt-4 w-full"
            >
              {isFetchingNextPage ? t('loading') : t('loadMore')}
            </Button>
          )}
        </div>

        <DrawerFooter className="border-t">
          <Button onClick={handleConfirm} disabled={selected.length === 0}>
            {selected.length > 0 ? t('selectCount', { count: selected.length }) : t('select')}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
