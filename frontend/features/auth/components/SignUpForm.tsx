'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Button } from '@/frontend/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/frontend/components/ui/card';
import { Input } from '@/frontend/components/ui/input';
import { Label } from '@/frontend/components/ui/label';
import { ROUTES } from '@/frontend/constants';
import { Link, useRouter } from '@/frontend/features/translation/i18n/navigation';

import { EmailPasswordFields } from './EmailPasswordFields';
import { PasswordPolicyChecklist } from './PasswordPolicyChecklist';
import { signUp } from '../auth-client';
import { useSignUpSchema } from '../hooks';
import { SignUpFormValues } from '../types';

export const SignUpForm = () => {
  const t = useTranslations('auth');
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const schema = useSignUpSchema();

  const methods = useForm<SignUpFormValues>({ resolver: yupResolver(schema) });
  const { register, handleSubmit, formState: { errors, isSubmitting } } = methods;

  const onSubmit = async (values: SignUpFormValues) => {
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
    router.push(ROUTES.BASE);
    router.refresh();
  };

  return (
    <FormProvider {...methods}>
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

          <EmailPasswordFields register={register} errors={errors} />

          <PasswordPolicyChecklist />

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirmPassword">{t('fields.confirmPassword')}</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder={t('fields.confirmPasswordPlaceholder')}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-destructive text-sm">{errors.confirmPassword.message}</p>
            )}
          </div>

          {serverError && <p className="text-destructive text-sm">{serverError}</p>}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? t('signUp.submitting') : t('signUp.submit')}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {t('signUp.haveAccount')}{' '}
            <Link
              href={ROUTES.SIGN_IN}
              className="underline underline-offset-4 hover:text-foreground"
            >
              {t('signUp.signInLink')}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
    </FormProvider>
  );
};
