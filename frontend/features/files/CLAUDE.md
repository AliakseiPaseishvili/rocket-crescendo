# files feature

File management feature — listing, uploading, deleting, and picking images and videos stored in Cloudflare R2. Used exclusively in the admin panel, and by the product create/edit forms via `FilePickerDrawer`.

## Structure

```
files/
  components/
    FileList.tsx          # Admin list of all files: name/type filters + upload button + FileCard grid
    FileCard.tsx          # Single file card: image preview or FileVideoPlayer, name, type badge, delete button
    FileVideoPlayer.tsx   # shadcn Button thumbnail (ghost variant, h-40) + fullscreen-on-mobile Dialog containing VideoPlayer
    FileUploadInput.tsx   # Controlled input: hidden file picker triggered by a Paperclip Button + name Input in one row; auto-fills name from filename
    UploadFileDialog.tsx  # Dialog with Plus trigger button wrapping FileUploadInput; delegates form state to useUploadFileForm
    FilePickerDrawer.tsx  # Controlled right-side drawer for picking files from the library; used by product media selection; all UI text via useTranslations('file'); file grid items use shadcn Button (variant="outline", p-0, h-auto)
    index.ts              # Barrel export for components
  hooks/
    use-files.ts          # useQuery: fetch all files, accepts optional FileFilter (debounced)
    use-delete-file.ts    # useMutation: DELETE file by id, invalidates list
    use-upload-file.ts    # useMutation: builds FormData, POST via api.uploadFile, invalidates list
    use-upload-file-form.ts  # react-hook-form + Yup form for upload: name (required) + file (required); calls useUploadFile on submit
    index.ts              # Barrel export for hooks (useFiles, useDeleteFile, useUploadFile, useUploadFileForm)
  types.ts                # UploadFileFormValues interface { name: string; file?: File }
  constants.ts            # FILES_QUERY_KEY
  index.ts                # Barrel export: FileList, FileCard, UploadFileDialog, FilePickerDrawer, hooks
```

## Types

| Type | Shape |
|---|---|
| `UploadFileFormValues` | `{ name: string; file?: File }` — react-hook-form values for the upload form |
| `FileModel` | comes from `@/backend/features/file` — the shape returned by the API |
| `FileFilter` | comes from `@/backend/features/file` — optional filter `{ name?: string; fileType?: FileType }` passed to `getFiles` |

## Query keys

| Constant | Value | Used by |
|---|---|---|
| `FILES_QUERY_KEY` | `'files'` | `useFiles`, `useDeleteFile`, `useUploadFile` |

## Key patterns

- **`FilePickerDrawer`** — controlled right-side vaul drawer (`direction="right"`) for picking files from the uploaded library. Props: `open`, `onOpenChange`, `fileType` (`'IMAGE' | 'VIDEO'`), `maxSelection` (1 for single-pick, up to 8 for multi-pick), `alreadySelectedIds` (shown as disabled/grayed in the grid), `onConfirm(files: FileModel[])`. Layout: `DrawerHeader` with a search `Input` that filters via `useFiles`; scrollable 2-column grid of file buttons with a checkmark overlay when selected; `DrawerFooter` with a Select button (disabled until at least one file is chosen). On confirm, calls `onConfirm` then resets internal state and closes. On close without confirm, resets search and selection. For `maxSelection === 1`, clicking a card replaces the selection; for `maxSelection > 1`, it toggles up to the limit.
- **`FileList` filtering** — maintains local `nameFilter` and `fileTypeFilter` state; passes them as a `FileFilter` object to `useFiles`, which debounces the value before it becomes the TanStack Query key. The filter object is spread conditionally so empty strings / `'all'` don't pollute the query.
- **`FileCard` delete isolation** — each `FileCard` owns its own `useDeleteFile` instance so `isPending` is scoped per card; deleting one card never disables others.
- **`FileVideoPlayer` thumbnail** — uses the shared `Modal` component (`@/frontend/components/Modal`) with no `open`/`onOpenChange` props — Radix manages state internally (uncontrolled). The trigger is a ghost `Button` (`h-40 w-full bg-muted hover:bg-muted/70`). The `VideoPlayer` is lazily mounted (only rendered when the dialog opens).
- **`FileVideoPlayer` responsive modal** — responsive classes are passed via `contentClassName` / `headerClassName` / `titleClassName` props on `Modal`. On mobile the dialog goes edge-to-edge (`top-0 left-0 h-full w-full rounded-none`); on `sm+` it restores the centred panel (`max-w-[min(90vw,1200px)]`).
- **`FileUploadInput` auto-name** — a hidden `<input type="file">` is triggered by a Paperclip `Button`. When a file is picked and the name field is still empty, the filename (without extension) is auto-populated via `nameField.onChange`. Both `name` and `file` are controlled via `useController` from `UploadFileFormValues`.
- **`UploadFileDialog` form reset** — uses the shared `Modal` component with controlled state. `useUploadFileForm` accepts an `onSuccess` callback; `UploadFileDialog` passes `() => setOpen(false)`. On cancel, `handleOpenChange` calls `reset()` before `setOpen(false)` so the form is clean on next open.
- **Upload FormData** — `useUploadFile` manually builds `FormData` (`file` + `name` fields) and calls `api.uploadFile({ body: formData })`. `executeRequest` detects `FormData` and skips JSON serialisation / `Content-Type` header so the browser sets the multipart boundary automatically.
- **`UploadFileFormValues` import** — `types.ts` is not re-exported from `hooks/index.ts`. Import `UploadFileFormValues` directly from `'../types'`. `UploadFileDialog` casts `control as Control<UploadFileFormValues>` when passing to `FileUploadInput`.
- **Image preview** — `FileCard` uses Next.js `<Image fill>` inside a `relative h-40` container. The R2 hostname must be listed in `remotePatterns` in `next.config.ts` (populated from `R2_PUBLIC_URL`).

## API surface (`frontend/features/api/files.ts`)

| Method | Route | Description |
|---|---|---|
| `getFiles` | `GET /api/file` | List all files (optional `fileType` / `name` query filter) |
| `uploadFile` | `POST /api/file` | Upload a file (FormData: `file`, `name`) |
| `deleteFile` | `DELETE /api/file/:id` | Delete file by id |

## How to extend

### Adding a new field to the upload form

1. Add the field to `UploadFileFormValues` in `types.ts`.
2. Add a Yup validation rule in the `schema` inside `use-upload-file-form.ts`.
3. Add the corresponding `useController` call (or `register`) in `FileUploadInput.tsx` and render the new input.
4. Include the field in the `FormData` built inside `useUploadFile.ts`.
5. Update the backend `POST /api/file` route and `File.service.ts` to accept and persist the field.
6. Add the field to the Prisma schema and run `npx prisma generate`.
