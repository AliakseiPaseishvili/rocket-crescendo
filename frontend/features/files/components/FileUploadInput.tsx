'use client';

import { Paperclip } from 'lucide-react';
import { useRef } from 'react';
import { useController } from 'react-hook-form';
import type { Control } from 'react-hook-form';

import { Button } from '@/frontend/components/ui/button';
import { Input } from '@/frontend/components/ui/input';
import { Label } from '@/frontend/components/ui/label';
import { cn } from '@/frontend/lib/utils';

import type { UploadFileFormValues } from '../types';

interface FileUploadInputProps {
  label: string;
  control: Control<UploadFileFormValues>;
  namePlaceholder?: string;
  disabled?: boolean;
  error?: string;
}

export const FileUploadInput = ({
  label,
  control,
  namePlaceholder,
  disabled,
  error,
}: FileUploadInputProps) => {
  const internalRef = useRef<HTMLInputElement>(null);

  const { field: nameField, fieldState: nameState } = useController({ control, name: 'name' });
  const { field: fileField, fieldState: fileState } = useController({ control, name: 'file' });

  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <input
          ref={internalRef}
          type="file"
          accept="image/*,video/*"
          disabled={disabled}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null;
            fileField.onChange(file);
            if (file && !nameField.value) {
              nameField.onChange(file.name.replace(/\.[^.]+$/, ''));
            }
          }}
        />
        <div className="flex flex-col gap-1">
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            aria-invalid={!!fileState.error}
            className={cn('shrink-0', fileField.value && 'border-ring')}
            onClick={() => internalRef.current?.click()}
          >
            <Paperclip />
          </Button>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Input
            {...nameField}
            placeholder={namePlaceholder}
            disabled={disabled}
            aria-invalid={!!nameState.error}
          />
        </div>
        {error && <p className="text-destructive text-xs">{error}</p>}
      </div>
    </div>
  );
};
