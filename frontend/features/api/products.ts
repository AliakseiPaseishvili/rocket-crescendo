import type { ProductModel, ProductCreateInput } from '@/backend/types';

export const productsApi = {
  getAll: async (): Promise<ProductModel[]> => {
    const response = await fetch('/api/products');

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch products');
    }

    return response.json();
  },

  create: async (data: ProductCreateInput): Promise<unknown> => {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create product');
    }

    return response.json();
  },
};
