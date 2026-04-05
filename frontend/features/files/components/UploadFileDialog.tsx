'use client';

import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';

import { Button } from '@/frontend/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/frontend/components/ui/dialog';
import { Input } from '@/frontend/components/ui/input';
import { Label } from '@/frontend/components/ui/label';

import { useUploadFile } from '../hooks';

export const UploadFileDialog = () => {
  const t = useTranslations('file');
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: upload, isPending } = useUploadFile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !name.trim()) return;

    upload(
      { file: selectedFile, name: name.trim() },
      {
        onSuccess: () => {
          setOpen(false);
          setName('');
          setSelectedFile(null);
          if (fileInputRef.current) fileInputRef.current.value = '';
        },
      },
    );
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setName('');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="file-name">{t('fileName')}</Label>
            <Input
              id="file-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('fileNamePlaceholder')}
              disabled={isPending}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="file-input">{t('file')}</Label>
            <Input
              id="file-input"
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              disabled={isPending}
              required
              onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
            />
          </div>
          <Button type="submit" disabled={isPending || !name.trim() || !selectedFile}>
            {isPending ? t('uploading') : t('upload')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
