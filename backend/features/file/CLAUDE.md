# File Feature

Handles file uploads and management, backed by Cloudflare R2 (S3-compatible storage).

## Structure

```
backend/features/file/
  File.repository.ts      # DB access via Prisma (CRUD on File model)
  File.service.ts         # Business logic: upload, update, delete, getAll, getById
  FileStorage.Adapter.ts  # Interface: FileStorageAdapter + UploadResult type
  S3Storage.Adapter.ts    # Cloudflare R2 implementation of FileStorageAdapter
  types.ts                # Types: FileModel, FileCreateInput, FileUpdateInput, FileFilter, FileUploadInput, FileType enum
  index.ts                # Barrel export
```

## Key concepts

- **FileStorageAdapter** — interface for storage backends (`upload`, `delete`). Swap out `S3StorageAdapter` with any implementation.
- **S3StorageAdapter** — uploads/deletes from Cloudflare R2 using `@aws-sdk/client-s3`. Keys follow `images/<name>.<ext>` or `videos/<name>.<ext>`.
- **FileType** — enum from generated Prisma client: `IMAGE` or `VIDEO`, derived from the uploaded file's MIME type.
- `FileService` defaults to `S3StorageAdapter` but accepts any `FileStorageAdapter` via constructor injection.

## Environment variables (R2)

| Variable             | Purpose                          |
|----------------------|----------------------------------|
| `R2_ACCESS_KEY_ID`   | R2 access key                    |
| `R2_SECRET_ACCESS_KEY` | R2 secret key                  |
| `R2_BUCKET_NAME`     | R2 bucket name                   |
| `R2_PUBLIC_URL`      | Public base URL for served files |
| `R2_ROUTE`           | R2 S3-compatible endpoint URL    |

## Usage

```ts
import { FileService } from '@/backend/features/file';

const service = new FileService();

// Upload
const file = await service.upload({ file: formDataFile, name: 'my-image' });

// Get all images
const images = await service.getAll({ fileType: 'IMAGE' });

// Delete (removes from R2 + DB)
await service.delete(file.id);
```
