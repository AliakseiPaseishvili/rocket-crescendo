import {
  ProductTranslationModel,
  ProductTranslationCreateInput,
  ProductCreateInput as ProductCreateInputBase,
  ProductUpdateInput as ProductUpdateInputBase,
} from "./app/generated/prisma/models";

export type { ProductModel } from "./app/generated/prisma/models/Product";
export type { ProductTranslationModel } from "./app/generated/prisma/models/ProductTranslation";

export type ProductWithTranslations = {
  id: number;
  favorite: boolean;
  translations: ProductTranslationModel[];
};

export type ProductCreateInput = Omit<
  ProductCreateInputBase,
  "translations"
> & {
  favorite?: boolean;
  translations: Omit<ProductTranslationCreateInput, "product">[];
};

export type ProductUpdateInput = ProductUpdateInputBase & {
  translations: Omit<ProductTranslationCreateInput, "product">[];
};

export type ProductFilter = {
  favorite?: boolean;
};
