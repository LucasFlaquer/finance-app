# Task 4.0: Shared app header and layout-wide revalidation

## Overview

Replace `TransactionsHeader` with a shared `AppHeader` (navigation, a slot for page-specific content, theme toggle, "New transaction" dialog) and an `AppNav` that marks the current page. Change `createTransaction` to revalidate the whole root layout so both `/` and `/transactions` refresh after a create. The current home page is switched to `AppHeader` (with its own `h1`) so the app keeps compiling and working. Task 5.0 moves that content to `/transactions`.

**Depends on:** none. **Blocks:** 5.0, 9.0.

<skills>
### Skills compliance

- `shadcn`: reuse the existing `Button` primitive (`src/components/ui/button.tsx`) for link styling. Do not edit generated primitives.
</skills>

<rules>
### AGENTS.md and rules compliance

Read `AGENTS.md`, `.claude/rules/code-standards.md`, `.claude/rules/react.md` and `.claude/rules/tests.md`. Relevant rules:

- Server components where possible. The active page comes from the `current` prop (no `usePathname`), so components depend only on their props.
- The `children` slot is nested between tags, not passed as a prop. No prop spreading.
- Accessibility: `<nav aria-label="Main">` landmark, `aria-current="page"` on the active link, heading order preserved (the header has no `h1`; each page owns its `h1`).
- Tailwind classes with `cn` and tokens only. The header must wrap at narrow widths (360px) without horizontal scroll.
- Tests: Testing Library by role and name, with `next/cache` `revalidatePath` mocked.
</rules>

<requirements>
- The header appears on every page and has "Dashboard" (`/`) and "Transactions" (`/transactions`) links, the theme toggle and "New transaction" (FR1, FR2, FR4, FR5).
- The current link is highlighted and exposed with `aria-current="page"` (FR3).
- "New transaction" opens the existing dialog with the existing form and validation (FR5).
- After a successful create, `revalidatePath("/", "layout")` refreshes the current page. There is no revalidation on validation errors (FR6).
</requirements>

## Subtasks

- [ ] 4.1 `src/components/layout/app-nav.tsx`: two `next/link` links, `current: "dashboard" | "transactions"`.
- [ ] 4.2 `src/components/layout/app-header.tsx`: props `categories`, `current` and `children`. Composes `AppNav`, the slot, `ThemeToggle` and `NewTransactionDialog`.
- [ ] 4.3 Delete `src/components/transactions/transactions-header.tsx`. Update `src/app/page.tsx` to render `AppHeader` (`current="dashboard"`) plus its own `h1`.
- [ ] 4.4 `src/server/transactions/create-transaction.ts`: `revalidatePath("/", "layout")`. Update `create-transaction.test.ts`.
- [ ] 4.5 Unit tests (TU-24 to TU-26).

## Implementation details

See `techspec.md`:

- "Component overview" → **Layout components** and `transactions/create-transaction.ts` (modified).
- "Data flow" → the `NewTransactionDialog` → `revalidatePath` line.
- "Key decisions" → **`AppHeader` rendered per page with a `children` slot** and **`revalidatePath("/", "layout")`**.
- "Known risks" → **Header density at 360px**.

## Related acceptance criteria

- AC-01
- AC-02
- AC-03
- AC-04
- AC-05

## Task tests

### Unit tests

- [ ] TU-24 — revalidates both pages after creating a transaction
- [ ] TU-25 — header renders navigation, theme toggle and new transaction
- [ ] TU-26 — nav marks the current page

## Relevant files

- `src/components/layout/app-nav.tsx` (+ `.test.tsx`) — new
- `src/components/layout/app-header.tsx` (+ `.test.tsx`) — new
- `src/components/transactions/transactions-header.tsx` — deleted
- `src/app/page.tsx` — modified (temporary header swap; rewritten in 9.0)
- `src/server/transactions/create-transaction.ts` (+ `.test.ts`) — modified
- `src/components/theme/theme-toggle.tsx`, `src/components/transactions/new-transaction-dialog.tsx` — reused
