import type {
  ProductSectionCreateInput,
  ProductSectionFilter,
  ProductSectionUpdateInput,
  ProductSectionWithTranslations,
} from "./types";
import prisma from "../../prisma/prisma";

const PRODUCT_SECTION_INCLUDE = {
  translations: true,
  lessons: { include: { translations: true, file: true } },
} as const;

export class ProductSectionRepository {
  async findAll(
    filter?: ProductSectionFilter,
  ): Promise<ProductSectionWithTranslations[]> {
    return prisma.productSection.findMany({
      where: filter?.productId ? { productId: filter.productId } : undefined,
      include: PRODUCT_SECTION_INCLUDE,
      orderBy: { order: "asc" },
    });
  }

  async findById(id: string): Promise<ProductSectionWithTranslations | null> {
    return prisma.productSection.findUnique({
      where: { id },
      include: PRODUCT_SECTION_INCLUDE,
    });
  }

  async create(
    data: ProductSectionCreateInput,
  ): Promise<ProductSectionWithTranslations> {
    return prisma.productSection.create({
      data: {
        productId: data.productId,
        order: data.order ?? 0,
        translations: { create: data.translations },
      },
      include: PRODUCT_SECTION_INCLUDE,
    });
  }

  async update(
    id: string,
    data: ProductSectionUpdateInput,
  ): Promise<ProductSectionWithTranslations> {
    return prisma.productSection.update({
      where: { id },
      data: {
        ...(data.order !== undefined && { order: data.order }),
        ...(data.translations?.length && {
          translations: { deleteMany: {}, create: data.translations },
        }),
      },
      include: PRODUCT_SECTION_INCLUDE,
    });
  }

  async delete(id: string): Promise<ProductSectionWithTranslations> {
    return prisma.productSection.delete({
      where: { id },
      include: PRODUCT_SECTION_INCLUDE,
    });
  }
}
