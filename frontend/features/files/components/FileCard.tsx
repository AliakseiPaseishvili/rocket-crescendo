'use client';

import { FileVideo, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { FC, useCallback } from 'react';

import type { FileModel } from '@/backend/features/file';
import { Badge } from '@/frontend/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/frontend/components/ui/card';

import { useDeleteFile, useUpdateFile } from '../hooks';
import { FileCardNameEditor } from './FileCardNameEditor';
import { FileVideoPlayer } from './FileVideoPlayer';

interface FileCardProps {
  file: FileModel;
}

export const FileCard: FC<FileCardProps> = ({ file }) => {
  const { mutate: deleteFile, isPending: isDeleting } = useDeleteFile();
  const { mutate: updateFile, isPending: isUpdating } = useUpdateFile();

  const handleDelete = useCallback(() => {
    deleteFile({ params: { id: file.id } });
  }, [deleteFile, file.id]);

  const handleSave = useCallback(
    (name: string) => {
      updateFile({ body: { name }, params: { id: file.id } });
    },
    [updateFile, file.id]
  );

  return (
    <li className="flex flex-col">
      <Card className="h-full">
        <CardHeader>
          <FileCardNameEditor
            name={file.name}
            onSave={handleSave}
            onDelete={handleDelete}
            isSaving={isUpdating}
            disabled={isDeleting || isUpdating}
          />
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {file.fileType === 'IMAGE' ? (
            <div className="relative h-40 overflow-hidden rounded-md bg-muted">
              <Image src={file.fileUrl} alt={file.name} fill className="object-cover" />
            </div>
          ) : (
            <FileVideoPlayer src={file.fileUrl} name={file.name} />
          )}
          <div className="flex items-center gap-2">
            {file.fileType === 'IMAGE' ? (
              <ImageIcon size={14} className="text-muted-foreground" />
            ) : (
              <FileVideo size={14} className="text-muted-foreground" />
            )}
            <Badge variant="secondary" className="text-xs">
              {file.fileType}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </li>
  );
};
