# Task 5.0: Transactions page (`/transactions`)

## Overview

Create `src/app/transactions/page.tsx` with today's home content: `AppHeader` (`current="transactions"`), the `h1` "Transactions", all-time `SummaryCards`, and a "History" section with `TransactionsTable` (same columns, newest first, same limit, same empty state). Add per-page `metadata`, and set the root layout title to "Finance".

**Depends on:** 4.0 (`AppHeader`). **Blocks:** 10.0.

<skills>
### Skills compliance

- None specific. It reuses existing components only.
</skills>

<rules>
### AGENTS.md and rules compliance

Read `AGENTS.md`, `.claude/rules/code-standards.md`, `.claude/rules/react.md` and `.claude/rules/tests.md`. Relevant rules:

- An async Server Component fetches data through `src/server/**` functions only (no inline Prisma).
- Heading order `h1` → `h2`.
- Integration tests render the async page with real children. Only `@/lib/prisma` and `next/navigation`/`next/cache` are stubbed. Fixtures are built per test in `beforeEach`.

Prisma setup (per `AGENTS.md`): mock `@/lib/prisma` (default export `prisma`).
</rules>

<requirements>
- `/transactions` shows the history table with the same columns, ordering and limit as today (FR24).
- It shows the all-time balance cards (FR25).
- It keeps the "No transactions yet" empty state (FR26).
- The "Transactions" nav link is the current page (FR3).
</requirements>

## Subtasks

- [ ] 5.1 `src/app/transactions/page.tsx` (`dynamic = "force-dynamic"`, `metadata` title), fetching `listTransactions`, `getTransactionsSummary` and `listCategories` in parallel.
- [ ] 5.2 `src/app/layout.tsx`: root `metadata` title "Finance".
- [ ] 5.3 Integration tests (TI-04, TI-05).

## Implementation details

See `techspec.md`:

- "Component overview" → **Routes** (`transactions/page.tsx`, `layout.tsx`).
- "API endpoints" → `GET /transactions`.
- "Integration tests" setup paragraph.

## Related acceptance criteria

- AC-02
- AC-13
- AC-14
- AC-25

## Task tests

### Integration tests

- [ ] TI-04 — transactions page renders all-time cards, history and current nav
- [ ] TI-05 — transactions page shows the empty state without transactions

## Relevant files

- `src/app/transactions/page.tsx` (+ `page.test.tsx`) — new
- `src/app/layout.tsx` — modified (`metadata`)
- `src/components/transactions/summary-cards.tsx`, `transactions-table.tsx`, `transactions-empty-state.tsx` — reused
- `src/server/transactions/list-transactions.ts`, `get-transactions-summary.ts`, `src/server/categories/list-categories.ts` — reused
