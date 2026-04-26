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
      }),
    [signInSchema, t],
  );
};
