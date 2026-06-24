# lessons feature

Customer-facing viewer for a product's video curriculum. Normal (non-admin) users open `/{lng}/books/{bookId}/lessons` to browse all sections and their lessons, then open `/{lng}/books/{bookId}/lessons/{lessonId}` to watch a single lesson's video (autoplaying). Note: **bookId = productId**. This is the read-only counterpart to the admin [video-lessons](../video-lessons/CLAUDE.md) feature — it reuses that feature's query hooks and the [video-player](../video-player/CLAUDE.md) `VideoPlayer` rather than duplicating data access.

## Structure

```
lessons/
  components/
    LessonsOverview.tsx     # Page body for the overview route; fetches all sections for a bookId and renders a LessonSectionGroup per section; handles loading + empty states
    LessonSectionGroup.tsx  # One section: localized section heading + list of LessonLinks for section.lessons (lessons are nested in the section payload — no extra request)
    LessonLink.tsx          # next-intl Link to a single lesson; localized lesson name + FileVideo icon
    LessonPlayer.tsx        # Page body for the player route; fetches one lesson and renders VideoPlayer (autoplay + muted) inside a responsive min-height wrapper; shows a Skeleton placeholder while loading; back link to the overview
    index.ts                # Barrel export for all components
  index.ts                  # Barrel export: LessonsOverview, LessonPlayer (the two page entry points)
```

There are no `hooks/`, `types.ts`, or `constants.ts` — this feature is pure presentation and borrows everything else.

## Data sources (reused, not redefined)

- **`useProductSections(bookId)`** from `@/frontend/features/video-lessons/hooks` — `GET /api/product-sections?productId=`. Returns `ProductSectionWithTranslations[]`, each section already including its `lessons` (with `file` + `translations`). `LessonsOverview` needs this **single** request to render the whole tree.
- **`useVideoLesson(lessonId)`** from `@/frontend/features/video-lessons/hooks` — `GET /api/video-lessons/:id`. Returns one `VideoLessonWithTranslations` (with `file` + `translations`). Used by `LessonPlayer`.
- **`VideoPlayer`** from `@/frontend/features/video-player` — video.js wrapper.
- **`usePickTranslation`** from `@/frontend/features/translation` — picks the current-locale translation (falls back to default locale, then first).
- **`Link`** from `@/frontend/features/translation/i18n/navigation` — language-prefixed links; hrefs are written **without** the `/{lng}` prefix.

`ProductSectionWithTranslations` comes from `@/backend/features/product-section`; `VideoLessonWithTranslations` from `@/backend/features/video-lesson`.

## Key patterns

- **Two server pages, four client components** — the App Router pages (`app/[lng]/(main)/books/[bookId]/lessons/page.tsx` and `.../[lessonId]/page.tsx`) are server components that `await params` and render `LessonsOverview` / `LessonPlayer`. The server/client boundary sits at the feature component (each component carries `'use client'`).
- **Overview makes one fetch** — lessons are read from the nested `section.lessons` returned by `useProductSections`, so `LessonSectionGroup` does not call `useVideoLessons` per section. The empty state shows `lessons.noLessons` when there are no sections or no section has any lessons.
- **Autoplay implies muted** — `LessonPlayer` renders `<VideoPlayer src={lesson.file.fileUrl} autoplay muted controls />`. Browsers block autoplay with sound, so `muted` is required for playback to actually start; the user can unmute via the controls.
- **Defensive lesson rendering** — `LessonPlayer` shows `lessons.lessonNotFound` when the query returns nothing and `lessons.videoUnavailable` when `lesson.file` is null (a lesson can exist without a video file). `LessonLink` displays `'—'` if a translation is missing.
- **Loading skeleton + responsive player frame** — while `useVideoLesson` is loading, `LessonPlayer` renders `Skeleton` placeholders (a title bar plus an `aspect-video` block) instead of plain `lessons.loading` text. Both the skeleton and the real `VideoPlayer` sit inside a responsive min-height wrapper (`min-h-50 sm:min-h-80 lg:min-h-120`) so the layout doesn't jump between the loading and loaded states. `Skeleton` comes from `@/frontend/components/ui/skeleton`.
- **i18n** — all copy lives under the `lessons` namespace in `frontend/features/translation/messages/{en,fr,ru}.json`: `title`, `loading`, `noLessons`, `backToLessons`, `lessonNotFound`, `videoUnavailable`.

## How to extend

### Showing lesson metadata (e.g. duration) on the overview

1. Add the field to `VideoLesson` in `backend/prisma/schema.prisma`, run `npx prisma migrate dev` + `npx prisma generate` (this flows into `VideoLessonWithTranslations`).
2. Render it in `components/LessonLink.tsx` (overview) and/or `components/LessonPlayer.tsx` (player) — both already receive the full lesson object.
3. Add any new copy under the `lessons` namespace in all three message files.

### Gating access (e.g. only when the product includes video lessons)

`Product.includeVideoLessons` already exists. Fetch the product in the page (or in `LessonsOverview` via `useProduct`) and short-circuit to a not-available state when it is `false`.
