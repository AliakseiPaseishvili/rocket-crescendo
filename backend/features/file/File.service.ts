import { FileRepository } from './File.repository';
import type { FileStorageAdapter } from './FileStorage.Adapter';
import { S3StorageAdapter } from './S3Storage.Adapter';
import { FileType } from './types';
import type {
  FileCreateInput,
  FileFilter,
  FileUpdateInput,
  FileModel,
  FileUploadInput,
  PaginatedFiles,
} from './types';

export class FileService {
  private readonly repository: FileRepository;
  private readonly storage: FileStorageAdapter;

  constructor(storage: FileStorageAdapter = new S3StorageAdapter()) {
    this.repository = new FileRepository();
    this.storage = storage;
  }

  async getAll(filter?: FileFilter): Promise<PaginatedFiles> {
    return this.repository.findAll(filter);
  }

  async getById(id: string): Promise<FileModel> {
    const file = await this.repository.findById(id);
    if (!file) throw new Error(`File with id ${id} not found`);
    return file;
  }

  async upload(input: FileUploadInput): Promise<FileModel> {
    if (!input.name?.trim()) throw new Error('Name is required');

    const existing = await this.repository.findByName(input.name.trim());
    if (existing) throw new Error(`A file named "${input.name.trim()}" already exists`);

    const { file, name } = input;
    const contentType = file.type;
    const fileType = contentType.startsWith('image/') ? FileType.IMAGE : FileType.VIDEO;

    const dotIndex = file.name.lastIndexOf('.');
    const ext = dotIndex !== -1 ? file.name.slice(dotIndex + 1) : '';
    const folder = fileType === FileType.IMAGE ? 'images' : 'videos';
    const key = ext ? `${folder}/${name}.${ext}` : `${folder}/${name}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const { fileId, fileUrl } = await this.storage.upload(buffer, key, contentType);

    const data: FileCreateInput = {
      fileId,
      fileUrl,
      fileType,
      name,
    };
    return this.repository.create(data);
  }

  async update(id: string, data: FileUpdateInput): Promise<FileModel> {
    await this.getById(id);
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<FileModel> {
    const file = await this.getById(id);
    await this.storage.delete(file.fileId);
    return this.repository.delete(id);
  }
}
