'use client';

import { useTranslations } from 'next-intl';
import { FC } from 'react';

import { CreateProductSectionModal } from './CreateProductSectionModal';
import { ProductSectionCard } from './ProductSectionCard';
import { useProductSections } from '../hooks/use-product-sections';

interface ProductSectionListProps {
  productId: string;
}

export const ProductSectionList: FC<ProductSectionListProps> = ({ productId }) => {
  const tVl = useTranslations('videoLesson');
  const { data: sections, isLoading } = useProductSections(productId);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{tVl('sections')}</h2>
        <CreateProductSectionModal productId={productId} />
      </div>

      {isLoading && (
        <p className="text-sm text-muted-foreground">{tVl('sections')}&hellip;</p>
      )}
      {!isLoading && (!sections || sections.length === 0) && (
        <p className="text-sm text-muted-foreground">{tVl('noSections')}</p>
      )}
      {sections?.map((section) => (
        <ProductSectionCard key={section.id} section={section} productId={productId} />
      ))}
    </div>
  );
};
