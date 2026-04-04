import type { FileCreateInput, FileFilter, FileUpdateInput, FileWithTranslations } from './types';
import prisma from '../../prisma/prisma';

export class FileRepository {
  async findAll(filter?: FileFilter): Promise<FileWithTranslations[]> {
    const where: FileFilter = {};
    if (filter) {
      if (filter.fileType) where.fileType = filter.fileType;
    }
    return prisma.file.findMany({
      where,
      include: { translations: true },
    });
  }

  async findById(id: number): Promise<FileWithTranslations | null> {
    return prisma.file.findUnique({
      where: { id },
      include: { translations: true },
    });
  }

  async create(data: FileCreateInput): Promise<FileWithTranslations> {
    return prisma.file.create({
      data: {
        fileId: data.fileId,
        fileUrl: data.fileUrl,
        fileType: data.fileType,
        translations: { create: data.translations },
      },
      include: { translations: true },
    });
  }

  async update(id: number, data: FileUpdateInput): Promise<FileWithTranslations> {
    return prisma.file.update({
      where: { id },
      data: {
        ...(data.translations?.length && {
          translations: { deleteMany: {}, create: data.translations },
        }),
      },
      include: { translations: true },
    });
  }

  async delete(id: number): Promise<FileWithTranslations> {
    return prisma.file.delete({
      where: { id },
      include: { translations: true },
    });
  }
}
