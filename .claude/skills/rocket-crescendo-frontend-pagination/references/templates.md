# Frontend Offset Pagination Templates

Substitute `<Entity>` (PascalCase), `<entity>` (camelCase/kebab for paths), `<feature>` (feature folder name), `<Model>` (the response model type), `<Filter>` (the existing filter type), `<namespace>` (translation namespace), and `<List>` (the list component name) throughout.

---

## 1. `frontend/features/api/<resource>.ts` — update response type

Change the list method's response type from `<Model>[]` to `Paginated<Entity>`:

```ts
import type { <Filter>, <Model>, Paginated<Entity> } from '@/backend/features/<entity>';

export type <Entity>ApiTypes = {
  get<Entity>s: RequestApiType<undefined, undefined, <Filter> | undefined, Paginated<Entity>>;
  // ... other methods unchanged ...
};
```

---

## 2. `frontend/features/<feature>/hooks/use-<feature>.ts` — replace useQuery

```ts
'use client';

import type { <Filter> } from '@/backend/features/<entity>';
import { api } from '@/frontend/features/api';
import { useDebounce } from '@/frontend/features/hooks';
import { useOffsetPagination } from '@/frontend/features/react-query';

import { <FEATURE>_QUERY_KEY } from '../constants';

export function use<Entity>s(filter?: Omit<<Filter>, 'offset'>) {
  const debouncedFilter = useDebounce(filter);

  return useOffsetPagination({
    queryKey: [<FEATURE>_QUERY_KEY, debouncedFilter],
    queryFn: (offset) => api.get<Entity>s({ query: { ...debouncedFilter, offset } }),
  });
}
```

> If the hook does not use `useDebounce`, omit it and pass `filter` directly to `queryKey` and `queryFn`.

---

## 3. Consumer component — destructuring update

Replace the old `useQuery` destructuring:

```ts
// Before
const { data: items, isPending, isError } = use<Entity>s(filter);
```

With the new shape:

```ts
// After
const {
  items,
  fetchNextPage,
  queryProps: { isPending, isError, hasNextPage, isFetchingNextPage },
} = use<Entity>s(filter);
```

If the hook was called with a default `[]` fallback, replace it with nullish coalescing on `items`:

```ts
// Before (e.g. in a picker)
const { data: items = [], isPending } = use<Entity>s(filter);

// After
const { items: rawItems, fetchNextPage, queryProps: { isPending, hasNextPage, isFetchingNextPage } } = use<Entity>s(filter);
const items = rawItems ?? [];
```

---

## 4. "Load more" button — full-page list

Add below the grid, conditioned on `hasNextPage`:

```tsx
{hasNextPage && (
  <Button
    variant="outline"
    onClick={() => fetchNextPage()}
    disabled={isFetchingNextPage}
    className="self-center"
  >
    {isFetchingNextPage ? t('<namespace>.loadingFiles') : t('<namespace>.loadMore')}
  </Button>
)}
```

> Use whatever loading-state key already exists in the namespace (e.g. `loadingFiles`, `loading`).

---

## 5. "Load more" button — drawer / picker

Add inside the scrollable area, below the grid:

```tsx
{hasNextPage && (
  <Button
    variant="outline"
    size="sm"
    onClick={() => fetchNextPage()}
    disabled={isFetchingNextPage}
    className="mt-4 w-full"
  >
    {isFetchingNextPage ? t('<namespace>.loading') : t('<namespace>.loadMore')}
  </Button>
)}
```

---

## 6. Translation keys — all three locale files

Add under the existing feature namespace. Always update all three files in one change.

**`messages/en.json`**
```json
"<namespace>": {
  // ... existing keys ...
  "loadMore": "Load more"
}
```

**`messages/fr.json`**
```json
"<namespace>": {
  // ... existing keys ...
  "loadMore": "Charger plus"
}
```

**`messages/ru.json`**
```json
"<namespace>": {
  // ... existing keys ...
  "loadMore": "Загрузить ещё"
}
```

---

## Quick reference — substitutions

| Placeholder | Replace with | Example (file feature) |
|---|---|---|
| `<Entity>` | PascalCase entity name | `File` |
| `<entity>` | kebab/camelCase for paths | `file` |
| `<feature>` | feature folder name | `files` |
| `<Model>` | API response model type | `FileModel` |
| `<Filter>` | Existing filter type name | `FileFilter` |
| `Paginated<Entity>` | Paginated alias from backend | `PaginatedFiles` |
| `<FEATURE>_QUERY_KEY` | Query key constant | `FILES_QUERY_KEY` |
| `<namespace>` | Translation namespace | `file` |
| `<List>` | List component name | `FileList` |

---

## Real example — File feature (already implemented, use as reference)

### `frontend/features/api/files.ts`
```ts
import type { FileFilter, FileModel, PaginatedFiles } from '@/backend/features/file';

export type FileApiTypes = {
  getFiles: RequestApiType<undefined, undefined, FileFilter | undefined, PaginatedFiles>;
  uploadFile: RequestApiType<FormData, undefined, undefined, FileModel>;
  updateFile: RequestApiType<{ name: string }, { id: number }, undefined, FileModel>;
  deleteFile: RequestApiType<undefined, { id: number }, undefined, void>;
};
```

### `frontend/features/files/hooks/use-files.ts`
```ts
'use client';

import type { FileFilter } from '@/backend/features/file';
import { api } from '@/frontend/features/api';
import { useDebounce } from '@/frontend/features/hooks';
import { useOffsetPagination } from '@/frontend/features/react-query';

import { FILES_QUERY_KEY } from '../constants';

export function useFiles(filter?: Omit<FileFilter, 'offset'>) {
  const debouncedFilter = useDebounce(filter);

  return useOffsetPagination({
    queryKey: [FILES_QUERY_KEY, debouncedFilter],
    queryFn: (offset) => api.getFiles({ query: { ...debouncedFilter, offset } }),
  });
}
```

### `frontend/features/files/components/FileList.tsx` (pagination excerpt)
```tsx
const {
  items: files,
  fetchNextPage,
  queryProps: { isPending, isError, hasNextPage, isFetchingNextPage },
} = useFiles({
  ...(nameFilter && { name: nameFilter }),
  ...(fileTypeFilter !== 'all' && { fileType: fileTypeFilter }),
});

// ... grid render ...

{hasNextPage && (
  <Button
    variant="outline"
    onClick={() => fetchNextPage()}
    disabled={isFetchingNextPage}
    className="self-center"
  >
    {isFetchingNextPage ? t('file.loadingFiles') : t('file.loadMore')}
  </Button>
)}
```

### `frontend/features/files/components/FilePickerDrawer.tsx` (pagination excerpt)
```tsx
const { items, fetchNextPage, queryProps: { isPending, hasNextPage, isFetchingNextPage } } = useFiles({
  fileType: fileType as never,
  name: search || undefined,
});

const files = items ?? [];

// ... grid render ...

{hasNextPage && (
  <Button
    variant="outline"
    size="sm"
    onClick={() => fetchNextPage()}
    disabled={isFetchingNextPage}
    className="mt-4 w-full"
  >
    {isFetchingNextPage ? t('file.loading') : t('file.loadMore')}
  </Button>
)}
```
