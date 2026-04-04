export type UploadResult = {
  fileId: string;
  fileUrl: string;
};

export interface FileStorageAdapter {
  upload(buffer: Buffer, key: string, contentType: string): Promise<UploadResult>;
  delete(fileId: string): Promise<void>;
}
