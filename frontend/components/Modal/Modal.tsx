'use client';

import { FC, ReactNode } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/frontend/components/ui/dialog';
import { cn } from '@/frontend/lib/utils';

interface ModalProps {
  trigger: ReactNode;
  title: string;
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  contentClassName?: string;
  headerClassName?: string;
  titleClassName?: string;
}

export const Modal: FC<ModalProps> = ({
  trigger,
  title,
  children,
  open,
  onOpenChange,
  contentClassName,
  headerClassName,
  titleClassName,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className={cn(contentClassName)}>
        <DialogHeader className={cn(headerClassName)}>
          <DialogTitle className={cn(titleClassName)}>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
