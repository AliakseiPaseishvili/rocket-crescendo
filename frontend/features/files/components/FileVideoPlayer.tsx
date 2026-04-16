'use client';

import { FileVideo } from 'lucide-react';
import { FC, useState } from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/frontend/components/ui/dialog';
import { VideoPlayer } from '@/frontend/features/video-player';

interface FileVideoPlayerProps {
  src: string;
  name: string;
}

export const FileVideoPlayer: FC<FileVideoPlayerProps> = ({ src, name }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="flex h-40 w-full cursor-pointer items-center justify-center rounded-md bg-muted transition-colors hover:bg-muted/70"
        onClick={() => setOpen(true)}
      >
        <FileVideo className="text-muted-foreground" size={40} />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="
            top-0 left-0 h-full max-h-none w-full max-w-full translate-x-0 translate-y-0 rounded-none p-0 gap-0
            sm:top-1/2 sm:left-1/2 sm:h-auto sm:max-h-[90vh] sm:-translate-x-1/2 sm:-translate-y-1/2
            sm:max-w-[min(90vw,1200px)] sm:rounded-xl sm:p-4 sm:gap-4
          "
        >
          <DialogHeader className="px-4 pt-4 sm:px-0 sm:pt-0">
            <DialogTitle className="truncate pr-8">{name}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-1 items-center sm:block">
            <VideoPlayer src={src} controls fluid className="w-full" />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
