"use client";

import { useTranslations } from "next-intl";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/frontend/components/ui/carousel";
import { Product } from "@/frontend/features/products/components";
import { useProducts } from "@/frontend/features/products/hooks";

import { LandingSection } from "./LandingSection";
import { useCategoriesByIds } from "../../categories/hooks";

export const ShopSection = () => {
  const t = useTranslations("common");
  const { data: products } = useProducts({ favorite: false });
    const categoryIds = products?.map((p) => p.categoryId) ?? [];
    useCategoriesByIds(categoryIds);

  return (
    <LandingSection id="shop" titleKey="shop">
      {products && products.length > 0 ? (
        <Carousel className="mt-8 w-full max-w-xl">
          <CarouselContent>
            {products.map((product) => (
              <CarouselItem key={product.id}>
                <Product product={product} isHiddenActions className="p-4" />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ) : (
        products !== undefined && (
          <p className="mt-8 text-muted-foreground">{t("comingSoon")}</p>
        )
      )}
    </LandingSection>
  );
};
