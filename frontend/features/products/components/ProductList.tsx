'use client';

import { useTranslation } from 'react-i18next';

import { useProducts } from '../hooks';

export const ProductList = () => {
  const { t } = useTranslation('product');
  const { data: products, isPending, isError } = useProducts();

  if (isPending) {
    return <p className="text-muted-foreground">{t('loadingProducts')}</p>;
  }

  if (isError) {
    return <p className="text-destructive">{t('errorLoadingProducts')}</p>;
  }

  if (!products?.length) {
    return <p className="text-muted-foreground">{t('noProducts')}</p>;
  }

  return (
    <ul className="flex flex-col gap-4">
      {products.map((product) => (
        <li
          key={product.id}
          className="flex flex-col gap-1 rounded-lg border border-border bg-muted p-4"
        >
          <span className="font-semibold text-foreground">{product.name}</span>
          <span className="text-sm text-muted-foreground">{product.description}</span>
          {product.favorite && (
            <span className="text-xs text-foreground">{t('favorite')}</span>
          )}
        </li>
      ))}
    </ul>
  );
};
