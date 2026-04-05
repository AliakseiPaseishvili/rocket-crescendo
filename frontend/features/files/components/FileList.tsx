'use client';

import { useTranslations } from 'next-intl';

import { useFiles } from '../hooks';
import { FileCard } from './FileCard';
import { UploadFileDialog } from './UploadFileDialog';

export const FileList = () => {
  const t = useTranslations('file');
  const { data: files, isPending, isError } = useFiles();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row items-center gap-2">
        <h1 className="text-3xl font-bold">{t('files')}</h1>
        <UploadFileDialog />
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
