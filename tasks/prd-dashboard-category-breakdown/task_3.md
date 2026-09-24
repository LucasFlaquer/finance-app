# Task 3.0: `createdAt` index migration and dashboard server modules

## Overview

Add the `@@index([createdAt])` on `Transaction` through a Prisma migration, then build the two server modules: `getMonthlyCategoryTotals`, a single `groupBy(categoryId, type)` restricted to the month's UTC range and mapped to cents, and `getMonthlyDashboard`, which combines it with `listCategories` through `buildMonthlyDashboard`.

**Depends on:** 1.0 (`monthRange`, `YearMonth`), 2.0 (`toCents`, `buildMonthlyDashboard`, types). **Blocks:** 9.0.

<skills>
### Skills compliance

- `prisma-cli`: the migration (`pnpm db:migrate --name add_transaction_created_at_index`, which wraps `prisma migrate dev`).
- `prisma-client-api`: `groupBy` with `by`, `where`, `_sum` and `_count`.
</skills>

<rules>
### AGENTS.md and rules compliance

Read `AGENTS.md`, `.claude/rules/code-standards.md`, `.claude/rules/react.md` and `.claude/rules/tests.md`. Relevant rules:

- Data access lives only in `src/server/**` (react.md "Split data-access responsibilities").
- Tests stub the database (tests.md "Fast"): `vi.mock("@/lib/prisma")` with the same pattern as `src/server/transactions/get-transactions-summary.test.ts`.

Prisma setup (per `AGENTS.md`): schema `prisma/schema.prisma` (Prisma 7, `prisma-client` generator, output `src/generated/prisma`), client `import prisma from "@/lib/prisma"`, commands `pnpm db:migrate` / `pnpm db:generate`.
</rules>

<requirements>
- One grouped query per month: `by: ["categoryId", "type"]`, `where: { createdAt: { gte: start, lt: end } }`, `_sum: { amount: true }`, `_count: { _all: true }`.
- A null `_sum.amount` maps to 0 cents.
- Cards and breakdown come from the same rows (G2).
- An index on `createdAt` supports the month filter (performance constraint: < 1 s with 10,000 transactions).
- No change to how transactions are recorded.
</requirements>

## Subtasks

- [ ] 3.1 Add `@@index([createdAt])` to `Transaction` in `prisma/schema.prisma`, run `pnpm db:migrate --name add_transaction_created_at_index`, and commit the generated migration.
- [ ] 3.2 `src/server/dashboard/get-monthly-category-totals.ts`: `groupBy`, then `CategoryTypeTotal[]` in cents.
- [ ] 3.3 `src/server/dashboard/get-monthly-dashboard.ts`: runs `getMonthlyCategoryTotals(monthRange(month))` and `listCategories()` in parallel, then `buildMonthlyDashboard`, adding `month`.
- [ ] 3.4 Unit tests with Prisma mocked (TU-22, TU-23).

## Implementation details

See `techspec.md`:

- "Component overview" → **Server** (`dashboard/*`).
- "Key interfaces" → the `src/server/dashboard/*` block.
- "Data models" → **Fixed parameters at the source** and **Schema change**.
- "Data flow" diagram.
- "Key decisions" → **Single `groupBy(categoryId, type)` feeding both cards and breakdown**.

## Related acceptance criteria

- AC-12
- AC-15
- AC-17

## Task tests

### Unit tests

- [ ] TU-22 — queries grouped totals within the month range
- [ ] TU-23 — composes the monthly dashboard

## Relevant files

- `prisma/schema.prisma` — modified
- `prisma/migrations/<timestamp>_add_transaction_created_at_index/migration.sql` — new (generated)
- `src/server/dashboard/get-monthly-category-totals.ts` (+ `.test.ts`) — new
- `src/server/dashboard/get-monthly-dashboard.ts` (+ `.test.ts`) — new
- `src/server/categories/list-categories.ts` — reused
- `src/server/transactions/get-transactions-summary.test.ts` — mocking pattern reference
- `src/lib/prisma.ts` — Prisma client
