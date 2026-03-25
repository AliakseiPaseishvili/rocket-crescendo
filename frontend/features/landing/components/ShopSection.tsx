'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/frontend/components/ui/carousel';
import { Product } from '@/frontend/features/products/components';
import { useProducts } from '@/frontend/features/products/hooks';

import { LandingSection } from './LandingSection';

export const ShopSection = () => {
  const { data: products } = useProducts();

  const nonFavorites = products?.filter((p) => !p.favorite) ?? [];

  return (
    <LandingSection id="shop" titleKey="shop">
      {nonFavorites.length > 0 && (
        <Carousel className="mt-8 w-full max-w-xl">
          <CarouselContent>
            {nonFavorites.map((product) => (
              <CarouselItem key={product.id}>
                <Product product={product} isHiddenActions />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}
    </LandingSection>
  );
};
