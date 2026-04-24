import { DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_OFFSET } from './constants';
import type { FileCreateInput, FileFilter, FileUpdateInput, FileModel, FileWhereInput, PaginatedFiles } from './types';
import prisma from '../../prisma/prisma';

export class FileRepository {
  async findAll(filter?: FileFilter): Promise<PaginatedFiles> {
    const where: FileWhereInput = {};
    if (filter) {
      if (filter.fileType) where.fileType = filter.fileType;
      if (filter.name) where.name = { contains: filter.name, mode: 'insensitive' };
    }
    const offset = filter?.offset ?? DEFAULT_PAGINATION_OFFSET;
    const limit = filter?.limit ?? DEFAULT_PAGINATION_LIMIT;
    const [items, total] = await prisma.$transaction([
      prisma.file.findMany({ where, skip: offset, take: limit, orderBy: { id: 'desc' } }),
      prisma.file.count({ where }),
    ]);
    return { items, total, offset, limit };
  }

  async findById(id: string): Promise<FileModel | null> {
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

  async update(id: string, data: FileUpdateInput): Promise<FileModel> {
    return prisma.file.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
      },
    });
  }

  async delete(id: string): Promise<FileModel> {
    return prisma.file.delete({ where: { id } });
  }
}
