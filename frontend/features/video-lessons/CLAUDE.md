# video-lessons feature

Admin feature for managing a product's video curriculum. When a product has `includeVideoLessons: true`, admins navigate to `/admin/products/:id/video-lessons` to create and organise **sections** (named, multilingual) and **video lessons** inside each section (named, multilingual + optional video file). Sections and lessons both support create, edit, and delete via modal dialogs.

## Structure

```
video-lessons/
  components/
    ProductSectionList.tsx          # Fetches all sections for a productId; renders header with "Add Section" button + list of ProductSectionCards; shows empty/loading states
    ProductSectionCard.tsx          # Collapsible card: section name + edit/delete actions in header; expands to show VideoLessonList for that section
    ProductSectionFormFields.tsx    # Shared form: translation tabs (one per language, name-only) + submit button; used by create and edit section modals
    CreateProductSectionModal.tsx   # Modal dialog with ProductSectionFormFields; wired to useCreateProductSectionForm; closes on success
    EditProductSectionModal.tsx     # Modal dialog with ProductSectionFormFields pre-filled; wired to useEditProductSectionForm; closes on success; trigger is a ghost Pencil icon button
    VideoLessonList.tsx             # Fetches lessons for a sectionId; renders list of VideoLessonCards + "Add Lesson" button at the bottom; indented under section
    VideoLessonCard.tsx             # Row: FileVideo icon + lesson name + file name + edit/delete actions; uses useDeleteVideoLesson for inline delete
    VideoLessonFormFields.tsx       # Shared form: translation tabs (name per language) + MediaPickerCard for video file + submit button; used by create and edit lesson modals
    CreateVideoLessonModal.tsx      # Modal dialog with VideoLessonFormFields; wired to useCreateVideoLessonForm; closes on success
    EditVideoLessonModal.tsx        # Modal dialog with VideoLessonFormFields pre-filled from lesson; wired to useEditVideoLessonForm; trigger is a ghost Pencil icon button
    LessonShareQrCode.tsx           # QR code (via qrcode.react QRCodeCanvas) of the lesson's public page URL; language tabs (en/fr/ru) swap the encoded URL; "Open lesson page" link + "Copy QR code" button (copies the canvas PNG to the clipboard)
    index.ts                        # Barrel export for all components
  hooks/
    use-product-sections.ts         # useQuery: fetch all sections for productId via GET /api/product-sections?productId=
    use-create-product-section.ts   # useMutation: POST new section, invalidates [PRODUCT_SECTIONS_QUERY_KEY, productId]
    use-update-product-section.ts   # useMutation: PATCH section by id, invalidates [PRODUCT_SECTIONS_QUERY_KEY, productId]
    use-delete-product-section.ts   # useMutation: DELETE section by id, invalidates [PRODUCT_SECTIONS_QUERY_KEY, productId]
    use-product-section-form-schema.ts  # useMemo-wrapped Yup schema: translations array, name min 2 chars
    use-create-product-section-form.ts  # react-hook-form + yupResolver; empty defaults; calls useCreateProductSection; resets and calls onSuccess after mutation
    use-edit-product-section-form.ts    # react-hook-form + yupResolver; pre-fills translations from section; calls useUpdateProductSection; calls onSuccess on success
    use-video-lessons.ts            # useQuery: fetch all lessons for sectionId via GET /api/video-lessons?sectionId=
    use-video-lesson.ts             # useQuery: fetch one lesson by id via GET /api/video-lessons/:id (used by the customer-facing lessons feature)
    use-create-video-lesson.ts      # useMutation: POST new lesson, invalidates [VIDEO_LESSONS_QUERY_KEY, sectionId]
    use-update-video-lesson.ts      # useMutation: PATCH lesson by id, invalidates [VIDEO_LESSONS_QUERY_KEY, sectionId]
    use-delete-video-lesson.ts      # useMutation: DELETE lesson by id, invalidates [VIDEO_LESSONS_QUERY_KEY, sectionId]
    use-video-lesson-form-schema.ts # useMemo-wrapped Yup schema: translations array (name min 2 chars) + nullable video file
    use-create-video-lesson-form.ts # react-hook-form; empty defaults; calls useCreateVideoLesson with sectionId + fileId from video; resets on success
    use-edit-video-lesson-form.ts   # react-hook-form; pre-fills translations + video from lesson.file; sends fileId: null to clear video
    index.ts                        # Barrel export for all hooks
  types.ts                          # ProductSectionFormValues, VideoLessonFormValues
  constants.ts                      # PRODUCT_SECTIONS_QUERY_KEY, VIDEO_LESSONS_QUERY_KEY
  index.ts                          # Barrel export: ProductSectionList (value); form types as export type; query key constants
```

## Types

| Type | Shape |
|---|---|
| `ProductSectionFormValues` | `{ translations: { language: SUPPORTED_LANGUAGE; name: string }[] }` |
| `VideoLessonFormValues` | `{ translations: { language: SUPPORTED_LANGUAGE; name: string }[]; video: FileModel \| null }` |

`ProductSectionWithTranslations` comes from `@/backend/features/product-section`. `VideoLessonWithTranslations` comes from `@/backend/features/video-lesson`. `FileModel` comes from `@/backend/features/file`.

## Query keys

| Constant | Value | Used by |
|---|---|---|
| `PRODUCT_SECTIONS_QUERY_KEY` | `'product-sections'` | `useProductSections`, `useCreateProductSection`, `useUpdateProductSection`, `useDeleteProductSection` |
| `VIDEO_LESSONS_QUERY_KEY` | `'video-lessons'` | `useVideoLessons`, `useVideoLesson`, `useCreateVideoLesson`, `useUpdateVideoLesson`, `useDeleteVideoLesson` |

Note: both query keys are scoped with a second key — `[PRODUCT_SECTIONS_QUERY_KEY, productId]` and `[VIDEO_LESSONS_QUERY_KEY, sectionId]` — so mutations only invalidate data for the relevant product or section.

## Key patterns

- **Scoped invalidation** — mutation hooks accept `productId` or `sectionId` and bake it into the query key they invalidate. This means editing section A does not refetch section B's lessons.
- **`useCreateProductSectionForm` / `useCreateVideoLessonForm` reset on success** — after a successful create mutation, the form resets to empty defaults and then calls `onSuccess()`. The modal passes `() => setOpen(false)` as `onSuccess`, so closing and resetting happen in the right order.
- **`useEditVideoLessonForm` sends `fileId: null` to clear the video** — the backend `VideoLessonUpdateInput` supports `fileId: string | null`. The form hook derives `video: lesson.file ?? null` as the default value; on submit it maps `video?.id ?? null` to `fileId`, so removing the file in the picker correctly sends a null to the API.
- **`ProductSectionCard` is collapsible** — local `expanded` state (`useState(true)`) shows/hides `VideoLessonList`. The expand toggle is a `<button>` inside the card header, separate from the edit/delete action buttons.
- **`VideoLessonFormFields` reuses `MediaPickerCard` from the products feature** — imported from `@/frontend/features/products/components`. This avoids duplicating the file picker UI and ensures consistent video-selection UX.
- **`usePickTranslation`** — used in `ProductSectionCard` and `VideoLessonCard` to display the current-locale name without accessing `translations[0]` directly.
- **Admin page is a server component** — `app/[lng]/(admin)/admin/products/[id]/video-lessons/page.tsx` awaits `params`, then renders `ProductSectionList` which is a client component. The server/client boundary lives at the feature component level.
- **"Manage Video Lessons" link** — rendered in `EditProductFormContent` only when `product.includeVideoLessons` is `true`. Navigates to `/admin/products/:id/video-lessons` via a next-intl `Link` wrapped in a `Button asChild`.
- **`LessonShareQrCode`** — rendered inside `EditLessonPanelContent` (edit-lesson panel only, since the lesson must already have an `id`). It builds the public lesson URL `${window.location.origin}/${lng}/books/${bookId}/lessons/${lessonId}` for each language in `supportedLngs`. `bookId === productId`, which `EditLessonPanelContent` reads from the admin route param via `useParams<{ id: string }>()` (the lesson object itself carries no `productId`). Language `Tabs` swap the active locale; the QR re-renders for that locale's URL. The "Open lesson page" link is a plain `<a target="_blank">` to the already-absolute, locale-prefixed URL (not a next-intl `Link`, which would re-prefix the current locale). "Copy QR code" grabs the `<canvas>` rendered by `QRCodeCanvas`, calls `canvas.toBlob`, and writes the PNG to the clipboard via `navigator.clipboard.write([new ClipboardItem(...)])`; failures (unsupported clipboard) are swallowed. i18n keys live under the `videoLesson` namespace: `lessonLink`, `openLessonPage`, `copyQrCode`, `qrCopied`.

## How to extend

### Adding a new field to video lessons (e.g. `duration`)

1. Add `duration?: number` to `VideoLessonFormValues` in [types.ts](types.ts).
2. Add the Yup rule in [hooks/use-video-lesson-form-schema.ts](hooks/use-video-lesson-form-schema.ts).
3. Add a default value in [hooks/use-create-video-lesson-form.ts](hooks/use-create-video-lesson-form.ts) and pre-fill from `lesson` in [hooks/use-edit-video-lesson-form.ts](hooks/use-edit-video-lesson-form.ts).
4. Add the form control to [components/VideoLessonFormFields.tsx](components/VideoLessonFormFields.tsx).
5. Add i18n keys to `en.json`, `fr.json`, `ru.json` under the `videoLesson` namespace.
6. Add `duration Int?` to `VideoLesson` in `backend/prisma/schema.prisma`, run `npx prisma migrate dev --name add_video_lesson_duration`, then `npx prisma generate`.
7. Update `VideoLessonCreateInput` and `VideoLessonUpdateInput` in `backend/features/video-lesson/types.ts`.
8. Update `frontend/features/api/video-lessons.ts` types if the API payload changes.
