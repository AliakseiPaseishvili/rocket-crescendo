'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Button } from '@/frontend/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/frontend/components/ui/card';
import { Input } from '@/frontend/components/ui/input';
import { Label } from '@/frontend/components/ui/label';

import { signUp } from '../auth-client';

type FormValues = {
  name: string;
  email: string;
  password: string;
};

export const SignUpForm = () => {
  const t = useTranslations('auth');
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const schema = useMemo(
    () =>
      yup.object({
        name: yup
          .string()
          .min(2, t('validation.nameMinLength'))
          .required(t('validation.nameRequired')),
        email: yup
          .string()
          .email(t('validation.emailInvalid'))
          .required(t('validation.emailRequired')),
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
  } = useForm<FormValues>({ resolver: yupResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    const { error } = await signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
    });
    if (error) {
      setServerError(error.message ?? t('errors.signUpFailed'));
      return;
    }
    router.push('/');
    router.refresh();
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{t('signUp.title')}</CardTitle>
        <CardDescription>{t('signUp.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">{t('fields.name')}</Label>
            <Input
              id="name"
              type="text"
              placeholder={t('fields.namePlaceholder')}
              {...register('name')}
            />
            {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">{t('fields.email')}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t('fields.emailPlaceholder')}
              {...register('email')}
            />
            {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">{t('fields.password')}</Label>
            <Input
              id="password"
              type="password"
              placeholder={t('fields.passwordPlaceholder')}
              {...register('password')}
            />
            {errors.password && (
              <p className="text-destructive text-sm">{errors.password.message}</p>
            )}
          </div>

          {serverError && <p className="text-destructive text-sm">{serverError}</p>}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? t('signUp.submitting') : t('signUp.submit')}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {t('signUp.haveAccount')}{' '}
            <a href="../sign-in" className="underline underline-offset-4 hover:text-foreground">
              {t('signUp.signInLink')}
            </a>
          </p>
        </form>
      </CardContent>
    </Card>
  );
};
