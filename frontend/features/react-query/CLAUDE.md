# react-query feature

TanStack Query (React Query) setup — provider, client configuration, cache-read utility, and shared pagination hook.

## Structure

```
react-query/
  components/
    ReactQueryProvider.tsx      # QueryClientProvider wrapper; creates a stable QueryClient via useState
  hooks/
    use-cache-query.ts          # Read-only query that reads from cache without fetching
    use-offset-pagination.ts    # Generic infinite-query hook for offset-based paginated endpoints
    use-infinite-scroll.ts      # IntersectionObserver sentinel hook: auto-fetch-on-scroll for paginated lists
    index.ts                    # Barrel export for hooks
  index.ts                      # Barrel export: useCacheQuery, useOffsetPagination, useInfiniteScroll, ReactQueryProvider
```

## Key patterns

- **`ReactQueryProvider`** — mount once at the top of the app (currently in `app/[lng]/layout.tsx`). Creates the `QueryClient` via `useState` so each React tree gets a stable client instance.

- **`useCacheQuery<T>`** — reads an existing cache entry by `queryKey` without triggering a network request (`enabled: false`, `gcTime: Infinity`). Use this when a component only needs to consume data already fetched by a parent or sibling query rather than issuing its own request.

- **`useOffsetPagination<T>`** — generic wrapper over `useInfiniteQuery` for any backend endpoint that returns `PaginatedItems<T>` (`{ items, total, offset, limit }`). Accepts `queryKey` and `queryFn(offset: number) => Promise<PaginatedItems<T>>`. Returns:
  - `items` — `T[] | undefined` memoised with `useMemo([data])`, flattened from all loaded pages via `data?.pages.flatMap(p => p.items)`
  - `fetchNextPage` — a guarded `useCallback` that calls `fetchNextPage()` only when `!isFetching && hasNextPage`; safe to bind directly to a button `onClick`
  - `queryProps` — the raw `useInfiniteQuery` result for accessing `isPending`, `isError`, `hasNextPage`, `isFetchingNextPage`, etc.
  - `getNextPageParam` computes the next offset as `lastPage.offset + lastPage.items.length`; returns `undefined` when that value equals or exceeds `lastPage.total`.

- **`useInfiniteScroll(onReachEnd)`** — returns a `ref` callback to attach to a sentinel element at the bottom of a scroll container. Attaches an `IntersectionObserver` that fires `onReachEnd` whenever the sentinel scrolls into view; the latest `onReachEnd` is tracked via a ref (updated in an effect) so the observer is created once. Pair it with `useOffsetPagination`'s guarded `fetchNextPage` for auto-loading lists (no "Load more" button). Used by `frontend/features/orders`.

## Usage

```ts
// Reading from cache (no fetch)
const { data } = useCacheQuery<Product[]>({ queryKey: [PRODUCTS_QUERY_KEY] });

// Offset-paginated list
const { items, fetchNextPage, queryProps } = useOffsetPagination({
  queryKey: [MY_QUERY_KEY, filter],
  queryFn: (offset) => api.getThings({ query: { ...filter, offset } }),
});
// queryProps.isPending, queryProps.hasNextPage, queryProps.isFetchingNextPage, etc.
```

All feature-level query keys are co-located with their feature (e.g. `FILES_QUERY_KEY` in `frontend/features/files/constants.ts`).
