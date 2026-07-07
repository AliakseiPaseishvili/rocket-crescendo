'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { useCheckout } from '@/frontend/features/cart';

import { useCheckoutFormSchema } from './use-checkout-form-schema';
import type { CheckoutFormValues } from '../types';

const defaultValues: CheckoutFormValues = {
  email: '',
  country: '',
  region: '',
  addressLine1: '',
  addressLine2: '',
  flatNumber: '',
  city: '',
  postcode: '',
  additionalInfo: '',
};

export function useCheckoutForm() {
  const schema = useCheckoutFormSchema();
  const checkout = useCheckout();

  const form = useForm<CheckoutFormValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues,
  });

  const onSubmit = form.handleSubmit(
    ({ email, region, addressLine2, flatNumber, additionalInfo, ...required }) => {
      checkout.mutate({
        email,
        address: {
          ...required,
          region: region || undefined,
          addressLine2: addressLine2 || undefined,
          flatNumber: flatNumber || undefined,
          additionalInfo: additionalInfo || undefined,
        },
      });
    },
  );

  return {
    form,
    onSubmit,
    isPending: checkout.isPending,
    error: checkout.error,
  };
}
