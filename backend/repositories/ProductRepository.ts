import type {
  ProductCreateInput,
  ProductUpdateInput,
  ProductWithTranslations,
} from "@/backend/types";

import prisma from "../prisma/prisma";

export class ProductRepository {
  async findAll(): Promise<ProductWithTranslations[]> {
    return prisma.product.findMany({ include: { translations: true } });
  }

  async findFavorites(): Promise<ProductWithTranslations[]> {
    return prisma.product.findMany({
      where: { favorite: true },
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
