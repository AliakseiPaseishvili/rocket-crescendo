# File Feature

Handles file uploads and management, backed by Cloudflare R2 (S3-compatible storage). Supports paginated listing, filtering by type/name, upload, rename, and deletion (removes from both R2 and DB).

## Structure

```
backend/features/file/
  File.repository.ts      # DB access via Prisma; findAll returns PaginatedFiles via $transaction (items + count)
  File.service.ts         # Business logic: unique-name enforcement on upload, coordinated delete (R2 + DB)
  FileStorage.Adapter.ts  # Interface: FileStorageAdapter (upload, delete) + UploadResult type
  S3Storage.Adapter.ts    # Cloudflare R2 implementation; key = "images/<name>.<ext>" or "videos/<name>.<ext>"
  types.ts                # FileModel, FileCreateInput, FileUpdateInput, FileFilter, FileUploadInput, PaginatedFiles, FileType
  constants.ts            # DEFAULT_PAGINATION_OFFSET, DEFAULT_PAGINATION_LIMIT, MAX_PAGINATION_LIMIT
  index.ts                # Barrel export
```

## Key concepts

- **Paginated list** — `findAll` always returns `PaginatedFiles` (alias for `PaginatedItems<FileModel>` from `backend/types.ts`). Defaults: `offset=0`, `limit=20`, ordered by `id desc`. Items and total count are fetched in a single Prisma `$transaction`.
- **`FileFilter` uses intersection** — `FileFilter = PaginationFilter & { fileType?: FileType; name?: string }`. `PaginationFilter` (`{ offset?, limit? }`) comes from `backend/types.ts` — pagination fields are not duplicated into the feature's own types.
- **`PaginatedFiles` is a type alias** — `PaginatedFiles = PaginatedItems<FileModel>`. The `PaginatedItems<T>` generic lives in `backend/types.ts` and is reused across features.
- **FileType derivation** — `upload()` infers `IMAGE` or `VIDEO` from the uploaded file's MIME type (`contentType.startsWith('image/')`); never set by the caller.
- **R2 key as fileId** — `fileId` stored in DB is the R2 object key (e.g. `images/hero.jpg`). `delete()` passes `file.fileId` directly to `storage.delete()`.
- **Unique names** — `upload()` calls `repository.findByName()` before uploading; throws if a file with the same name exists. Surfaces as HTTP 400 from the API route.
- **Storage abstraction** — `FileService` accepts any `FileStorageAdapter` via constructor injection; defaults to `S3StorageAdapter`. Swap for tests without touching service logic.
- **Validation** (in service, not repository):
  - `upload()`: name must be non-empty; name must be globally unique.
  - `update()` / `delete()`: calls `getById()` first — throws `File with id ${id} not found` if missing.

## Types

| Type | Purpose |
|---|---|
| `FileModel` | `{ id: number; fileId: string; fileUrl: string; fileType: FileType; name: string }` — Prisma DB row |
| `FileFilter` | `PaginationFilter & { fileType?: FileType; name?: string }` — passed to `getAll()` and the API route |
| `PaginatedFiles` | `PaginatedItems<FileModel>` → `{ items: FileModel[]; total: number; offset: number; limit: number }` |
| `FileCreateInput` | `{ fileId, fileUrl, fileType, name }` — internal, built inside `upload()` |
| `FileUpdateInput` | `{ name?: string }` — only `name` is updatable |
| `FileUploadInput` | `{ file: File; name: string }` — caller-facing input to `upload()` |
| `UploadResult` | `{ fileId: string; fileUrl: string }` — returned by `FileStorageAdapter.upload()` |

## Constants

| Constant | Value | Used by |
|---|---|---|
| `DEFAULT_PAGINATION_OFFSET` | `0` | `File.repository.ts` `findAll` fallback |
| `DEFAULT_PAGINATION_LIMIT` | `20` | `File.repository.ts` `findAll` fallback |
| `MAX_PAGINATION_LIMIT` | `100` | `app/api/file/route.ts` cap on `limit` param |

## Environment variables (R2)

| Variable | Purpose |
|---|---|
| `R2_ACCESS_KEY_ID` | R2 access key |
| `R2_SECRET_ACCESS_KEY` | R2 secret key |
| `R2_BUCKET_NAME` | R2 bucket name |
| `R2_PUBLIC_URL` | Public base URL for served files |
| `R2_ROUTE` | R2 S3-compatible endpoint URL |

## Usage

```ts
import { FileService } from '@/backend/features/file';

const service = new FileService();

// Upload (name must be unique; fileType inferred from MIME)
const file = await service.upload({ file: formDataFile, name: 'hero-banner' });

// Get paginated list (all filters optional; defaults offset=0, limit=20)
const page = await service.getAll({ fileType: 'IMAGE', offset: 20, limit: 20 });
// → { items: FileModel[], total: number, offset: 20, limit: 20 }

// Get by ID
const file = await service.getById(3);

// Rename
await service.update(3, { name: 'hero-banner-v2' });

// Delete (removes from R2 then DB)
await service.delete(3);
```

## API query params (`GET /api/file`)

| Param | Type | Default | Cap |
|---|---|---|---|
| `offset` | integer ≥ 0 | `0` | — |
| `limit` | integer 1–100 | `20` | `MAX_PAGINATION_LIMIT` (100) |
| `fileType` | `IMAGE` \| `VIDEO` | — | — |
| `name` | string (partial, case-insensitive) | — | — |
