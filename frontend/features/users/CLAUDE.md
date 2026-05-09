# users feature

Admin-only feature for managing platform users. Displays a paginated table of all registered users and lets admins ban/unban accounts and promote/demote the admin role — all via Better Auth's `admin` plugin client.

## Structure

```
users/
  components/
    UserList.tsx              # Admin data-table of all users: email, role badge, status badge, paginated with "Load more"
    UserRow.tsx               # UserActionsCell — inline ban/unban + toggle-admin buttons for one table row
    index.ts                  # Barrel export for components
  hooks/
    use-users-query.ts        # useOffsetPagination: fetches paginated user list via authClient.admin.listUsers
    use-ban-user.ts           # useMutation: ban user by id via authClient.admin.banUser, invalidates list
    use-unban-user.ts         # useMutation: unban user by id via authClient.admin.unbanUser, invalidates list
    use-set-user-role.ts      # useMutation: set role to 'admin' | 'user' via authClient.admin.setRole, invalidates list
    index.ts                  # Barrel export for hooks
  constants.ts                # USERS_QUERY_KEY, USERS_PAGE_LIMIT
  index.ts                    # Barrel export: UserList, UserActionsCell, all four hooks
```

## Types

| Type | Shape |
|---|---|
| `UserWithRole` | `{ id: string; email: string; role: string \| null; banned: boolean \| null; ... }` — imported from `better-auth/plugins` |
| `SetRoleArgs` | `{ userId: string; role: 'admin' \| 'user' }` — local to `use-set-user-role.ts` |

All user data comes from Better Auth's admin API; there is no local `types.ts` in this feature.

## Query keys

| Constant | Value | Used by |
|---|---|---|
| `USERS_QUERY_KEY` | `'users'` | `useUsersQuery`, `useBanUser`, `useUnbanUser`, `useSetUserRole` |

All three mutation hooks invalidate `[USERS_QUERY_KEY]` on success so the table refreshes automatically.

## Key patterns

- **`UserList`** — builds TanStack Table column definitions inline (email, role badge, status badge, actions) and delegates to the shared `DataTable` component. Pagination is offset-based: `useUsersQuery` exposes `fetchNextPage` and `queryProps.hasNextPage`; a "Load more" button appears when more pages exist.
- **`UserActionsCell`** — co-located in `UserRow.tsx` but exported separately; receives `{ id, role, banned }` as props from the table row so the list component stays free of mutation logic. The ban/unban button label and variant switch based on the current `banned` value; the role button toggles between `'admin'` and `'user'` in a single click.
- **Better Auth admin client** — all data operations go through `authClient.admin.*` (from `@/frontend/features/auth`), not through the project's own REST API. There are no `app/api/users/` routes.
- **`useOffsetPagination`** — from `@/frontend/features/react-query`; abstracts the accumulate-pages pattern. `useUsersQuery` only needs to supply `queryKey`, `queryFn`, and the page limit.
- **`USERS_PAGE_LIMIT = 20`** — controls both the fetch size and the cursor step. Change this constant to adjust page size.

## How to extend

### Adding a new per-user action (e.g. impersonate)

1. Create `hooks/use-impersonate-user.ts` following the same pattern as `use-ban-user.ts`: call the relevant `authClient.admin.*` method, invalidate `[USERS_QUERY_KEY]` on success.
2. Export the new hook from `hooks/index.ts` and `index.ts`.
3. Add a `Button` to `UserActionsCell` in `UserRow.tsx`, wiring it to the new `mutate` function.
4. Add translation keys to all three locale files under `frontend/features/translation/messages/`.

### Adding a new column to the user table

1. Add a new `ColumnDef<UserWithRole>` entry to the `columns` array in `UserList.tsx`.
2. If the data isn't on `UserWithRole` yet, check Better Auth's `admin.listUsers` response shape and update the column accordingly.
3. Add the column header translation key to all locale files.
