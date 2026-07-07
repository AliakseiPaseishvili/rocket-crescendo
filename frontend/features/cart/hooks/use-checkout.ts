'use client';

import { useMutation } from '@tanstack/react-query';
import { useLocale } from 'next-intl';

import type { CheckoutAddressInput } from '@/backend/features/order';
import { api } from '@/frontend/features/api';

import { useCartStore } from '../store/useCartStore';

type CheckoutPayload = {
  email: string;
  address: CheckoutAddressInput;
};

export function useCheckout() {
  const lng = useLocale();
  const items = useCartStore((state) => state.items);

  return useMutation({
    mutationFn: async ({ email, address }: CheckoutPayload) => {
      const { url } = await api.createCheckout({
        body: { items, lng, email, address },
      });
      return url;
    },
    onSuccess: (url) => {
      window.location.href = url;
    },
  });
}
