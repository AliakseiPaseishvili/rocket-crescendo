import type {
  ProductCreateInput,
  ProductFilter,
  ProductUpdateInput,
  ProductWhereInput,
  ProductWithTranslations,
} from "./types";
import prisma from "../../prisma/prisma";

const PRODUCT_INCLUDE = {
  translations: true,
  productFiles: { include: { file: true } },
} as const;

export class ProductRepository {
  async findAll(filter?: ProductFilter): Promise<ProductWithTranslations[]> {
    const where: ProductWhereInput = {};

    if (filter) {
      if (typeof filter.favorite === "boolean") {
        where.favorite = filter.favorite;
      }
      if (typeof filter.includeVideoLessons === "boolean") {
        where.includeVideoLessons = filter.includeVideoLessons;
      }
    }

    return prisma.product.findMany({
      where,
      include: PRODUCT_INCLUDE,
    });
  }

  async findById(id: string): Promise<ProductWithTranslations | null> {
    return prisma.product.findUnique({
      where: { id },
      include: PRODUCT_INCLUDE,
    });
  }

  async findByIds(ids: string[]): Promise<ProductWithTranslations[]> {
    if (!ids.length) return [];
    return prisma.product.findMany({
      where: { id: { in: ids } },
      include: PRODUCT_INCLUDE,
    });
  }

  async create(data: ProductCreateInput): Promise<ProductWithTranslations> {
    return prisma.product.create({
      data: {
        favorite: data.favorite ?? false,
        price: data.price ?? 5.0,
        includeVideoLessons: data.includeVideoLessons ?? false,
        categoryId: data.categoryId,
        translations: { create: data.translations },
        ...(data.files?.length && {
          productFiles: {
            create: data.files.map((f) => ({ fileId: f.fileId, role: f.role })),
          },
        }),
      },
      include: PRODUCT_INCLUDE,
    });
  }

  async update(
    id: string,
    data: ProductUpdateInput,
  ): Promise<ProductWithTranslations> {
    return prisma.product.update({
      where: { id },
      data: {
        ...(data.favorite !== undefined && { favorite: data.favorite }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.includeVideoLessons !== undefined && { includeVideoLessons: data.includeVideoLessons }),
        ...(data.translations?.length && {
          translations: { deleteMany: {}, create: data.translations },
        }),
        ...(data.files !== undefined && {
          productFiles: {
            deleteMany: {},
            ...(data.files.length > 0 && {
              create: data.files.map((f) => ({
                fileId: f.fileId,
                role: f.role,
              })),
            }),
          },
        }),
      },
      include: PRODUCT_INCLUDE,
    });
  }

  async delete(id: string): Promise<ProductWithTranslations> {
    return prisma.product.delete({
      where: { id },
      include: PRODUCT_INCLUDE,
    });
  }
}
