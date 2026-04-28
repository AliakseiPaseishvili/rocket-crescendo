'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Button } from '@/frontend/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/frontend/components/ui/card';
import { Input } from '@/frontend/components/ui/input';
import { Label } from '@/frontend/components/ui/label';
import { ROUTES } from '@/frontend/constants';
import { Link, useRouter } from '@/frontend/features/translation/i18n/navigation';

import { PasswordInput } from './PasswordInput';
import { signIn } from '../auth-client';
import { SignInFormValues } from '../types';

export const SignInForm = () => {
  const t = useTranslations('auth');
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const schema = useMemo(
    () =>
      yup.object({
        identifier: yup.string().required(t('validation.identifierRequired')),
        password: yup
          .string()
          .min(8, t('validation.passwordMinLength'))
          .required(t('validation.passwordRequired')),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({ resolver: yupResolver(schema) });

  const onSubmit = async (values: SignInFormValues) => {
    setServerError(null);
    const isEmail = values.identifier.includes('@');
    const { error } = isEmail
      ? await signIn.email({ email: values.identifier, password: values.password })
      : await signIn.username({ username: values.identifier, password: values.password });
    if (error) {
      setServerError(error.message ?? t('errors.signInFailed'));
      return;
    }
    router.push(ROUTES.BASE);
    router.refresh();
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{t('signIn.title')}</CardTitle>
        <CardDescription>{t('signIn.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="identifier">{t('fields.identifier')}</Label>
            <Input
              id="identifier"
              type="text"
              placeholder={t('fields.identifierPlaceholder')}
              autoComplete="username"
              {...register('identifier')}
            />
            {errors.identifier && (
              <p className="text-destructive text-sm">{errors.identifier.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">{t('fields.password')}</Label>
            <PasswordInput
              id="password"
              placeholder={t('fields.passwordPlaceholder')}
              {...register('password')}
            />
            {errors.password && (
              <p className="text-destructive text-sm">{errors.password.message}</p>
            )}
          </div>

          {serverError && <p className="text-destructive text-sm">{serverError}</p>}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? t('signIn.submitting') : t('signIn.submit')}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {t('signIn.noAccount')}{' '}
            <Link
              href={ROUTES.SIGN_UP}
              className="underline underline-offset-4 hover:text-foreground"
            >
              {t('signIn.signUpLink')}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
};
