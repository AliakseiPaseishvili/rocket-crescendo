# VideoLesson Feature

Handles CRUD for individual video lessons inside a product section. Each lesson belongs to a `ProductSection` (via `sectionId`), has multilingual names via `VideoLessonTranslation`, and optionally references a `File` for the video asset.

## Structure

```
backend/features/video-lesson/
  VideoLesson.repository.ts  # DB access via Prisma; always includes translations + file via VIDEO_LESSON_INCLUDE; ordered by `order` asc
  VideoLesson.service.ts     # Business logic: sectionId required on create, translation validation, existence checks before update/delete
  types.ts                   # VideoLessonWithTranslations, VideoLessonCreateInput, VideoLessonUpdateInput, VideoLessonFilter
  index.ts                   # Barrel export — VideoLessonService (value); all types as export type
```

## Key concepts

- **Translations** — every lesson has one or more `VideoLessonTranslation` records (`name`, `language`). Always fetched via `VIDEO_LESSON_INCLUDE`.
- **File association** — `fileId` on the lesson is a nullable foreign key to `File.id`. The `File` record is never deleted automatically — only the association is cleared.
- **Order** — `order: Int @default(0)` on the model; repository uses `orderBy: { order: 'asc' }` on all list queries.
- **Cascade delete** — `VideoLesson` rows cascade-delete when the parent `ProductSection` is deleted.
- **Update strategy** — translations use full replace when provided. `fileId` supports explicit `null` to clear the video association; omitting `fileId` from the payload leaves it untouched. The repository checks `'fileId' in data` to distinguish "explicitly set to null" from "not provided".
- **`VIDEO_LESSON_INCLUDE` constant** — `{ translations: true, file: true }` — used by all four repository methods to guarantee a consistent return shape.
- **Validation** (in service, not repository):
  - `sectionId` is required on create.
  - At least one translation required; each must have a non-empty `name`.

## Types

| Type | Purpose |
|---|---|
| `VideoLessonWithTranslations` | `VideoLessonGetPayload<{ include: { translations: true; file: true } }>` — standard return shape; `file` is `null` when no video is attached |
| `VideoLessonCreateInput` | `{ sectionId: string; fileId?: string; order?: number; translations: { language: string; name: string }[] }` |
| `VideoLessonUpdateInput` | `{ fileId?: string \| null; order?: number; translations?: { language: string; name: string }[] }` — `fileId: null` explicitly clears the video association |
| `VideoLessonFilter` | `{ sectionId?: string }` — optional; only applied when present |

## Usage

```ts
import { VideoLessonService } from '@/backend/features/video-lesson';

const service = new VideoLessonService();

// Create a lesson with a video file
const lesson = await service.create({
  sectionId: 'section-uuid',
  fileId: 'file-uuid',
  order: 0,
  translations: [
    { language: 'en', name: 'What is Rocket Crescendo?' },
  ],
});

// Get all lessons for a section (ordered by `order` asc)
const lessons = await service.getAll({ sectionId: 'section-uuid' });

// Update translations only (file untouched)
await service.update(lesson.id, {
  translations: [{ language: 'en', name: 'Introduction' }],
});

// Clear the video file association
await service.update(lesson.id, { fileId: null });

// Delete
await service.delete(lesson.id);
```
