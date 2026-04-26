import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import * as yup from 'yup';

export const useSignInSchema = () => {
  const t = useTranslations('auth');

  return useMemo(
    () =>
      yup.object({
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
};
