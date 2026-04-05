# react-query feature

TanStack Query (React Query) setup — provider, client configuration, and cache-read utility hook.

## Structure

```
react-query/
  components/
    ReactQueryProvider.tsx  # QueryClientProvider wrapper; creates a per-render QueryClient via useState
  hooks/
    use-cache-query.ts      # Read-only query that reads from the cache without fetching
    index.ts                # Barrel export for hooks
  index.ts                  # Barrel export: useCacheQuery, ReactQueryProvider
```

## Key patterns

- **`ReactQueryProvider`** — mount once at the top of the app (currently in `app/[lng]/layout.tsx`). It creates the `QueryClient` instance via `useState` so each React tree gets a stable client.
- **`useCacheQuery<T>`** — reads an existing cache entry by `queryKey` without triggering a network request (`enabled: false`, `gcTime: Infinity`). Use this when a component only needs to consume data already fetched by a parent or sibling query rather than issuing its own request.

## Usage

```ts
// Reading from cache (no fetch)
const { data } = useCacheQuery<Product[]>({ queryKey: [PRODUCTS_QUERY_KEY] });
```

All feature-level query keys are co-located with their feature (e.g. `CATEGORIES_QUERY_KEY` in `frontend/features/categories/constants.ts`).
