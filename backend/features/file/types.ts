import { FileType } from '../../app/generated/prisma/enums';
import type { FileModel } from '../../app/generated/prisma/models/File';
import type { PaginatedItems, PaginationFilter } from '../../types';

export type { FileModel, FileWhereInput } from '../../app/generated/prisma/models/File';
export { FileType } from '../../app/generated/prisma/enums';

export type FileCreateInput = {
  fileId: string;
  fileUrl: string;
  fileType: FileType;
  name: string;
};

export type FileUpdateInput = {
  name?: string;
};

export type FileFilter = PaginationFilter & {
  fileType?: FileType;
  name?: string;
};

export type PaginatedFiles = PaginatedItems<FileModel>;

export type FileUploadInput = {
  file: File;
  name: string;
};
