# files feature

File management feature — listing, uploading, and deleting images and videos stored in Cloudflare R2.

## Structure

```
files/
  components/
    FileList.tsx          # Admin list of all files with upload button
    FileCard.tsx          # Single file card: image preview or FileVideoPlayer, name, type badge, delete button
    FileVideoPlayer.tsx   # Clickable video thumbnail button + fullscreen-on-mobile Dialog containing VideoPlayer
    FileUploadInput.tsx   # Controlled input: file picker button + name text input in one row; auto-fills name from filename
    UploadFileDialog.tsx  # Dialog wrapping FileUploadInput; delegates form state to useUploadFileForm
    index.ts              # Barrel export for components
  hooks/
    use-files.ts          # useQuery: fetch all files
    use-delete-file.ts    # useMutation: DELETE file by id, invalidates list
    use-upload-file.ts    # useMutation: builds FormData, POST via api.uploadFile, invalidates list
    use-upload-file-form.ts  # react-hook-form + Yup form for upload: name (required) + file (required); calls useUploadFile on submit
    index.ts              # Barrel export for hooks (useFiles, useDeleteFile, useUploadFile, useUploadFileForm)
  types.ts                # UploadFileFormValues interface { name: string; file?: File }
  constants.ts            # FILES_QUERY_KEY
  index.ts                # Barrel export: FileList, FileCard, UploadFileDialog, FileUploadInput, hooks
```

## Query keys

| Constant | Value | Used by |
|---|---|---|
| `FILES_QUERY_KEY` | `'files'` | `useFiles`, `useDeleteFile`, `useUploadFile` |

## Key patterns

- **Upload flow** — `UploadFileDialog` renders `FileUploadInput` inside a Dialog and delegates all form logic to `useUploadFileForm`. The hook wires react-hook-form + Yup validation and calls `useUploadFile` on submit. `useUploadFile` builds `FormData` (`file` + `name` fields) and calls `api.uploadFile({ body: formData })`; `executeRequest` detects `FormData` and skips JSON serialisation.
- **FileUploadInput** — a single controlled row: a hidden `<input type="file">` triggered by a `Paperclip` button, plus a visible name `<Input>`. When a file is chosen and the name field is empty, the filename (without extension) is auto-populated into the name field. Controlled via `useController` on both `name` and `file` fields of `UploadFileFormValues`.
- **Form types** — `UploadFileFormValues` (`{ name: string; file?: File }`) is defined in `types.ts`. Import it directly from `'../types'`; it is not re-exported from `hooks/index.ts`. `UploadFileDialog` casts `control as Control<UploadFileFormValues>` when passing to `FileUploadInput`.
- **Image preview** — `FileCard` uses Next.js `<Image fill>` inside a `relative h-40` container. The R2 hostname must be listed in `remotePatterns` in `next.config.ts` (populated from `R2_PUBLIC_URL` env var).
- **Video playback** — `FileCard` delegates the video thumbnail + modal entirely to `FileVideoPlayer`, passing `src` and `name`. `FileVideoPlayer` owns its own `open` state, the thumbnail `<button>`, and the `Dialog` containing `<VideoPlayer>` from `@/frontend/features/video-player`. The player is lazily mounted — video.js only initialises when the dialog opens.
- **`FileVideoPlayer` responsive modal** — on mobile the dialog overrides the default centred positioning (`top-0 left-0 translate-x-0 translate-y-0 h-full w-full rounded-none`) for true fullscreen. On `sm+` it restores centred layout with `max-w-[min(90vw,1200px)]` for a large desktop player.
- **Delete** — each `FileCard` owns its own `useDeleteFile` instance so `isPending` is isolated per card.

## API surface (`frontend/features/api/files.ts`)

| Method | Route | Description |
|---|---|---|
| `getFiles` | `GET /api/file` | List all files (optional `fileType` query filter) |
| `uploadFile` | `POST /api/file` | Upload a file (FormData: `file`, `name`) |
| `deleteFile` | `DELETE /api/file/:id` | Delete file by id |
