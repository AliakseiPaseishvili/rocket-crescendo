import { useTranslations } from 'next-intl';
import { FieldValues, UseFormRegister } from 'react-hook-form';

import { Input } from '@/frontend/components/ui/input';
import { Label } from '@/frontend/components/ui/label';

import { PasswordInput } from './PasswordInput';

type FieldErrors = {
  email?: { message?: string };
  password?: { message?: string };
};

type Props<T extends FieldValues> = {
  register: UseFormRegister<T>;
  errors: FieldErrors;
};

export const EmailPasswordFields = <T extends FieldValues>({ register, errors }: Props<T>) => {
  const t = useTranslations('auth');

  return (
    <>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">{t('fields.email')}</Label>
        <Input
          id="email"
          type="email"
          placeholder={t('fields.emailPlaceholder')}
          {...register('email' as Parameters<typeof register>[0])}
        />
        {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">{t('fields.password')}</Label>
        <PasswordInput
          id="password"
          placeholder={t('fields.passwordPlaceholder')}
          {...register('password' as Parameters<typeof register>[0])}
        />
        {errors.password && <p className="text-destructive text-sm">{errors.password.message}</p>}
      </div>
    </>
  );
};
