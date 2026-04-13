'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import type { FileType } from '@/backend/features/file';
import { Input } from '@/frontend/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/frontend/components/ui/select';

import { useFiles } from '../hooks';
import { FileCard } from './FileCard';
import { UploadFileDialog } from './UploadFileDialog';

export const FileList = () => {
  const t = useTranslations('file');
  const [nameFilter, setNameFilter] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState<FileType | 'all'>('all');

  const { data: files, isPending, isError } = useFiles({
    ...(nameFilter && { name: nameFilter }),
    ...(fileTypeFilter !== 'all' && { fileType: fileTypeFilter }),
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row items-center gap-2">
        <h1 className="text-3xl font-bold">{t('files')}</h1>
        <UploadFileDialog />
      </div>

      <div className="flex flex-row gap-2">
        <Input
          placeholder={t('filterByName')}
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="max-w-sm"
        />
        <Select value={fileTypeFilter} onValueChange={(val) => setFileTypeFilter(val as FileType | 'all')}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder={t('allTypes')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allTypes')}</SelectItem>
            <SelectItem value="IMAGE">{t('images')}</SelectItem>
            <SelectItem value="VIDEO">{t('videos')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isPending && <p className="text-muted-foreground">{t('loadingFiles')}</p>}
      {isError && <p className="text-destructive">{t('errorLoadingFiles')}</p>}
      {!isPending && !isError && !files?.length && (
        <p className="text-muted-foreground">{t('noFiles')}</p>
      )}

      {!!files?.length && (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {files.map((file) => (
            <FileCard key={file.id} file={file} />
          ))}
        </ul>
      )}
    </div>
  );
};
