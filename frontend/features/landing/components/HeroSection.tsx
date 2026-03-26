"use client";

import { Product } from "@/frontend/features/products/components/Product";
import { useProducts } from "@/frontend/features/products/hooks";

import { LandingSection } from "./LandingSection";

export const HeroSection = () => {
  const { data: favorites } = useProducts({ favorite: true });

  const featured = favorites?.[0];

  return (
    <LandingSection id="hero" titleKey="hero">
      {featured && (
        <div className="mt-8 w-full max-w-sm">
          <Product product={featured} isHiddenActions />
        </div>
      )}
    </LandingSection>
  );
};
