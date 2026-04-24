import type { FileFilter, FileModel, PaginatedFiles } from '@/backend/features/file';

import { HttpMethod, RequestApiType, RequestMap } from './types';

const FILE_API_ROUTES = {
  FILES: '/api/file',
  FILE: '/api/file/:id',
} as const;

export type FileApiTypes = {
  getFiles: RequestApiType<undefined, undefined, FileFilter | undefined, PaginatedFiles>;
  uploadFile: RequestApiType<FormData, undefined, undefined, FileModel>;
  updateFile: RequestApiType<{ name: string }, { id: string }, undefined, FileModel>;
  deleteFile: RequestApiType<undefined, { id: string }, undefined, void>;
};

export const FILE_REQUEST_MAP: RequestMap<FileApiTypes> = {
  getFiles: { url: FILE_API_ROUTES.FILES, method: HttpMethod.GET },
  uploadFile: { url: FILE_API_ROUTES.FILES, method: HttpMethod.POST },
  updateFile: { url: FILE_API_ROUTES.FILE, method: HttpMethod.PATCH },
  deleteFile: { url: FILE_API_ROUTES.FILE, method: HttpMethod.DELETE },
};
