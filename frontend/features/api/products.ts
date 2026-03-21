export type CreateProductInput = {
  name: string;
  description: string;
  favorite: boolean;
};

export const productsApi = {
  create: async (data: CreateProductInput): Promise<unknown> => {
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
