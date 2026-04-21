# api feature

Typed HTTP client for all backend REST endpoints. Every resource file defines route constants, a typed method map, and a request map; `index.ts` merges them into a single callable `api` object.

## Structure

```
api/
  types.ts       # HttpMethod, RequestMap, RequestProps, RequestApiType
  utils.ts       # executeRequest() — low-level fetch wrapper (JSON + FormData)
  products.ts    # ProductApiTypes, PRODUCT_REQUEST_MAP
  categories.ts  # CategoryApiTypes, CATEGORY_REQUEST_MAP
  files.ts       # FileApiTypes, FILE_REQUEST_MAP
  index.ts       # Merges all maps; exports unified `api` object
```

## How it works

Each resource file defines:
1. **Route constants** — URL strings with `:id` placeholders
2. **`*ApiTypes`** — a typed map of method name → `RequestApiType<Body, Params, Query, Response>`
3. **`*_REQUEST_MAP`** — maps each method name to `{ url, method }`

`index.ts` merges all request maps and uses `Object.fromEntries` to produce the `api` object where each key is a callable that delegates to `executeRequest`.

`executeRequest` in `utils.ts`:
- Resolves `:param` placeholders via `formUrlParams`
- Appends query strings via `formSearchParams`
- Serialises the body as JSON, **or passes `FormData` through as-is** (browser sets the `multipart/form-data` boundary automatically — do not set `Content-Type` manually)
- Throws on non-OK responses (parses the `error` field from the JSON body)
- Returns `undefined` for empty responses

## API methods reference

### Products (`products.ts`)

| Method | HTTP | Route | Body / Query | Response |
|---|---|---|---|---|
| `getProducts` | GET | `/api/products` | `ProductFilter?` (query) | `ProductWithTranslations[]` |
| `getProduct` | GET | `/api/products/:id` | — | `ProductWithTranslations` |
| `createProduct` | POST | `/api/products` | `ProductCreateInput` | `ProductWithTranslations` |
| `updateProduct` | PATCH | `/api/products/:id` | `ProductUpdateInput` | `ProductWithTranslations` |
| `deleteProduct` | DELETE | `/api/products/:id` | — | `void` |

### Categories (`categories.ts`)

| Method | HTTP | Route | Body / Query | Response |
|---|---|---|---|---|
| `getCategories` | GET | `/api/category` | `CategoryFilter?` (query) | `CategoryWithTranslations[]` |
| `getCategoriesByIds` | POST | `/api/category/by-ids` | `{ ids: number[] }` | `CategoryWithTranslations[]` |
| `createCategory` | POST | `/api/category` | `CategoryCreateInput` | `CategoryWithTranslations` |
| `updateCategory` | PATCH | `/api/category/:id` | `CategoryUpdateInput` | `CategoryWithTranslations` |
| `deleteCategory` | DELETE | `/api/category/:id` | — | `void` |

### Files (`files.ts`)

| Method | HTTP | Route | Body / Query | Response |
|---|---|---|---|---|
| `getFiles` | GET | `/api/file` | `FileFilter?` (query: `offset`, `limit`, `fileType`, `name`) | `PaginatedFiles` |
| `uploadFile` | POST | `/api/file` | `FormData` (`file`, `name`) | `FileModel` |
| `updateFile` | PATCH | `/api/file/:id` | `{ name: string }` | `FileModel` |
| `deleteFile` | DELETE | `/api/file/:id` | — | `void` |

`getFiles` returns `PaginatedFiles` (`{ items: FileModel[]; total: number; offset: number; limit: number }`) — not a plain array. Consumers use `useOffsetPagination` from `@/frontend/features/react-query` to page through results.

## Key patterns

- **`RequestApiType<Data, Params, Query, Response>`** — the four generics map to: JSON body type, URL params type (e.g. `{ id: number }`), query-string type, and the resolved response type. Pass `undefined` for unused slots.
- **`FormData` bodies** — pass `FormData` as `body`; `executeRequest` detects `instanceof FormData` and skips JSON serialisation and the `Content-Type` header so the browser sets the multipart boundary.
- **Adding a new resource** — create `<resource>.ts` following the pattern in `products.ts`, then spread both `*ApiTypes` and `*_REQUEST_MAP` into `ApiTypes` / `REQUEST_MAP` in `index.ts`.
