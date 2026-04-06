'use client';

import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Control, useFormState } from 'react-hook-form';

import { Button } from '@/frontend/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/frontend/components/ui/dialog';

import { useUploadFileForm } from '../hooks';
import { FileUploadInput } from './FileUploadInput';
import { UploadFileFormValues } from '../types';

export const UploadFileDialog = () => {
  const t = useTranslations('file');
  const [open, setOpen] = useState(false);

  const { control, errors, onSubmit, isPending, reset, mutationError } = useUploadFileForm(() => setOpen(false));

  const { isValid } = useFormState({ control });

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    setOpen(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus size={16} />
          {t('uploadFile')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('uploadFile')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <FileUploadInput
            label={t('file')}
            control={control as Control<UploadFileFormValues>}
            namePlaceholder={t('fileNamePlaceholder')}
            disabled={isPending}
            error={errors.file?.message || errors.name?.message}
          />
          {mutationError && (
            <p className="text-destructive text-sm">{mutationError.message}</p>
          )}
          <Button type="submit" disabled={isPending || !isValid}>
            {isPending ? t('uploading') : t('upload')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
