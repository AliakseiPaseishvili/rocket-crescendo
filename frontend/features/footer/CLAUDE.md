# footer feature

Static footer component with company info, privacy policy blurb, and navigation links.

## Structure

```
footer/
  components/
    Footer.tsx    # Footer UI — three-column grid + bottom copyright bar
    index.ts      # Barrel export for components
  constants.ts    # CONTACT_EMAIL
  index.ts        # Barrel export: Footer
```

## Key patterns

- **`Footer`** is a client component (`'use client'`) that uses `useTranslations('footer')` for all display strings.
- **Year** is derived at render time via `new Date().getFullYear()` — no static value needed.
- **`CONTACT_EMAIL`** is the single configurable constant; update it in [constants.ts](constants.ts) to change the contact address shown in the footer and the `mailto:` link.
- Layout is a responsive 3-column grid (`sm:grid-cols-3`) collapsing to 1 column on mobile.

## Translation keys (namespace: `footer`)

| Key | Purpose |
|---|---|
| `company` | Section heading — company name |
| `companyDescription` | Short company blurb |
| `contact` | Label before the email link |
| `privacyPolicy` | Section heading |
| `privacyPolicyContent` | Privacy policy summary text |
| `links` | Section heading |
| `aboutCompany` | Anchor link label → `#hero` |
| `termsOfService` | Anchor link label → `#support` |
| `copyright` | Bottom bar copyright line; receives `{ year }` interpolation |
| `consent` | Bottom bar consent note |

Translation files live in `frontend/features/translation/messages/<lng>.json`.
