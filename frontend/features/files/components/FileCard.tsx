'use client';

import { FileVideo, ImageIcon, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { FC, useCallback } from 'react';

import type { FileModel } from '@/backend/features/file';
import { Badge } from '@/frontend/components/ui/badge';
import { Button } from '@/frontend/components/ui/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/frontend/components/ui/card';

import { useDeleteFile } from '../hooks';
import { FileVideoPlayer } from './FileVideoPlayer';

interface FileCardProps {
  file: FileModel;
}

export const FileCard: FC<FileCardProps> = ({ file }) => {
  const { mutate: deleteFile, isPending } = useDeleteFile();

  const handleDelete = useCallback(() => {
    deleteFile({ params: { id: file.id } });
  }, [deleteFile, file.id]);

  return (
    <li className="flex flex-col">
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="truncate text-sm">{file.name}</CardTitle>
          <CardAction>
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              disabled={isPending}
              onClick={handleDelete}
            >
              <Trash2 className="text-muted-foreground" size={16} />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {file.fileType === 'IMAGE' ? (
            <div className="relative h-40 overflow-hidden rounded-md bg-muted">
              <Image
                src={file.fileUrl}
                alt={file.name}
                fill
                className="object-cover"
              />
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
