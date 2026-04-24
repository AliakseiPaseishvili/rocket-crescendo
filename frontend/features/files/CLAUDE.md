# files feature

File management feature — listing, uploading, renaming, deleting, and picking images and videos stored in Cloudflare R2. Used exclusively in the admin panel, and by the product create/edit forms via `FilePickerDrawer`.

## Structure

```
files/
  components/
    FileList.tsx              # Admin list of all files: name/type filters + upload button + FileCard grid + "Load more" button
    FileCard.tsx              # Single file card: delegates name editing and delete to FileCardNameEditor, owns useDeleteFile + useUpdateFile, renders image/video preview and type badge
    FileCardNameEditor.tsx    # Self-contained name editor + delete button: view mode (CardTitle + Pencil + Trash2 buttons) or edit mode (Input + Check/X buttons); manages editing/value/inputRef state internally; props: name, onSave, onDelete, isSaving, disabled
    FileVideoPlayer.tsx       # shadcn Button thumbnail (ghost variant, h-40) + fullscreen-on-mobile Dialog containing VideoPlayer
    FileUploadInput.tsx       # Controlled input: hidden file picker triggered by a Paperclip Button + name Input in one row; auto-fills name from filename
    UploadFileDialog.tsx      # Dialog with Plus trigger button wrapping FileUploadInput; delegates form state to useUploadFileForm
    FilePickerDrawer.tsx      # Controlled right-side drawer for picking files from the library; used by product media selection; shows "Load more" when more pages exist; renders items via FilePickerItem
    FilePickerItem.tsx        # Single selectable file tile inside FilePickerDrawer: image preview or video icon, file name, selected ring + checkmark, disabled/grayed state for already-selected files
    index.ts                  # Barrel export for components
  hooks/
    use-files.ts              # useOffsetPagination: fetch paginated files, accepts optional FileFilter (debounced); returns { items, fetchNextPage, queryProps }
    use-delete-file.ts        # useMutation: DELETE file by id, invalidates list
    use-update-file.ts        # useMutation: PATCH file name by id, invalidates list
    use-upload-file.ts        # useMutation: builds FormData, POST via api.uploadFile, invalidates list
    use-upload-file-form.ts   # react-hook-form + Yup form for upload: name (required) + file (required); calls useUploadFile on submit
    index.ts                  # Barrel export for hooks
  types.ts                    # UploadFileFormValues
  constants.ts                # FILES_QUERY_KEY
  index.ts                    # Barrel export: FileList, FileCard, UploadFileDialog, FilePickerDrawer, hooks
```

## Types

| Type | Shape |
|---|---|
| `UploadFileFormValues` | `{ name: string; file?: File }` — react-hook-form values for the upload form |
| `FileModel` | comes from `@/backend/features/file` — the shape returned by the API |
| `FileFilter` | comes from `@/backend/features/file` — `PaginationFilter & { name?: string; fileType?: FileType }` |
| `PaginatedFiles` | comes from `@/backend/features/file` — `PaginatedItems<FileModel>` → `{ items, total, offset, limit }` |

## Query keys

| Constant | Value | Used by |
|---|---|---|
| `FILES_QUERY_KEY` | `'files'` | `useFiles`, `useDeleteFile`, `useUpdateFile`, `useUploadFile` |

## Key patterns

- **`useFiles` return shape** — delegates to `useOffsetPagination` from `@/frontend/features/react-query`. Returns `{ items, fetchNextPage, queryProps }`. Consumers destructure `queryProps` for status flags: `const { items, fetchNextPage, queryProps: { isPending, isError, hasNextPage, isFetchingNextPage } } = useFiles(filter)`. The `fetchNextPage` callback is pre-guarded (skips the call when `isFetching || !hasNextPage`) so it can be bound directly to a button `onClick`.

- **`FileList` pagination** — maintains `nameFilter` and `fileTypeFilter` state passed as a `FileFilter` to `useFiles` (debounced). Shows a centred "Load more" button when `hasNextPage` is true; button is disabled while `isFetchingNextPage`.

- **`FilePickerDrawer` pagination** — same pattern: "Load more" button appears below the grid inside the scrollable area; uses `t('loadMore')` / `t('loading')` for button text.

- **`FilePickerItem`** — extracted presentational component used by `FilePickerDrawer`. Renders a single selectable `<li>` tile. Props: `file`, `isSelected`, `isAlreadySelected`, `onToggle`. Selection state is derived and passed in by the parent drawer; the item itself is stateless. `isAlreadySelected` disables the button and reduces opacity; `isSelected` shows a primary-colored ring and checkmark badge.

- **`FileCardNameEditor`** — self-contained component that owns both the rename and delete interactions for a card header. Props: `name`, `onSave(name: string)`, `onDelete()`, `isSaving`, `disabled`. Manages `editing`, `value`, and `inputRef` internally. View mode: `CardTitle` + Pencil button + Trash2 button — both Pencil and Trash2 are disabled when `disabled` is true. Edit mode: `Input` + Check/X buttons (Trash2 is hidden while editing). Enter confirms; Escape cancels. Skips `onSave` if value is empty or unchanged.

- **`FileCard` delete isolation** — each `FileCard` owns its own `useDeleteFile` and `useUpdateFile` instances so `isPending` is scoped per card; mutating one card never disables others. `FileCard` passes both `onSave` and `onDelete` callbacks into `FileCardNameEditor`, keeping mutation logic in `FileCard` and UI in `FileCardNameEditor`.

- **`FilePickerDrawer` selection** — controlled right-side vaul drawer (`direction="right"`). Props: `open`, `onOpenChange`, `fileType`, `maxSelection` (1 for single-pick, up to 8 for multi), `alreadySelectedIds: string[]` (UUID strings, shown as disabled/grayed), `onConfirm(files: FileModel[])`. For `maxSelection === 1`, clicking replaces selection; for `> 1`, toggles up to the limit. Resets search and selection on close without confirm.

- **`FileVideoPlayer` responsive modal** — uses the shared `Modal` component (uncontrolled). Trigger is a ghost `Button` (`h-40`). On mobile the dialog goes edge-to-edge; on `sm+` it restores a centred panel (`max-w-[min(90vw,1200px)]`). `VideoPlayer` is lazily mounted (only rendered when the dialog opens).

- **`FileUploadInput` auto-name** — when a file is picked and the name field is still empty, the filename (without extension) is auto-populated via `nameField.onChange`. Both `name` and `file` are controlled via `useController`.

- **Upload FormData** — `useUploadFile` builds `FormData` (`file` + `name`) and calls `api.uploadFile({ body: formData })`. `executeRequest` detects `FormData` and skips JSON serialisation / `Content-Type` so the browser sets the multipart boundary automatically.

- **`UploadFileDialog` form reset** — uses controlled `Modal`. `useUploadFileForm` accepts an `onSuccess` callback; `UploadFileDialog` passes `() => setOpen(false)`. On cancel, `handleOpenChange` calls `reset()` before closing.

## API surface (`frontend/features/api/files.ts`)

| Method | Route | Description |
|---|---|---|
| `getFiles` | `GET /api/file` | List files with offset pagination (returns `PaginatedFiles`) |
| `uploadFile` | `POST /api/file` | Upload a file (FormData: `file`, `name`) |
| `updateFile` | `PATCH /api/file/:id` | Update file name (`{ name: string }` JSON body, returns `FileModel`) |
| `deleteFile` | `DELETE /api/file/:id` | Delete file by id |

## How to extend

### Adding offset pagination to a new feature

1. Import `useOffsetPagination` from `@/frontend/features/react-query`.
2. Pass `queryKey` and `queryFn(offset) => Promise<PaginatedItems<T>>`.
3. Destructure `{ items, fetchNextPage, queryProps }` in the consumer component.
4. Render a "Load more" button conditioned on `queryProps.hasNextPage`.

### Adding a new field to the upload form

1. Add the field to `UploadFileFormValues` in `types.ts`.
2. Add a Yup validation rule in the `schema` inside `use-upload-file-form.ts`.
3. Add the `useController` call in `FileUploadInput.tsx` and render the input.
4. Include the field in the `FormData` built inside `use-upload-file.ts`.
5. Update the backend `POST /api/file` route and `File.service.ts` to accept and persist it.
6. Add the field to the Prisma schema and run `npx prisma generate`.
