# Task 8.0: Remaining dashboard components and category breakdown section

## Overview

Build the rest of the dashboard UI:

- `MonthNavigation`: previous/next links and the month label. "Next" is a disabled button on the current month.
- `BreakdownTypeToggle`: Outcome/Income with `aria-pressed`.
- `CategoryBreakdownList` and `CategoryBreakdownRow`: swatch, name, amount, percentage, count.
- `CategoryBreakdownEmptyState`.
- `useBreakdownType`.
- `CategoryBreakdownSection`: the client component that composes the heading, toggle, pie or empty state, and list in an `aria-live` region.

**Depends on:** 1.0 (month helpers), 2.0 (breakdown types, `formatPercentage`), 7.0 (`CategoryPieChart`). **Blocks:** 9.0.

<skills>
### Skills compliance

- `shadcn`: reuse the existing `Button` primitive for the toggle and the disabled "next" button.
- `impeccable`: layout pass (pie and list side by side on wide screens, stacked chart-first on narrow screens) against `DESIGN.md`.
</skills>

<rules>
### AGENTS.md and rules compliance

Read `AGENTS.md`, `.claude/rules/code-standards.md`, `.claude/rules/react.md` and `.claude/rules/tests.md`. Relevant rules:

- `MonthNavigation` is a server component using `next/link`. Only `CategoryBreakdownSection` is `"use client"`.
- Toggle state lives in `use-breakdown-type.ts`. No `useEffect` or `useMemo`, since derived values are computed during render.
- Accessibility: `role="group"` + `aria-label="Breakdown type"`, `aria-pressed`, month buttons named "Go to August 2026", a real `disabled` button for "next", `aria-hidden` swatches, `aria-live="polite"` on the content region, and an `h2` under the page `h1`.
- `style` only for the dynamic swatch `backgroundColor`. Singular "1 transaction" and plural "N transactions" (named constant or helper, no inline magic strings).
- One component per file, files ≤ 100 lines.
</rules>

<requirements>
- The month label sits between "previous" and "next". "Next" is disabled on the current month (FR8–FR10).
- Links always carry an explicit `?month=YYYY-MM` (FR11).
- The toggle defaults to Outcome (FR15).
- The list shows **every** category with swatch, name, currency amount, percentage (one decimal) and count, in FR20 order (FR19, FR20).
- A zero type total replaces the pie with "No outcome recorded in September 2026" (or "income"). The list still shows every category at 0.0% (FR22).
- The heading names the type and month: "Outcome by category — September 2026" (FR23).
</requirements>

## Subtasks

- [ ] 8.1 `src/components/dashboard/month-navigation.tsx` (props `month`, `currentMonth`).
- [ ] 8.2 `src/hooks/use-breakdown-type.ts`.
- [ ] 8.3 `src/components/dashboard/breakdown-type-toggle.tsx`.
- [ ] 8.4 `src/components/dashboard/category-breakdown-row.tsx` and `category-breakdown-list.tsx`.
- [ ] 8.5 `src/components/dashboard/category-breakdown-empty-state.tsx`.
- [ ] 8.6 `src/components/dashboard/category-breakdown-section.tsx` (props `month`, `breakdowns`).
- [ ] 8.7 Unit tests (TU-27 to TU-33, TU-38).

## Implementation details

See `techspec.md`:

- "Component overview" → **Dashboard components** (`month-navigation`, `category-breakdown-section`, `breakdown-type-toggle`, list/row, empty state) and **Hooks** (`use-breakdown-type.ts`).
- "API endpoints" → the note on explicit `?month=` in navigation links.
- "Key decisions" → **Both breakdowns precomputed; toggle is client state** and **Month navigation as links**.
- PRD "Layout guidelines" and "Accessibility requirements".

## Related acceptance criteria

- AC-06
- AC-08
- AC-09
- AC-15
- AC-16
- AC-20
- AC-22

## Task tests

### Unit tests

- [ ] TU-27 — month navigation links to the previous month
- [ ] TU-28 — next month is disabled on the current month
- [ ] TU-29 — next month links forward on a past month
- [ ] TU-30 — breakdown defaults to Outcome and toggles to Income
- [ ] TU-31 — section heading names type and month
- [ ] TU-32 — list rows show name, amount, percentage, count and swatch
- [ ] TU-33 — empty type total shows empty state instead of the pie
- [ ] TU-38 — useBreakdownType defaults to OUTCOME and updates

## Relevant files

- `src/components/dashboard/month-navigation.tsx` (+ `.test.tsx`) — new
- `src/hooks/use-breakdown-type.ts` (+ `.test.ts`) — new
- `src/components/dashboard/breakdown-type-toggle.tsx` — new
- `src/components/dashboard/category-breakdown-row.tsx`, `category-breakdown-list.tsx` (+ `.test.tsx`) — new
- `src/components/dashboard/category-breakdown-empty-state.tsx` — new
- `src/components/dashboard/category-breakdown-section.tsx` (+ `.test.tsx`) — new
- `src/components/dashboard/category-pie-chart.tsx` — from 7.0
- `src/lib/months/*` — from 1.0
