import type {
  ProductSectionGetPayload,
  ProductSectionTranslationCreateInput,
} from "../../app/generated/prisma/models";

export type { ProductSectionModel } from "../../app/generated/prisma/models/ProductSection";
export type { ProductSectionTranslationModel } from "../../app/generated/prisma/models/ProductSectionTranslation";

export type ProductSectionWithTranslations = ProductSectionGetPayload<{
  include: {
    translations: true;
    lessons: {
      include: {
        translations: true;
        file: true;
      };
    };
  };
}>;

export type ProductSectionCreateInput = {
  productId: string;
  order?: number;
  translations: Omit<ProductSectionTranslationCreateInput, "section">[];
};

export type ProductSectionUpdateInput = {
  order?: number;
  translations?: Omit<ProductSectionTranslationCreateInput, "section">[];
};

export type ProductSectionFilter = {
  productId?: string;
};
