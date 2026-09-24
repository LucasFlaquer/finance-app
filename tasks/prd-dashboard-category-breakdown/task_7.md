# Task 7.0: Accessible category pie chart

## Overview

Build the pie chart and its keyboard- and screen-reader-accessible parts. `CategorySlice` is a custom Pie `shape` that makes each slice focusable with an `aria-label`. `ActiveSliceReadout` is one `aria-live` readout used for both hover and focus. `CategoryPieChart` wraps everything in a `<figure>` with an `sr-only` text alternative. `useActiveSlice` holds the active category. Recharts' `Tooltip` and `accessibilityLayer` are **not** used (recharts#6338).

**Depends on:** 2.0 (`CategoryBreakdownRow`, `formatPercentage`), 6.0 (`chart.tsx`, palette, `ResizeObserver` stub, spike result). **Blocks:** 8.0.

<skills>
### Skills compliance

- `shadcn`: use `ChartContainer` from the generated `chart.tsx` as documented by the skill.
</skills>

<rules>
### AGENTS.md and rules compliance

Read `AGENTS.md`, `.claude/rules/code-standards.md`, `.claude/rules/react.md` and `.claude/rules/tests.md`. Relevant rules:

- `"use client"` only where needed (`category-pie-chart.tsx`, and any component using the hook).
- Stateful logic lives in `use-active-slice.ts`. No `useEffect`, no `useMemo`.
- Accessibility: focusable slices with a visible focus ring, `aria-label` per slice, `figure`/`figcaption`, an `<output aria-live="polite">` readout, and mouse handlers paired with focus/blur equivalents.
- `style`/`fill` only for the dynamic `row.color`.
- One component per file, files ≤ 100 lines. Tests query by role and name, not by class names.
</rules>

<requirements>
- One slice per category with amount > 0, sized by percentage, filled with that row's `color` (FR18).
- Hovering or focusing a slice reveals its name, amount and percentage. Leaving or blurring clears it (FR21).
- The chart has an accessible name and a text alternative summarizing each category and percentage (G5, US10).
- The slice `aria-label` format is `"Groceries: $600.00, 30.0%"`.
</requirements>

## Subtasks

- [ ] 7.1 `src/hooks/use-active-slice.ts`: `{ activeId, activate, clear }`.
- [ ] 7.2 `src/components/dashboard/active-slice-readout.tsx`.
- [ ] 7.3 `src/components/dashboard/category-slice.tsx` (main approach or fallback, per the 6.0 spike result).
- [ ] 7.4 `src/components/dashboard/category-pie-chart.tsx`: `ChartContainer` + `PieChart` (`accessibilityLayer={false}`) + `Pie shape={CategorySlice}`, inside `<figure>` with an `sr-only` `<figcaption>`. Filters out zero rows.
- [ ] 7.5 Unit tests (TU-34 to TU-37, TU-39).

## Implementation details

See `techspec.md`:

- "Component overview" → `category-pie-chart.tsx`, `category-slice.tsx`, `active-slice-readout.tsx`, and **Hooks** (`use-active-slice.ts`).
- "Summary" → the recharts#6338 rationale.
- "Business rules implemented by `buildCategoryBreakdown`" → zero rows filtered before the pie.
- "Known risks" → **Recharts in jsdom** (fixed `initialDimension` in tests).

## Related acceptance criteria

- AC-18
- AC-21
- AC-22

## Task tests

### Unit tests

- [ ] TU-34 — pie renders one slice per non-zero category with matching color
- [ ] TU-35 — focusing a slice shows its details
- [ ] TU-36 — hovering a slice shows its details and leaving clears them
- [ ] TU-37 — chart exposes a text alternative
- [ ] TU-39 — useActiveSlice activates and clears

## Relevant files

- `src/hooks/use-active-slice.ts` (+ `.test.ts`) — new
- `src/components/dashboard/active-slice-readout.tsx` — new
- `src/components/dashboard/category-slice.tsx` — new
- `src/components/dashboard/category-pie-chart.tsx` (+ `.test.tsx`) — new
- `src/components/ui/chart.tsx` — generated in 6.0
- `src/lib/format-currency.ts`, `src/lib/format-percentage.ts` — reused
