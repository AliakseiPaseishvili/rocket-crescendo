'use client';

import { useTranslations } from 'next-intl';
import { useFormContext, useWatch } from 'react-hook-form';

import { Label } from '@/frontend/components/ui/label';

import { EmailPasswordFields } from './EmailPasswordFields';
import { PasswordInput } from './PasswordInput';
import { SignUpFormValues } from '../types';

export const PasswordWithConfirmFields = () => {
  const t = useTranslations('auth');
  const { register, control, formState: { errors } } = useFormContext<SignUpFormValues>();

  const [password, confirmPassword] = useWatch({ control, name: ['password', 'confirmPassword'] });
  const passwordsMatch = !!password && password === confirmPassword;

  return (
    <>
      <EmailPasswordFields register={register} errors={errors} />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="confirmPassword">{t('fields.confirmPassword')}</Label>
        <PasswordInput
          id="confirmPassword"
          placeholder={t('fields.confirmPasswordPlaceholder')}
          isMatch={passwordsMatch}
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className="text-destructive text-sm">{errors.confirmPassword.message}</p>
        )}
      </div>
    </>
  );
};
