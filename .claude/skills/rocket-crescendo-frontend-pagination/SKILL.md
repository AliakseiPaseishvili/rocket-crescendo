---
name: rocket-crescendo-frontend-pagination
description: Adds offset pagination to an existing frontend feature in the rocket-crescendo project. Use this skill whenever the user asks to "add pagination", "add load more", "add infinite scroll", or "paginate the list" for a frontend feature that already has a useQuery-based hook fetching a list from a paginated backend endpoint (one that returns PaginatedItems<T>). Converts the feature's list hook from useQuery to useOffsetPagination, updates the API response type to PaginatedItems, updates consumer components to use the new { items, fetchNextPage, queryProps } return shape, adds a "Load more" button, and adds the loadMore translation key to all three locale files.
---

# Rocket Crescendo — Frontend Offset Pagination Skill

Adds offset pagination to an **existing** frontend feature. The backend endpoint must already return `PaginatedItems<T>` (i.e. the backend pagination skill has already been applied). Touch points in order:

1. `frontend/features/api/<resource>.ts` — update the `getList` response type from `<Model>[]` to `Paginated<Entity>`
2. `frontend/features/<feature>/hooks/use-<feature>.ts` — replace `useQuery` with `useOffsetPagination`
3. Consumer components — update destructuring to the new return shape + add "Load more" button
4. `frontend/features/translation/messages/*.json` — add `<namespace>.loadMore` key to all three locales
5. Update CLAUDE.md files for affected features

Full copy-paste templates: see [references/templates.md](references/templates.md).

## File locations

| File | Action |
|---|---|
| `frontend/features/api/<resource>.ts` | Update response type of `get<Entity>s` from `<Model>[]` to `Paginated<Entity>` |
| `frontend/features/<feature>/hooks/use-<feature>.ts` | Replace `useQuery` with `useOffsetPagination` from `@/frontend/features/react-query` |
| `frontend/features/<feature>/components/<List>.tsx` | Update destructuring; add "Load more" button |
| `frontend/features/<feature>/components/<Picker>.tsx` | Same — if a picker/drawer component uses the hook |
| `frontend/features/translation/messages/en.json` | Add `"loadMore": "Load more"` under the feature's namespace |
| `frontend/features/translation/messages/fr.json` | Add `"loadMore": "Charger plus"` |
| `frontend/features/translation/messages/ru.json` | Add `"loadMore": "Загрузить ещё"` |

## Workflow

1. Identify the feature (e.g. `files`, `products`, `categories`) and the API resource file.
2. **Read all existing files** — the current list hook, all components that call it, the API resource file, and the translation JSON files — before writing anything.
3. Update the API type: change the response type of the list method from `<Model>[]` to `Paginated<Entity>` (imported from `@/backend/features/<entity>`).
4. Rewrite the list hook to use `useOffsetPagination`. The filter type should omit `offset` (`Omit<Filter, 'offset'>`). Pass `offset` via the `queryFn` argument.
5. Update every component that calls the hook: switch from the old `useQuery` destructuring to `{ items, fetchNextPage, queryProps }`. Replace `data` references with `items`. Read status flags from `queryProps.*`.
6. Add a "Load more" button to each list/grid component, conditioned on `queryProps.hasNextPage`. Disable it while `queryProps.isFetchingNextPage`. The button text uses `t('<namespace>.loadMore')` normally and `t('<namespace>.loading')` (or a loading variant) while fetching.
7. Add `"loadMore"` translation key to `en.json`, `fr.json`, and `ru.json` under the correct namespace.
8. Run `npx tsc --noEmit` and fix any type errors.
9. Invoke the `rocket-crescendo-feature-claude-md` skill for each affected feature.

## Key rules

- **`useOffsetPagination` lives in `@/frontend/features/react-query`**. Never import `useInfiniteQuery` directly in feature hooks — delegate to `useOffsetPagination`.
- **Filter type drops `offset`**. The hook signature is `filter?: Omit<Filter, 'offset'>`. The `offset` is injected via `queryFn: (offset) => api.get...({ query: { ...filter, offset } })`.
- **Return shape is `{ items, fetchNextPage, queryProps }`**. `items` is `T[] | undefined` (memoised). `fetchNextPage` is a guarded callback (safe to bind directly to `onClick`). `queryProps` is the raw `useInfiniteQuery` result — read `isPending`, `isError`, `hasNextPage`, `isFetchingNextPage` from it.
- **API response type must be `Paginated<Entity>`**, not `<Model>[]`. Import from `@/backend/features/<entity>`.
- **"Load more" button placement** — in a full-page list (`FileList`), render it centred below the grid (`self-center`). In a drawer/picker (`FilePickerDrawer`), render it full-width inside the scrollable area below the grid (`w-full mt-4`).
- **`isFetchingNextPage` disables the button** — always set `disabled={queryProps.isFetchingNextPage}` on the button, even though `fetchNextPage` itself is guarded. The visual disabled state matters for UX.
- **Translation namespace** — add `loadMore` under the same namespace already used by the feature (e.g. `file.loadMore`, `product.loadMore`). All three locale files must be updated in the same change.
- **`useMemo` for `items`** — `useOffsetPagination` already wraps the flatMap in `useMemo([data])`. Do not re-memoize in the consumer.

See [references/templates.md](references/templates.md) for complete copy-paste templates.
