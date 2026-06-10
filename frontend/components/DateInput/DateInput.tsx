'use client';

import { ChangeEvent, ComponentProps, FC, useCallback, useRef, useState } from 'react';

import { Calendar } from '@/frontend/components/ui/calendar';
import { Input } from '@/frontend/components/ui/input';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@/frontend/components/ui/popover';

import { formatDisplayDate, maskDateValue, parseDisplayDate } from './utils';

type PointerDownOutsideHandler = NonNullable<
  ComponentProps<typeof PopoverContent>['onPointerDownOutside']
>;

interface DateInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const DateInput: FC<DateInputProps> = ({ id, value, onChange, placeholder }) => {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState<Date>(() => parseDisplayDate(value) ?? new Date());
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = parseDisplayDate(value);

  const handleOpen = useCallback(() => {
    setMonth((current) => parseDisplayDate(value) ?? current);
    setOpen(true);
  }, [value]);

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const masked = maskDateValue(event.target.value);
      onChange(masked);

      const parsed = parseDisplayDate(masked);
      if (parsed) setMonth(parsed);
    },
    [onChange],
  );

  const handleSelect = useCallback(
    (date: Date | undefined) => {
      if (!date) return;
      onChange(formatDisplayDate(date));
      setMonth(date);
      setOpen(false);
      inputRef.current?.focus();
    },
    [onChange],
  );

  const preventAutoFocus = useCallback((event: Event) => event.preventDefault(), []);

  const handlePointerDownOutside = useCallback<PointerDownOutsideHandler>((event) => {
    if (event.target instanceof Node && inputRef.current?.contains(event.target)) {
      event.preventDefault();
    }
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <Input
          ref={inputRef}
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onFocus={handleOpen}
          onClick={handleOpen}
        />
      </PopoverAnchor>
      <PopoverContent
        className="w-auto p-0"
        align="start"
        onOpenAutoFocus={preventAutoFocus}
        onCloseAutoFocus={preventAutoFocus}
        onPointerDownOutside={handlePointerDownOutside}
      >
        <Calendar
          mode="single"
          selected={selected}
          month={month}
          onMonthChange={setMonth}
          onSelect={handleSelect}
          captionLayout="dropdown"
          startMonth={new Date(1900, 0)}
          disabled={{ after: new Date() }}
        />
      </PopoverContent>
    </Popover>
  );
};
