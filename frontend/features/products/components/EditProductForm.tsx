'use client';

import { useTranslations } from 'next-intl';
import { FC } from 'react';

import { useProduct } from '../hooks';
import { EditProductFormContent } from './EditProductFormContent';

interface EditProductFormProps {
  id: number;
}

export const EditProductForm: FC<EditProductFormProps> = ({ id }) => {
  const tProduct = useTranslations('product');
  const { data: product, isLoading, error } = useProduct(id);

  if (isLoading) return <p className="text-muted-foreground">{tProduct('loadingProducts')}</p>;
  if (error || !product) return <p className="text-destructive">{tProduct('errorLoadingProducts')}</p>;

  return <EditProductFormContent product={product} />;
};
