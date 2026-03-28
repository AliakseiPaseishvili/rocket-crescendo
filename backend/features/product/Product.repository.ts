import type {
  ProductCreateInput,
  ProductFilter,
  ProductUpdateInput,
  ProductWithTranslations,
} from "./types";
import prisma from "../../prisma/prisma";

export class ProductRepository {
  async findAll(filter?: ProductFilter): Promise<ProductWithTranslations[]> {
    const where: ProductFilter = {};

    if (filter) {
      if (typeof filter.favorite === "boolean") {
        where.favorite = filter.favorite;
      }
    }

    return prisma.product.findMany({
      where,
      include: { translations: true },
    });
  }

  async findById(id: number): Promise<ProductWithTranslations | null> {
    return prisma.product.findUnique({
      where: { id },
      include: { translations: true },
    });
  }

  async create(data: ProductCreateInput): Promise<ProductWithTranslations> {
    return prisma.product.create({
      data: {
        favorite: data.favorite ?? false,
        categoryId: data.categoryId,
        translations: { create: data.translations },
      },
      include: { translations: true },
    });
  }

  async update(
    id: number,
    data: ProductUpdateInput,
  ): Promise<ProductWithTranslations> {
    return prisma.product.update({
      where: { id },
      data: {
        ...(data.favorite !== undefined && { favorite: data.favorite }),
        ...(data.translations?.length && {
          translations: { deleteMany: {}, create: data.translations },
        }),
      },
      include: { translations: true },
    });
  }

  async delete(id: number): Promise<ProductWithTranslations> {
    return prisma.product.delete({
      where: { id },
      include: { translations: true },
    });
  }
}
