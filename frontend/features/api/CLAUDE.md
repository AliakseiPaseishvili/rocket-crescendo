# api feature

Typed HTTP client for all backend REST endpoints.

## Structure

```
api/
  types.ts       # Shared types: HttpMethod, RequestMap, RequestProps, RequestApiType
  utils.ts       # executeRequest() — low-level fetch wrapper
  products.ts    # Product API routes, types, and request map
  categories.ts  # Category API routes, types, and request map
  index.ts       # Builds and exports the unified `api` object
```

## How it works

Each resource file (e.g. `products.ts`) defines:
1. **Route constants** — URL strings (`:id` as a param placeholder)
2. **`*ApiTypes`** — a typed map of method name → `RequestApiType<Body, Params, Query, Response>`
3. **`*_REQUEST_MAP`** — maps each method name to `{ url, method }`

`index.ts` merges all request maps and uses `Object.fromEntries` to produce the `api` object, where each key is a callable function that delegates to `executeRequest`.

`executeRequest` in `utils.ts`:
- Resolves `:param` placeholders via `formUrlParams`
- Appends query strings via `formSearchParams`
- Serializes the body as JSON
- Throws on non-OK responses (parses the `error` field from the JSON body)
- Returns `undefined` for empty responses (204-style)

## Adding a new resource

1. Create `<resource>.ts` following the pattern in `products.ts` or `categories.ts`:
   - Define route constants
   - Define `<Resource>ApiTypes`
   - Define `<RESOURCE>_REQUEST_MAP`
2. Import and spread both into `ApiTypes` / `REQUEST_MAP` in `index.ts`.
3. Export the new types from `index.ts` if consumers need them.

## Types reference

| Type | Purpose |
|---|---|
| `HttpMethod` | Enum of GET / POST / PUT / PATCH / DELETE |
| `RequestMap<T>` | Maps each key of `T` to `{ url, method }` |
| `RequestProps<Data, Params, Query>` | Shape of arguments passed to each api method |
| `RequestApiType<Data, Params, Query, Response>` | Function signature for a single API call |
