# files feature

File management feature — listing, uploading, and deleting images and videos stored in Cloudflare R2.

## Structure

```
files/
  components/
    FileList.tsx          # Admin list of all files with upload button
    FileCard.tsx          # Single file card: image preview or video icon, name, type badge, delete button
    UploadFileDialog.tsx  # Dialog with name input + file picker (image/video); builds FormData and calls useUploadFile
    index.ts              # Barrel export for components
  hooks/
    use-files.ts          # useQuery: fetch all files
    use-delete-file.ts    # useMutation: DELETE file by id, invalidates list
    use-upload-file.ts    # useMutation: builds FormData, POST via api.uploadFile, invalidates list
    index.ts              # Barrel export for hooks
  constants.ts            # FILES_QUERY_KEY
  index.ts                # Barrel export: FileList, FileCard, UploadFileDialog, hooks
```

## Query keys

| Constant | Value | Used by |
|---|---|---|
| `FILES_QUERY_KEY` | `'files'` | `useFiles`, `useDeleteFile`, `useUploadFile` |

## Key patterns

- **Upload flow** — `UploadFileDialog` collects a name string and a `File` object. `useUploadFile` builds a `FormData` internally (`file` + `name` fields) and calls `api.uploadFile({ body: formData })`. `executeRequest` detects `FormData` and skips JSON serialisation.
- **Image preview** — `FileCard` uses Next.js `<Image fill>` inside a `relative h-40` container. The R2 hostname must be listed in `remotePatterns` in `next.config.ts` (populated from `R2_PUBLIC_URL` env var).
- **Video placeholder** — videos show a `FileVideo` lucide icon; no `<video>` element is rendered in the list view.
- **Delete** — each `FileCard` owns its own `useDeleteFile` instance so `isPending` is isolated per card.

## API surface (`frontend/features/api/files.ts`)

| Method | Route | Description |
|---|---|---|
| `getFiles` | `GET /api/file` | List all files (optional `fileType` query filter) |
| `uploadFile` | `POST /api/file` | Upload a file (FormData: `file`, `name`) |
| `deleteFile` | `DELETE /api/file/:id` | Delete file by id |
