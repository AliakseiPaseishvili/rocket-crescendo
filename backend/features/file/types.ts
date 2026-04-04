import { FileType } from '../../app/generated/prisma/enums';
import {
  FileTranslationCreateInput,
  FileCreateInput as FileCreateInputBase,
  FileUpdateInput as FileUpdateInputBase,
} from '../../app/generated/prisma/models';

export type { FileModel } from '../../app/generated/prisma/models/File';
export type { FileTranslationModel } from '../../app/generated/prisma/models/FileTranslation';
export { FileType } from '../../app/generated/prisma/enums';

export type FileTranslationInput = Omit<FileTranslationCreateInput, 'file'>;

export type FileWithTranslations = {
  id: number;
  fileId: string;
  fileUrl: string;
  fileType: FileType;
  translations: FileTranslationInput[];
};

export type FileCreateInput = Omit<FileCreateInputBase, 'translations'> & {
  fileId: string;
  fileUrl: string;
  fileType: FileType;
  translations: FileTranslationInput[];
};

export type FileUpdateInput = FileUpdateInputBase & {
  translations?: FileTranslationInput[];
};

export type FileFilter = {
  fileType?: FileType;
};
