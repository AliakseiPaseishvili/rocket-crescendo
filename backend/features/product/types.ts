import {
  ProductTranslationModel,
  ProductTranslationCreateInput,
  ProductCreateInput as ProductCreateInputBase,
  ProductUpdateInput as ProductUpdateInputBase,
} from "../../app/generated/prisma/models";

export type { ProductModel, ProductWhereInput } from "../../app/generated/prisma/models/Product";
export type { ProductTranslationModel } from "../../app/generated/prisma/models/ProductTranslation";

export type ProductWithTranslations = {
  id: number;
  favorite: boolean;
  categoryId: number;
  translations: ProductTranslationModel[];
};

export type ProductCreateInput = Omit<
  ProductCreateInputBase,
  "translations" | "category"
> & {
  favorite?: boolean;
  categoryId: number;
  translations: Omit<ProductTranslationCreateInput, "product">[];
};

export type ProductUpdateInput = ProductUpdateInputBase & {
  translations?: Omit<ProductTranslationCreateInput, "product">[];
};

export type ProductFilter = {
  favorite?: boolean;
};
