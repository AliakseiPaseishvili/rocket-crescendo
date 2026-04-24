import type {
  CategoryCreateInput,
  CategoryFilter,
  CategoryUpdateInput,
  CategoryWhereInput,
  CategoryWithTranslations,
} from './types';
import prisma from '../../prisma/prisma';

export class CategoryRepository {
  async findAll(filter?: CategoryFilter): Promise<CategoryWithTranslations[]> {
    const where: CategoryWhereInput = {};
    if (filter) {
      if (filter.color) where.color = filter.color;
    }
    return prisma.category.findMany({
      where,
      include: { translations: true },
    });
  }

  async findById(id: string): Promise<CategoryWithTranslations | null> {
    return prisma.category.findUnique({
      where: { id },
      include: { translations: true },
    });
  }

  async findByIds(ids: string[]): Promise<CategoryWithTranslations[]> {
    return prisma.category.findMany({
      where: { id: { in: ids } },
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

  async update(id: string, data: CategoryUpdateInput): Promise<CategoryWithTranslations> {
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

  async delete(id: string): Promise<CategoryWithTranslations> {
    return prisma.category.delete({
      where: { id },
      include: { translations: true },
    });
  }
}
