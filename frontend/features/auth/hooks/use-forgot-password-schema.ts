import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import * as yup from 'yup';

export const useForgotPasswordSchema = () => {
  const t = useTranslations('auth');

  return useMemo(
    () =>
      yup.object({
        email: yup
          .string()
          .email(t('validation.emailInvalid'))
          .required(t('validation.emailRequired')),
      }),
    [t],
  );
};
