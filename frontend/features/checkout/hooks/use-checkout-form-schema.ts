'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import * as yup from 'yup';

export function useCheckoutFormSchema() {
  const t = useTranslations('checkout');

  return useMemo(
    () =>
      yup.object({
        email: yup
          .string()
          .required(t('emailRequired'))
          .email(t('emailInvalid')),
        country: yup.string().required(t('countryRequired')),
        region: yup.string().defined(),
        addressLine1: yup.string().required(t('addressRequired')),
        addressLine2: yup.string().defined(),
        flatNumber: yup.string().defined(),
        city: yup.string().required(t('cityRequired')),
        postcode: yup.string().required(t('postcodeRequired')),
        additionalInfo: yup.string().defined(),
      }),
    [t],
  );
}
