---
name: code-review
description: Performs a thorough code review of changes in the rocket-crescendo git repository.
  Reviews staged/unstaged changes, recent commits, or a specified diff for bugs,
  security vulnerabilities, code quality issues, and adherence to project conventions.
  Outputs a structured report with Critical Issues, Warnings, and Suggestions.
  Use when the user asks to "review code", "do a code review", "check my changes",
  "review the diff", "review my PR", or any variation of reviewing git changes.
---

# Code Review — Rocket Crescendo

## Workflow

### 1. Gather changes

Run in parallel:

```bash
git diff HEAD                # all unstaged + staged changes vs last commit
git diff --cached            # staged-only
git status --short           # overview of modified files
git log --oneline -5         # recent context
```

If the user specifies a branch or commit range, use that (e.g. `git diff main...HEAD`).

### 2. Read changed files

For each substantially changed file, read the full file — not just the diff — to understand the surrounding context. Prioritize logic-heavy files (services, API routes, hooks, components with business logic).

### 3. Output structured review

---

## Code Review

### Summary
One paragraph: what the changes do, their scope, and overall quality impression.

### Critical Issues
Must be fixed before merging: bugs, security holes, broken logic, data loss risk, TypeScript errors that bypass safety.

- **[file:line]** Description of the issue and why it is a problem.

> _None_ — if nothing critical.

### Warnings
Non-blocking concerns worth addressing: missing error handling, performance, unclear naming, anti-patterns, project convention violations.

- **[file:line]** Description and recommended fix.

> _None_ — if nothing to warn about.

### Suggestions
Optional improvements: DRY opportunities, better naming, missing tests, documentation gaps.

- **[file:line]** Description.

> _None_ — if nothing to suggest.

### Verdict
One of: **Approve** / **Approve with minor fixes** / **Request changes** — one-sentence rationale.

---

## Review Checklist

**Bugs & Logic**
- Null/undefined dereferences, incorrect conditions, off-by-one errors
- Unhandled async/promise rejections
- Edge cases not handled

**Security**
- SQL injection (raw queries, Prisma `$queryRaw` with user input)
- Exposed secrets or API keys in code
- Missing auth/permission checks on API routes
- Unvalidated user input passed to filesystem, shell, or external APIs

**TypeScript**
- Avoid `any` — use proper types or `unknown`
- Unsafe `as` casts without validation
- Missing return types on exported functions

**Next.js / App Router conventions**
- Client components must have `'use client'` at the top when using hooks
- Server components must NOT use `'use client'`
- Next.js 16 async params: `await params` before destructuring (`type Params = { params: Promise<{ id: string }> }`)
- API routes: delegate to service layer, never put DB logic in route handlers
- API error handling: catch → extract message → `NextResponse.json({ error }, { status })`
  - GET list: 500 on error; POST: 400; PATCH/DELETE: 404 if "not found", else 400
  - DELETE returns `new NextResponse(null, { status: 204 })` — no body

**Frontend conventions**
- Named exports only (`export const Foo = ...`), no default exports for components
- Path aliases: always `@/frontend/…`, `@/app/…`, `@/backend/…` — never relative `../../`
- Tailwind: semantic tokens only (`bg-background`, `text-foreground`, `text-muted-foreground`, etc.)
- shadcn/ui: import from `@/frontend/components/ui/<name>`
- i18n: user-facing strings must use `useTranslations()` (client) or `initI18next()` (server) — never hardcoded
- Translations: always use `usePickTranslation(entity.translations)`, never `translations[0]`
- New components/hooks must be exported via barrel `index.ts`

**Backend conventions**
- Repository pattern: data access only in `*.repository.ts`, business logic only in `*.service.ts`
- Prisma: run `npx prisma generate` after schema changes; do not commit without regenerating
- New features go in `backend/features/<feature>/` with matching repository + service files

**Feature structure**
- New frontend features go in `frontend/features/<feature>/` with barrel `index.ts`
- API functions (frontend) go in `frontend/features/api/<resource>.ts`
- Constants use `as const`; types exported with `export type`
