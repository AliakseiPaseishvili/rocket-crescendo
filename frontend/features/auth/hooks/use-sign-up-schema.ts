import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import * as yup from 'yup';

import { useSignInSchema } from './use-sign-in-schema';

export const useSignUpSchema = () => {
  const t = useTranslations('auth');
  const signInSchema = useSignInSchema();

  return useMemo(
    () =>
      signInSchema.shape({
        name: yup
          .string()
          .min(2, t('validation.nameMinLength'))
          .required(t('validation.nameRequired')),
        password: yup
          .string()
          .min(8, t('validation.passwordMinLength'))
          .matches(/[A-Z]/, t('validation.passwordUppercase'))
          .matches(/[a-z]/, t('validation.passwordLowercase'))
          .matches(/[0-9]/, t('validation.passwordNumber'))
          .matches(/[^A-Za-z0-9]/, t('validation.passwordSpecial'))
          .required(t('validation.passwordRequired')),
        confirmPassword: yup
          .string()
          .oneOf([yup.ref('password')], t('validation.passwordsMustMatch'))
          .required(t('validation.confirmPasswordRequired')),
      }),
    [signInSchema, t],
  );
};
