'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/frontend/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/frontend/components/ui/card';
import { ROUTES } from '@/frontend/constants';
import { Link, useRouter } from '@/frontend/features/translation/i18n/navigation';

import { EmailPasswordFields } from './EmailPasswordFields';
import { signIn } from '../auth-client';
import { useSignInSchema } from '../hooks';

type FormValues = {
  email: string;
  password: string;
};

export const SignInForm = () => {
  const t = useTranslations('auth');
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const schema = useSignInSchema();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: yupResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    const { error } = await signIn.email({
      email: values.email,
      password: values.password,
    });
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
          <EmailPasswordFields register={register} errors={errors} />

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
