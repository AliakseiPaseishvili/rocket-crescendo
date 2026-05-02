import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import * as yup from 'yup';

export const useResetPasswordSchema = () => {
  const t = useTranslations('auth');

  return useMemo(
    () =>
      yup.object({
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
    [t],
  );
};
