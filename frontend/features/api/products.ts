import type { ProductCreateInput, ProductFilter, ProductUpdateInput, ProductWithTranslations } from '@/backend/features/product';

export const productsApi = {
  getAll: async (filter?: ProductFilter): Promise<ProductWithTranslations[]> => {
    const url = new URL('/api/products', window.location.origin);
    if (filter?.favorite !== undefined) {
      url.searchParams.set('favorite', String(filter.favorite));
    }
    const response = await fetch(url.toString());

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
