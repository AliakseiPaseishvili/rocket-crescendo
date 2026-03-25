import type { ProductCreateInput, ProductUpdateInput, ProductWithTranslations } from '@/backend/types';

export const productsApi = {
  getAll: async (): Promise<ProductWithTranslations[]> => {
    const response = await fetch('/api/products');

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch products');
    }

    return response.json();
  },

  getFavorites: async (): Promise<ProductWithTranslations[]> => {
    const response = await fetch('/api/products/favorites');

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch favorite products');
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

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete product');
    }
  },

  update: async ({ id, ...data }: Partial<ProductUpdateInput> & { id: number }): Promise<ProductWithTranslations> => {
    const response = await fetch(`/api/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update product');
    }

    return response.json();
  },
};
