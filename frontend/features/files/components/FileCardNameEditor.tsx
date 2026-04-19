'use client';

import { Check, Pencil, X } from 'lucide-react';
import { FC, KeyboardEvent, useCallback, useRef, useState } from 'react';

import { Button } from '@/frontend/components/ui/button';
import { CardAction, CardTitle } from '@/frontend/components/ui/card';
import { Input } from '@/frontend/components/ui/input';

interface FileCardNameEditorProps {
  name: string;
  onSave: (name: string) => void;
  isSaving: boolean;
  disabled: boolean;
}

export const FileCardNameEditor: FC<FileCardNameEditorProps> = ({ name, onSave, isSaving, disabled }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);

  const startEditing = useCallback(() => {
    setValue(name);
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  }, [name]);

  const cancel = useCallback(() => {
    setEditing(false);
    setValue(name);
  }, [name]);

  const commit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || trimmed === name) {
      cancel();
      return;
    }
    onSave(trimmed);
    setEditing(false);
  }, [value, name, onSave, cancel]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') commit();
      if (e.key === 'Escape') cancel();
    },
    [commit, cancel]
  );

  if (editing) {
    return (
      <div className="flex flex-1 items-center gap-1 min-w-0">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="h-7 text-sm"
          disabled={isSaving}
          autoFocus
        />
        <Button variant="ghost" size="icon" className="size-7 shrink-0" onClick={commit} disabled={isSaving}>
          <Check size={14} className="text-green-600" />
        </Button>
        <Button variant="ghost" size="icon" className="size-7 shrink-0" onClick={cancel} disabled={isSaving}>
          <X size={14} className="text-muted-foreground" />
        </Button>
      </div>
    );
  }

  return (
    <>
      <CardTitle className="truncate text-sm">{name}</CardTitle>
      <CardAction className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="size-7" disabled={disabled} onClick={startEditing}>
          <Pencil className="text-muted-foreground" size={14} />
        </Button>
      </CardAction>
    </>
  );
};
