import { FileType } from '../../app/generated/prisma/enums';

export type { FileModel } from '../../app/generated/prisma/models/File';
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

export type FileFilter = {
  fileType?: FileType;
};

export type FileUploadInput = {
  file: File;
  name: string;
};