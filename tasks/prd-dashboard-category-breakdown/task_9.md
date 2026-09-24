# Task 9.0: Dashboard page (`/`) rewrite

## Overview

Rewrite `src/app/page.tsx` as the month-scoped dashboard. It reads `searchParams.month`, calls `resolveSelectedMonth(param, new Date())`, and `redirect()`s to `/?month=<current>` when the value is invalid or in the future. It fetches `getMonthlyDashboard(month)` and `listCategories()` in parallel and renders `AppHeader` (with `MonthNavigation` in its slot), an `h1`, month-scoped `SummaryCards` and `CategoryBreakdownSection`. There is no history table.

**Depends on:** 1.0 (`resolveSelectedMonth`), 3.0 (`getMonthlyDashboard`), 4.0 (`AppHeader`), 8.0 (`MonthNavigation`, `CategoryBreakdownSection`). **Blocks:** 10.0.

<skills>
### Skills compliance

- None specific. This task composes modules built in earlier tasks.
</skills>

<rules>
### AGENTS.md and rules compliance

Read `AGENTS.md`, `.claude/rules/code-standards.md`, `.claude/rules/react.md` and `.claude/rules/tests.md`. Relevant rules:

- An async Server Component does data access only through `src/server/**`. The page function stays ≤ 30 lines (extract helpers if needed).
- `searchParams` is untrusted input and is validated before any query (PRD constraint).
- Heading order `h1` → `h2`.
- Integration tests render the async page with real children, `src/lib` logic and server modules. Only `@/lib/prisma`, `next/navigation` and `next/cache` are stubbed. Time is frozen with `vi.setSystemTime`. Fixtures are built in `beforeEach`.

Prisma setup (per `AGENTS.md`): mock `@/lib/prisma` (default export `prisma`) with a range-aware `groupBy` stub.
</rules>

<requirements>
- The default month is the current UTC month. A missing param is not redirected (FR7).
- Invalid or future params redirect to `/?month=<current>` (FR12).
- The balance cards only include the selected month's transactions (FR13).
- No transaction history table on `/` (FR14).
- The breakdown totals equal the balance cards to the cent (G2).
</requirements>

## Subtasks

- [ ] 9.1 Rewrite `src/app/page.tsx` (`dynamic = "force-dynamic"`, `metadata` title, `resolveSelectedMonth` + `redirect`).
- [ ] 9.2 Integration tests (TI-01 to TI-03).

## Implementation details

See `techspec.md`:

- "Component overview" → **Routes** (`page.tsx`).
- "Data flow" diagram.
- "API endpoints" → `GET /` (query rules, 200/307 responses, examples).
- "Integration tests" table and setup paragraph.

## Related acceptance criteria

- AC-11
- AC-12
- AC-14
- AC-17

## Task tests

### Integration tests

- [ ] TI-01 — dashboard page redirects an invalid month param
- [ ] TI-02 — dashboard page renders month cards and breakdown without history
- [ ] TI-03 — dashboard breakdown totals equal the balance cards

## Relevant files

- `src/app/page.tsx` (+ `page.test.tsx`) — rewritten
- `src/lib/months/resolve-selected-month.ts` — from 1.0
- `src/server/dashboard/get-monthly-dashboard.ts` — from 3.0
- `src/components/layout/app-header.tsx` — from 4.0
- `src/components/dashboard/month-navigation.tsx`, `category-breakdown-section.tsx` — from 8.0
- `src/components/transactions/summary-cards.tsx` — reused
