import type { FileType } from "../../app/generated/prisma/enums";
import {
  ProductTranslationModel,
  ProductTranslationCreateInput,
  ProductCreateInput as ProductCreateInputBase,
  ProductUpdateInput as ProductUpdateInputBase,
} from "../../app/generated/prisma/models";

export type { ProductModel, ProductWhereInput } from "../../app/generated/prisma/models/Product";
export type { ProductTranslationModel } from "../../app/generated/prisma/models/ProductTranslation";

export type ProductFileRole = "MAIN_IMAGE" | "VIDEO" | "ADDITIONAL_IMAGE";

export type ProductFileItem = {
  id: number;
  role: ProductFileRole;
  file: {
    id: number;
    fileId: string;
    fileUrl: string;
    fileType: FileType;
    name: string;
  };
};

export type ProductFileInput = {
  fileId: number;
  role: ProductFileRole;
};

export type ProductWithTranslations = {
  id: number;
  favorite: boolean;
  categoryId: number;
  translations: ProductTranslationModel[];
  productFiles: ProductFileItem[];
};

export type ProductCreateInput = Omit<
  ProductCreateInputBase,
  "translations" | "category"
> & {
  favorite?: boolean;
  categoryId: number;
  translations: Omit<ProductTranslationCreateInput, "product">[];
  files?: ProductFileInput[];
};

export type ProductUpdateInput = ProductUpdateInputBase & {
  translations?: Omit<ProductTranslationCreateInput, "product">[];
  files?: ProductFileInput[];
};

export type ProductFilter = {
  favorite?: boolean;
};
