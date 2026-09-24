# Task 2.0: Money and category breakdown logic

## Overview

Build the critical pure business logic: integer-cents conversion, percentage formatting, stable category colors, `buildCategoryBreakdown` (amounts, counts, percentages, ordering and colors for one type) and `buildMonthlyDashboard` (the month summary plus both breakdowns from the same grouped rows). This logic guarantees G2 (category sums equal the balance cards to the cent) and G3 (percentages sum to 100 ± 0.1).

**Depends on:** none. **Blocks:** 3.0, 7.0, 8.0.

<skills>
### Skills compliance

- None. This task is pure TypeScript.
</skills>

<rules>
### AGENTS.md and rules compliance

Read `AGENTS.md`, `.claude/rules/code-standards.md`, `.claude/rules/react.md` and `.claude/rules/tests.md`. Relevant rules:

- `BuildCategoryBreakdownParams` is a param object (≤ 3 params rule). Functions ≤ 30 lines: split sorting and row mapping into helpers if needed.
- Named constants: `CENTS_PER_UNIT`, `CHART_PALETTE_SIZE = 10`.
- No floating-point sums: all arithmetic on integer cents (PRD technical constraint).
- This is the **critical** layer (tests.md "prioritize what is critical"), so it needs exhaustive tests: happy path, then business rules, then edge cases (zero total, ties, cycling colors, sub-cent decimals).
- Types in their own file (`dashboard-types.ts`); reuse the existing `CategoryOption`, `TransactionType` and `TransactionsSummary` from `src/lib/transactions/transaction-types.ts`.
</rules>

<requirements>
- Each category's amount is the sum of its transactions of the selected type in the month (FR16).
- Percentage = amount / type total, one decimal place, with standard rounding. It is 0 when the total is 0, never `NaN` (FR17, FR22).
- Rows include **every** category. Non-zero rows come first by amount descending (ties broken by name ascending), then zero rows alphabetically (FR19, FR20).
- Color = `var(--chart-N)` from the category's alphabetical index, cycling at 10, and stays stable across months and types (FR18).
- `summary.income === breakdowns.INCOME.total`, `summary.outcome === breakdowns.OUTCOME.total`, `summary.total = income − outcome` (G2, FR13).
- Only plain serializable numbers leave this layer (no `Decimal`, no `Date`).
</requirements>

## Subtasks

- [ ] 2.1 `src/lib/money/cents.ts`: `toCents(decimal | number | null)`, `fromCents(cents)`.
- [ ] 2.2 `src/lib/format-percentage.ts`: `formatPercentage(30) → "30.0%"`.
- [ ] 2.3 `src/lib/dashboard/dashboard-types.ts`: `CategoryTypeTotal`, `CategoryBreakdownRow`, `CategoryBreakdown`, `MonthlyDashboard`.
- [ ] 2.4 `src/lib/dashboard/category-colors.ts`: `categoryColor(alphabeticalIndex)`.
- [ ] 2.5 `src/lib/dashboard/build-category-breakdown.ts`.
- [ ] 2.6 `src/lib/dashboard/build-monthly-dashboard.ts`.
- [ ] 2.7 Colocated unit tests (TU-11 to TU-21).

## Implementation details

See `techspec.md`:

- "Key interfaces" → the `src/lib/dashboard/*` and `src/lib/money/cents.ts` block, and "Business rules implemented by `buildCategoryBreakdown`".
- "Data models" → `CategoryTypeTotal`, `CategoryBreakdownRow`, `CategoryBreakdown`, `MonthlyDashboard`, and the G2 invariant.
- "Key decisions" → **Integer cents in the pure layer**, **Standard rounding of each percentage**.

## Related acceptance criteria

- AC-12
- AC-15
- AC-16
- AC-17
- AC-18
- AC-19
- AC-20

## Task tests

### Unit tests

- [ ] TU-11 — computes category amounts and percentages
- [ ] TU-12 — counts transactions per category
- [ ] TU-13 — category amounts sum exactly to the type total
- [ ] TU-14 — percentages sum to 100 within 0.1
- [ ] TU-15 — orders non-zero by amount desc then zero alphabetically
- [ ] TU-16 — only aggregates the requested type
- [ ] TU-17 — returns all categories at zero when total is zero
- [ ] TU-18 — assigns stable colors by alphabetical index and cycles
- [ ] TU-19 — converts decimals to integer cents
- [ ] TU-20 — month summary equals breakdown totals
- [ ] TU-21 — formats percentages with one decimal

## Relevant files

- `src/lib/money/cents.ts` (+ `.test.ts`) — new
- `src/lib/format-percentage.ts` (+ `.test.ts`) — new
- `src/lib/dashboard/dashboard-types.ts` — new
- `src/lib/dashboard/category-colors.ts` (+ `.test.ts`) — new
- `src/lib/dashboard/build-category-breakdown.ts` (+ `.test.ts`) — new
- `src/lib/dashboard/build-monthly-dashboard.ts` (+ `.test.ts`) — new
- `src/lib/transactions/transaction-types.ts` — reused types
- `src/lib/transactions/summarize-transactions.ts` — existing float-based pattern that this task deliberately does not reuse
