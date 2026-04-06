import type { FileCreateInput, FileFilter, FileUpdateInput, FileModel } from './types';
import prisma from '../../prisma/prisma';

export class FileRepository {
  async findAll(filter?: FileFilter): Promise<FileModel[]> {
    const where: FileFilter = {};
    if (filter) {
      if (filter.fileType) where.fileType = filter.fileType;
    }
    return prisma.file.findMany({ where });
  }

  async findById(id: number): Promise<FileModel | null> {
    return prisma.file.findUnique({ where: { id } });
  }

  async findByName(name: string): Promise<FileModel | null> {
    return prisma.file.findFirst({ where: { name } });
  }

  async create(data: FileCreateInput): Promise<FileModel> {
    return prisma.file.create({
      data: {
        fileId: data.fileId,
        fileUrl: data.fileUrl,
        fileType: data.fileType,
        name: data.name,
      },
    });
  }

  async update(id: number, data: FileUpdateInput): Promise<FileModel> {
    return prisma.file.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
      },
    });
  }

  async delete(id: number): Promise<FileModel> {
    return prisma.file.delete({ where: { id } });
  }
}
