import { FileRepository } from './File.repository';
import type { FileStorageAdapter } from './FileStorage.Adapter';
import { S3StorageAdapter } from './S3Storage.Adapter';
import type {
  FileCreateInput,
  FileFilter,
  FileTranslationInput,
  FileType,
  FileUpdateInput,
  FileWithTranslations,
} from './types';

export type FileUploadInput = {
  buffer: Buffer;
  key: string;
  contentType: string;
  fileType: FileType;
  translations: FileTranslationInput[];
};

export class FileService {
  private readonly repository: FileRepository;
  private readonly storage: FileStorageAdapter;

  constructor(storage: FileStorageAdapter = new S3StorageAdapter()) {
    this.repository = new FileRepository();
    this.storage = storage;
  }

  async getAll(filter?: FileFilter): Promise<FileWithTranslations[]> {
    return this.repository.findAll(filter);
  }

  async getById(id: number): Promise<FileWithTranslations> {
    const file = await this.repository.findById(id);
    if (!file) throw new Error(`File with id ${id} not found`);
    return file;
  }

  async upload(input: FileUploadInput): Promise<FileWithTranslations> {
    if (!input.translations?.length) throw new Error('At least one translation is required');
    for (const t of input.translations) {
      if (!t.name?.trim()) throw new Error(`Name is required for language: ${t.language}`);
    }

    const { fileId, fileUrl } = await this.storage.upload(input.buffer, input.key, input.contentType);

    const data: FileCreateInput = {
      fileId,
      fileUrl,
      fileType: input.fileType,
      translations: input.translations,
    };
    return this.repository.create(data);
  }

  async update(id: number, data: FileUpdateInput): Promise<FileWithTranslations> {
    await this.getById(id);
    return this.repository.update(id, data);
  }

  async delete(id: number): Promise<FileWithTranslations> {
    const file = await this.getById(id);
    await this.storage.delete(file.fileId);
    return this.repository.delete(id);
  }
}
