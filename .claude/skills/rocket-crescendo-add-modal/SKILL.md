---
name: rocket-crescendo-add-modal
description: >
  Adds a modal dialog to the rocket-crescendo Next.js project using the shared Modal component
  at frontend/components/Modal/Modal.tsx (wraps shadcn Dialog). Use whenever the user asks to
  "add a modal", "create a dialog", "open something in a dialog", or "show X in a popup" inside
  any feature under frontend/features/. Covers controlled modals (with open/onOpenChange state),
  uncontrolled modals (Radix manages state internally), form modals, and fullscreen-on-mobile
  responsive modals.
---

# Rocket Crescendo — Add Modal Skill

Always use the shared `Modal` component — never reach for shadcn `Dialog` primitives directly
in feature code. See [references/templates.md](references/templates.md) for copy-paste templates.

## Modal component API

```ts
// import { Modal } from '@/frontend/components/Modal';
interface ModalProps {
  trigger: ReactNode;        // rendered inside DialogTrigger asChild
  title: string;             // DialogTitle text
  children: ReactNode;       // dialog body
  open?: boolean;            // omit for uncontrolled (Radix manages state)
  onOpenChange?: (open: boolean) => void;
  contentClassName?: string; // e.g. "max-w-lg"
  headerClassName?: string;  // e.g. "px-4 pt-4 sm:px-0 sm:pt-0"
  titleClassName?: string;   // e.g. "truncate pr-8"
}
```

## Decision: controlled vs uncontrolled

| Situation | Pattern |
|---|---|
| Must close programmatically (form success, mutation callback, explicit cancel) | **Controlled** — `useState` + `open` + `onOpenChange` |
| No programmatic close needed (video player, info panel, read-only preview) | **Uncontrolled** — omit `open`/`onOpenChange` |

## Workflow

1. Identify the target feature (`frontend/features/<feature>/components/`).
2. Choose controlled or uncontrolled (table above).
3. Create `<Name>Modal.tsx` (or `<Name>Dialog.tsx`) in the feature's `components/` folder.
4. Export from `components/index.ts`, re-export from feature `index.ts`.
5. If the modal wraps a form, create a `use-<action>-form.ts` hook alongside it.
6. Add any new i18n keys to **all three** locale files: `en`, `fr`, `ru`.

## Placement rules

- One modal = one file. Never inline a `<Modal>` inside a list/card unless trivial.
- The trigger lives inside `<Modal trigger={…}>` — not as a sibling component.
- Keep `open` state in the modal component, not the parent.
- Form reset on close: call `reset()` inside `onOpenChange` when `next === false`.

## Responsive / fullscreen modal (mobile)

For video or full-canvas content that should go edge-to-edge on mobile:

```
contentClassName="top-0 left-0 h-full max-h-none w-full max-w-full translate-x-0 translate-y-0
  rounded-none p-0 gap-0 sm:top-1/2 sm:left-1/2 sm:h-auto sm:max-h-[90vh]
  sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-[min(90vw,1200px)]
  sm:rounded-xl sm:p-4 sm:gap-4"
headerClassName="px-4 pt-4 sm:px-0 sm:pt-0"
titleClassName="truncate pr-8"
```

## Reference templates

- Controlled form modal → [references/templates.md#controlled-form-modal](references/templates.md)
- Uncontrolled modal → [references/templates.md#uncontrolled-modal](references/templates.md)
- Fullscreen-on-mobile modal → [references/templates.md#fullscreen-mobile-modal](references/templates.md)
