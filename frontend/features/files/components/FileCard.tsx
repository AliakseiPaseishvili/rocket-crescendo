'use client';

import { ImageIcon, Trash2, FileVideo } from 'lucide-react';
import Image from 'next/image';
import { FC, useCallback, useState } from 'react';

import type { FileModel } from '@/backend/features/file';
import { Badge } from '@/frontend/components/ui/badge';
import { Button } from '@/frontend/components/ui/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/frontend/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/frontend/components/ui/dialog';
import { VideoPlayer } from '@/frontend/features/video-player';

import { useDeleteFile } from '../hooks';

interface FileCardProps {
  file: FileModel;
}

export const FileCard: FC<FileCardProps> = ({ file }) => {
  const { mutate: deleteFile, isPending } = useDeleteFile();
  const [videoOpen, setVideoOpen] = useState(false);

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
            <>
              <button
                type="button"
                className="flex h-40 w-full cursor-pointer items-center justify-center rounded-md bg-muted transition-colors hover:bg-muted/70"
                onClick={() => setVideoOpen(true)}
              >
                <FileVideo className="text-muted-foreground" size={40} />
              </button>

              <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle className="truncate">{file.name}</DialogTitle>
                  </DialogHeader>
                  <VideoPlayer src={file.fileUrl} controls autoplay={false} fluid />
                </DialogContent>
              </Dialog>
            </>
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
