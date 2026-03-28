'use client';

import {
  amber,
  blue,
  crimson,
  cyan,
  grass,
  green,
  indigo,
  orange,
  pink,
  purple,
  red,
  teal,
  tomato,
  violet,
  yellow,
} from '@radix-ui/colors';
import { FC } from 'react';

import { Button } from '@/frontend/components/ui/button';
import { Input } from '@/frontend/components/ui/input';
import { Label } from '@/frontend/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/frontend/components/ui/popover';

const PRESET_COLORS = [
  tomato.tomato9,
  red.red9,
  crimson.crimson9,
  pink.pink9,
  purple.purple9,
  violet.violet9,
  indigo.indigo9,
  blue.blue9,
  cyan.cyan9,
  teal.teal9,
  green.green9,
  grass.grass9,
  yellow.yellow9,
  amber.amber9,
  orange.orange9,
];

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  errorMessage?: string;
}

export const ColorPicker: FC<ColorPickerProps> = ({ label, value, onChange, errorMessage }) => {
  return (
    <div className="flex flex-col gap-1">
      <Label>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className="w-full justify-start border border-input px-3 font-normal"
          >
            <span
              className="size-4 rounded-full border border-border shrink-0"
              style={{ backgroundColor: value || 'transparent' }}
            />
            <span className={value ? 'text-foreground' : 'text-muted-foreground'}>
              {value || '#000000'}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" align="start">
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-5 gap-1.5">
              {PRESET_COLORS.map((color) => (
                <Button
                  key={color}
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="rounded-full border-2 p-0 hover:bg-transparent"
                  style={{
                    backgroundColor: color,
                    borderColor: value === color ? 'hsl(var(--foreground))' : 'transparent',
                  }}
                  onClick={() => onChange(color)}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                value={value || '#000000'}
                onChange={(e) => onChange(e.target.value)}
                className="size-8 cursor-pointer p-0.5"
              />
              <span className="text-xs text-muted-foreground">Custom</span>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
    </div>
  );
};
