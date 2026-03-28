import type {
  CategoryCreateInput,
  CategoryFilter,
  CategoryUpdateInput,
  CategoryWithTranslations,
} from './types';
import prisma from '../../prisma/prisma';

export class CategoryRepository {
  async findAll(filter?: CategoryFilter): Promise<CategoryWithTranslations[]> {
    const where: CategoryFilter = {};
    if (filter) {
      if (filter.color) where.color = filter.color;
    }
    return prisma.category.findMany({
      where,
      include: { translations: true },
    });
  }

  async findById(id: number): Promise<CategoryWithTranslations | null> {
    return prisma.category.findUnique({
      where: { id },
      include: { translations: true },
    });
  }

  async create(data: CategoryCreateInput): Promise<CategoryWithTranslations> {
    return prisma.category.create({
      data: {
        color: data.color,
        translations: { create: data.translations },
      },
      include: { translations: true },
    });
  }

  async update(id: number, data: CategoryUpdateInput): Promise<CategoryWithTranslations> {
    return prisma.category.update({
      where: { id },
      data: {
        ...(data.color !== undefined && { color: data.color }),
        ...(data.translations?.length && {
          translations: { deleteMany: {}, create: data.translations },
        }),
      },
      include: { translations: true },
    });
  }

  async delete(id: number): Promise<CategoryWithTranslations> {
    return prisma.category.delete({
      where: { id },
      include: { translations: true },
    });
  }
}
