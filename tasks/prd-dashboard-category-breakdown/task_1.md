# Task 1.0: Month helpers (`src/lib/months/*`)

## Overview

Build the pure, UTC-based month helpers that the dashboard page and the month navigation depend on: the `YearMonth` type, current month, month shifting and comparison, the half-open month range, parsing and formatting of the `?month=YYYY-MM` param, the month label, and `resolveSelectedMonth`, which decides between rendering a month and redirecting to the current one.

**Depends on:** none. **Blocks:** 3.0, 8.0, 9.0.

<skills>
### Skills compliance

- None. This task is pure TypeScript with no framework, database or UI.
</skills>

<rules>
### AGENTS.md and rules compliance

Read `AGENTS.md`, `.claude/rules/code-standards.md`, `.claude/rules/react.md` and `.claude/rules/tests.md`. Relevant rules:

- One concern per file, files ≤ 100 lines, functions ≤ 30 lines, ≤ 3 params, guard clauses, no comments (except a short one explaining `MONTH_PARAM_PATTERN` if needed), no blank lines in function bodies.
- Named constants: `MONTH_PARAM_PATTERN`, `MONTH_PARAM = "month"`, minimum year 1000.
- `resolveSelectedMonth` is critical business logic, so it needs exhaustive tests.
- Tests: Vitest, AAA, one concept per test, time never read from the real clock (explicit `now` or `vi.setSystemTime`).
</rules>

<requirements>
- All month logic is evaluated in UTC (FR7, technical constraint "single, consistent timezone").
- The default month is the calendar month of `now` in UTC (FR7).
- `?month=` uses the `YYYY-MM` format (FR11).
- Malformed, non-existent (month 00 or 13), repeated (array) or future months resolve to a redirect to the current month (FR12).
- A missing param selects the current month with no redirect (AC-06).
- Year ≥ 1000, which guards against `Date.UTC` two-digit-year remapping.
</requirements>

## Subtasks

- [ ] 1.1 `year-month.ts`: `YearMonth`, `currentYearMonth(now)`, `shiftMonth(value, delta)`, `compareYearMonth(a, b)`, `monthRange(value)` (UTC `[start, end)`).
- [ ] 1.2 `month-param.ts`: `parseMonthParam(raw)` (regex, array → `null`), `formatMonthParam(value)`.
- [ ] 1.3 `format-month.ts`: `formatMonthLabel(value)` with `Intl.DateTimeFormat` en-US, `timeZone: "UTC"`.
- [ ] 1.4 `resolve-selected-month.ts`: `SelectedMonth` union and `resolveSelectedMonth(raw, now)`.
- [ ] 1.5 Colocated unit tests for every helper (TU-01 to TU-10).

## Implementation details

See `techspec.md`:

- "Component overview" → **Pure logic** (`months/*`).
- "Key interfaces" → the `src/lib/months/*` block.
- "`resolveSelectedMonth` rules" paragraph (regex `^([1-9]\d{3})-(0[1-9]|1[0-2])$`, year ≥ 1000, array invalid).
- "Data models" → `YearMonth`.
- "API endpoints" → `GET /` query parameter rules.
- "Key decisions" → **UTC for all month logic**.

## Related acceptance criteria

- AC-06
- AC-07
- AC-08
- AC-09
- AC-10
- AC-11
- AC-12

## Task tests

### Unit tests

- [ ] TU-01 — parses a valid month param
- [ ] TU-02 — rejects malformed month params
- [ ] TU-03 — derives the current month in UTC
- [ ] TU-04 — shifts months across year boundaries
- [ ] TU-05 — builds a UTC half-open month range
- [ ] TU-06 — formats month label and param
- [ ] TU-07 — selects the current month when param is absent
- [ ] TU-08 — redirects a future month to the current month
- [ ] TU-09 — redirects an invalid month to the current month
- [ ] TU-10 — selects a valid past month

## Relevant files

- `src/lib/months/year-month.ts` (+ `.test.ts`) — new
- `src/lib/months/month-param.ts` (+ `.test.ts`) — new
- `src/lib/months/format-month.ts` (+ `.test.ts`) — new
- `src/lib/months/resolve-selected-month.ts` (+ `.test.ts`) — new
- `src/lib/format-date.ts` — reference for the existing UTC formatting convention
