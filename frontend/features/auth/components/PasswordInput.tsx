'use client';

import { Check, Eye, EyeOff } from 'lucide-react';
import { forwardRef, useState } from 'react';

import { Button } from '@/frontend/components/ui/button';
import { Input } from '@/frontend/components/ui/input';

type PasswordInputProps = Omit<React.ComponentProps<typeof Input>, 'type'> & {
  isMatch?: boolean;
};

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ isMatch, ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={visible ? 'text' : 'password'}
          className={isMatch ? 'pr-16' : 'pr-10'}
          {...props}
        />
        {isMatch && (
          <Check className="absolute right-10 top-1/2 size-4 -translate-y-1/2 text-green-500" />
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
          onClick={() => setVisible((v) => !v)}
          tabIndex={-1}
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </Button>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
