'use client';

import { useQuery } from '@tanstack/react-query';

import { api } from '@/frontend/features/api';

import { useCartStore } from '../store/useCartStore';

const CART_PRODUCTS_QUERY_KEY = 'cart-products';

export function useCartProducts() {
  const items = useCartStore((state) => state.items);
  const ids = items.map((item) => item.productId);

  const query = useQuery({
    queryKey: [CART_PRODUCTS_QUERY_KEY, ids],
    queryFn: () => api.getProductsByIds({ body: { ids } }),
    enabled: ids.length > 0,
  });

  return { items, products: query.data ?? [], ...query };
}
