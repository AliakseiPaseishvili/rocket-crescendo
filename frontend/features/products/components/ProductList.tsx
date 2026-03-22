'use client';

import { useTranslation } from 'react-i18next';

import { useProducts } from '../hooks';
import { CreateProductLink } from './CreateProductLink';
import { Product } from './Product';

export const ProductList = () => {
  const { t } = useTranslation('product');
  const { data: products, isPending, isError } = useProducts();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row items-center gap-2">
        <h1 className="text-3xl font-bold">{t('products')}</h1>
        <CreateProductLink />
      </div>

      {isPending && <p className="text-muted-foreground">{t('loadingProducts')}</p>}
      {isError && <p className="text-destructive">{t('errorLoadingProducts')}</p>}
      {!isPending && !isError && !products?.length && (
        <p className="text-muted-foreground">{t('noProducts')}</p>
      )}

      {!!products?.length && (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <Product key={product.id} product={product} />
          ))}
        </ul>
      )}
    </div>
  );
};
