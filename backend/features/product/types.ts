import type { ProductFileRole } from "../../app/generated/prisma/enums";
import type {
  ProductTranslationCreateInput,
  ProductCreateInput as ProductCreateInputBase,
  ProductUpdateInput as ProductUpdateInputBase,
  ProductFileGetPayload,
  ProductGetPayload,
} from "../../app/generated/prisma/models";

export type {
  ProductModel,
  ProductWhereInput,
} from "../../app/generated/prisma/models/Product";
export type { ProductTranslationModel } from "../../app/generated/prisma/models/ProductTranslation";
export { ProductFileRole } from "../../app/generated/prisma/enums";

export type ProductFileItem = ProductFileGetPayload<{
  select: {
    id: true;
    role: true;
    file: {
      select: {
        id: true;
        fileId: true;
        fileUrl: true;
        fileType: true;
        name: true;
      };
    };
  };
}>;

export type ProductFileInput = {
  fileId: number;
  role: ProductFileRole;
};

export type ProductWithTranslations = ProductGetPayload<{
  include: {
    translations: true;
    productFiles: { include: { file: true } };
  };
}>;

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
