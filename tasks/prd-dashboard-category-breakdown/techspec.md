# Technical specification

## Summary

The home route `/` becomes a server-rendered, month-scoped dashboard and the current history view moves to a new `/transactions` route. Both pages render a shared `AppHeader` (navigation, theme toggle, "New transaction" dialog); the dashboard passes a `MonthNavigation` block into the header's slot. The selected month travels in the `?month=YYYY-MM` query parameter, is validated on the server by pure helpers in `src/lib/months/`, and any invalid or future value causes a `redirect()` to the current month. All month logic (current month, boundaries, future check, labels) is evaluated in **UTC**, consistent with the existing `formatTransactionDate`.

Aggregation runs server-side with **one** Prisma `groupBy` over `(categoryId, type)` restricted to the month's UTC half-open range. A pure `buildMonthlyDashboard` function turns those rows plus the category list into the month's balance summary and both breakdowns (Outcome and Income). All money math runs on **integer cents**, so the category sums and the balance cards come from the same numbers and match to the cent (G2). Both breakdowns are sent to one client component, so switching between Outcome and Income is instant, local state (it is not in the URL; the PRD does not require that). The pie chart uses the shadcn `chart` component (Recharts v3). Recharts' Pie tooltip does not respond to keyboard focus ([recharts#6338](https://github.com/recharts/recharts/issues/6338)), so the chart does not use Recharts' `Tooltip`. Instead, a custom slice `shape` makes each slice focusable, and one "active slice" readout, driven by React state, is used for both hover and focus. Slice colors come from a new chart-only categorical palette in `globals.css`. Playwright is wired up in this feature for the E2E layer.

## System architecture

### Component overview

**Routes (`src/app/`)**

- `page.tsx` (**modified**) — Dashboard. Reads `searchParams.month`, resolves the selected month, calls `redirect()` when the value is invalid or in the future, and fetches `getMonthlyDashboard(month)` and `listCategories()` in parallel. Renders `AppHeader` (with `MonthNavigation`), an `h1`, `SummaryCards` (month) and `CategoryBreakdownSection`. It has no history table.
- `transactions/page.tsx` (**new**) — Transactions. It renders the current home content: `AppHeader`, the `h1` "Transactions", all-time `SummaryCards`, and a "History" section with `TransactionsTable`.
- `layout.tsx` (**modified**) — only `metadata` changes (title "Finance"; per-page titles come from page `metadata`).

**Layout components (`src/components/layout/`, new)**

- `app-header.tsx` — server component. Props: `categories`, `current` (`"dashboard" | "transactions"`), and `children` (an optional slot for page-specific header content). It composes `AppNav`, the slot, `ThemeToggle` and `NewTransactionDialog`. Replaces `transactions-header.tsx`, which is deleted.
- `app-nav.tsx` — a `<nav aria-label="Main">` with two `next/link` links. The active link gets `aria-current="page"` and highlighted styling. The active page comes from the `current` prop (no `usePathname`), so the component stays server-renderable and depends only on its props.

**Dashboard components (`src/components/dashboard/`, new)**

- `month-navigation.tsx` — server component. Props: `month`, `currentMonth`. It renders a "previous" `Link` (`aria-label="Go to August 2026"`), the month label (`September 2026`), and a "next" `Link`. When `month === currentMonth`, "next" is a disabled `Button` (`disabled`, `aria-label="Go to October 2026"`) instead of a link.
- `category-breakdown-section.tsx` — `"use client"`. Props: `month`, `breakdowns`. Uses `useBreakdownType()`. Renders the `h2` "Outcome by category — September 2026", `BreakdownTypeToggle`, then either `CategoryPieChart` or `CategoryBreakdownEmptyState`, and `CategoryBreakdownList`. The content region has `aria-live="polite"`.
- `breakdown-type-toggle.tsx` — a `role="group"` with `aria-label="Breakdown type"` containing two `Button`s ("Outcome", "Income") with `aria-pressed`.
- `category-pie-chart.tsx` — `"use client"`. `ChartContainer` + `PieChart` (`accessibilityLayer={false}`, because slices provide their own focus) + `Pie` with `shape={CategorySlice}`. It is wrapped in a `<figure>` whose `sr-only` `<figcaption>` holds the text summary. It uses `useActiveSlice()` and renders `ActiveSliceReadout`.
- `category-slice.tsx` — the Pie `shape` renderer. It wraps Recharts `Sector` in a `<g tabIndex={0} role="img" aria-label="Groceries: $600.00, 30.0%">` with a visible focus ring and `onFocus`/`onBlur`/`onMouseEnter`/`onMouseLeave` handlers that call the active-slice setters.
- `active-slice-readout.tsx` — an `<output aria-live="polite">` showing the name, amount and percentage of the hovered or focused slice, and nothing when no slice is active.
- `category-breakdown-list.tsx` / `category-breakdown-row.tsx` — a `<ul>`. Each row shows a swatch (`aria-hidden`, color = row `color`), the name, `formatCurrency(amount)`, `formatPercentage(percentage)`, and `"{count} transactions"` (singular for 1).
- `category-breakdown-empty-state.tsx` — "No outcome recorded in September 2026" (or "income").

**Hooks (`src/hooks/`, new)**

- `use-breakdown-type.ts` — `useState<TransactionType>("OUTCOME")`; returns `{ type, setType }`.
- `use-active-slice.ts` — `useState<string | null>` holding the active category ID; returns `{ activeId, activate, clear }`.

**Pure logic (`src/lib/`, new)**

- `months/year-month.ts` — `YearMonth` type, `currentYearMonth`, `shiftMonth`, `compareYearMonth`, `monthRange` (UTC).
- `months/month-param.ts` — `parseMonthParam`, `formatMonthParam`.
- `months/format-month.ts` — `formatMonthLabel` (`Intl.DateTimeFormat` en-US, `timeZone: "UTC"`).
- `months/resolve-selected-month.ts` — decides whether to use a month or redirect.
- `money/cents.ts` — `toCents(decimal)`, `fromCents(cents)`.
- `format-percentage.ts` — `formatPercentage(30) -> "30.0%"`.
- `dashboard/dashboard-types.ts` — contracts (see Data models).
- `dashboard/category-colors.ts` — `categoryColor(index)` → `var(--chart-N)`, cycling through `CHART_PALETTE_SIZE = 10`.
- `dashboard/build-category-breakdown.ts` — amounts, counts, percentages, ordering, colors for one type.
- `dashboard/build-monthly-dashboard.ts` — month summary plus both breakdowns from the grouped rows.

**Server (`src/server/`)**

- `dashboard/get-monthly-category-totals.ts` (**new**) — one `prisma.transaction.groupBy` query for the month range, mapped to `CategoryTypeTotal[]` in cents.
- `dashboard/get-monthly-dashboard.ts` (**new**) — `getMonthlyCategoryTotals` + `listCategories` → `buildMonthlyDashboard`.
- `transactions/create-transaction.ts` (**modified**) — `revalidatePath("/", "layout")` so that both `/` and `/transactions` are refreshed after a create (FR6).
- `transactions/get-transactions-summary.ts`, `list-transactions.ts`, `categories/list-categories.ts` — reused unchanged.

**Styles / schema / tooling**

- `src/app/globals.css` (**modified**) — replaces the unused grayscale `--chart-1..5` with a categorical `--chart-1..10` in `:root` and `.dark`, and registers `--color-chart-6..10` in `@theme inline`.
- `src/components/ui/chart.tsx` (**new, generated**) via `pnpm dlx shadcn@latest add chart` (adds the `recharts` dependency).
- `prisma/schema.prisma` (**modified**) + migration — `@@index([createdAt])` on `Transaction`.
- `DESIGN.md` (**modified**) — records the chart palette as a scoped exception to the Single Accent / Money Duotone rules.
- Playwright: `playwright.config.ts`, `e2e/**`, `e2e/global-setup.ts`, `package.json` scripts, `vitest.config.ts` (exclude `e2e/**`, broaden `coverage.include`), `vitest.setup.ts` (`ResizeObserver` stub for Recharts).

**Data flow**

```
GET /?month=2026-08
  page.tsx ── resolveSelectedMonth(param, new Date()) ──► redirect("/?month=2026-09") (invalid/future)
      │ ok
      ├─ getMonthlyDashboard(month)
      │     ├─ getMonthlyCategoryTotals(monthRange(month))  ── prisma.groupBy(categoryId,type)
      │     ├─ listCategories()
      │     └─ buildMonthlyDashboard({ categories, totals })  ── pure, integer cents
      └─ listCategories()  (dialog options)
  ► AppHeader[MonthNavigation] + SummaryCards(summary) + CategoryBreakdownSection(breakdowns)  (client: toggle, slice focus)

NewTransactionDialog ─► createTransaction (server action) ─► revalidatePath("/", "layout") ─► current route re-renders
```

## Implementation design

### Key interfaces

```ts
// src/lib/months/*
type YearMonth = { year: number; month: number }; // month 1–12, UTC
function currentYearMonth(now: Date): YearMonth;
function shiftMonth(value: YearMonth, delta: number): YearMonth;
function compareYearMonth(a: YearMonth, b: YearMonth): number;
function monthRange(value: YearMonth): { start: Date; end: Date }; // [start, end)
function parseMonthParam(raw: string | string[] | undefined): YearMonth | null;
function formatMonthParam(value: YearMonth): string; // "2026-09"
function formatMonthLabel(value: YearMonth): string; // "September 2026"
type SelectedMonth =
  | { kind: "selected"; month: YearMonth; currentMonth: YearMonth }
  | { kind: "redirect"; month: YearMonth };
function resolveSelectedMonth(raw: string | string[] | undefined, now: Date): SelectedMonth;
```

```ts
// src/lib/dashboard/* and src/lib/money/cents.ts
function toCents(value: { toString(): string } | number | null): number;
function fromCents(cents: number): number;
function categoryColor(alphabeticalIndex: number): string;
type BuildCategoryBreakdownParams = {
  categories: CategoryOption[]; // alphabetical, as listCategories returns
  totals: CategoryTypeTotal[];
  type: TransactionType;
};
function buildCategoryBreakdown(params: BuildCategoryBreakdownParams): CategoryBreakdown;
function buildMonthlyDashboard(params: { categories: CategoryOption[]; totals: CategoryTypeTotal[] }):
  Omit<MonthlyDashboard, "month">;
```

```ts
// src/server/dashboard/*
function getMonthlyCategoryTotals(range: { start: Date; end: Date }): Promise<CategoryTypeTotal[]>;
function getMonthlyDashboard(month: YearMonth): Promise<MonthlyDashboard>;
```

Business rules implemented by `buildCategoryBreakdown`:

- `amountCents` = the sum of the category's `amountCents` for `type`, and `total` = the sum over categories. Everything is integer arithmetic, so there is no float drift.
- `percentage = total === 0 ? 0 : Math.round((amountCents * 1000) / totalCents) / 10`. This follows FR17 for each row, so the percentages sum to 100 ± 0.1 (G3).
- Ordering: rows with `amount > 0` sort by amount descending, with ties broken by name ascending. Rows with a zero amount come after them, by name ascending (FR20).
- `color = categoryColor(index of category in the alphabetical list)`. The color stays the same for a category across months and types.
- Rows with `amount === 0` are passed to the list but filtered out before the pie (FR18).

`resolveSelectedMonth` rules: a missing parameter returns `selected` with the current month (no redirect, AC-06). A parameter that fails `^([1-9]\d{3})-(0[1-9]|1[0-2])$`, an array, or a month later than `currentYearMonth(now)` returns `redirect` to the current month (AC-11). The year must be at least 1000, which guards against the `Date.UTC` two-digit-year remapping. Any other valid month is `selected`.

### Data models

No change to how transactions are recorded. Existing entities: `Category(id, name unique, …)`, `Transaction(id, title, amount Decimal(12,2), type INCOME|OUTCOME, categoryId, createdAt, …)`. Server → client contracts are plain serializable objects (numbers are dollars with at most 2 decimals, produced from integer cents; no `Decimal` or `Date` crosses into the client component).

#### `YearMonth` — selected month

| Field   | Type     | Required | Description                        |
| ------- | -------- | -------- | ---------------------------------- |
| `year`  | `number` | yes      | 4-digit year, ≥ 1000               |
| `month` | `number` | yes      | 1–12, calendar month in UTC        |

```text
{ "year": 2026, "month": 9 }
```

#### `CategoryTypeTotal` — grouped DB row (server-internal)

| Field         | Type              | Required | Description                                  |
| ------------- | ----------------- | -------- | -------------------------------------------- |
| `categoryId`  | `string`          | yes      | Category UUID                                |
| `type`        | `TransactionType` | yes      | `INCOME` or `OUTCOME`                        |
| `amountCents` | `number`          | yes      | Sum of `amount` in integer cents (null → 0)  |
| `count`       | `number`          | yes      | `_count._all` for the group                  |

```text
{ "categoryId": "3f1c…", "type": "OUTCOME", "amountCents": 87565, "count": 3 }
```

#### `CategoryBreakdownRow` — one list row / pie slice

| Field        | Type     | Required | Description                                             |
| ------------ | -------- | -------- | ------------------------------------------------------- |
| `categoryId` | `string` | yes      | Stable React key and active-slice ID                    |
| `name`       | `string` | yes      | Category name                                           |
| `amount`     | `number` | yes      | Dollars, from cents (`fromCents`)                       |
| `percentage` | `number` | yes      | 0–100, one decimal place                                |
| `count`      | `number` | yes      | Number of transactions of this type in the month        |
| `color`      | `string` | yes      | `var(--chart-N)` — shared by the swatch and the slice   |

```text
{ "categoryId": "3f1c…", "name": "Groceries", "amount": 875.65, "percentage": 22.4, "count": 3, "color": "var(--chart-4)" }
```

#### `CategoryBreakdown` — one type's breakdown

| Field   | Type                     | Required | Description                                  |
| ------- | ------------------------ | -------- | -------------------------------------------- |
| `type`  | `TransactionType`        | yes      | Breakdown type                               |
| `total` | `number`                 | yes      | Sum of `rows[].amount` (equals the balance card) |
| `rows`  | `CategoryBreakdownRow[]` | yes      | **Every** category, ordered per FR20         |

```text
{
  "type": "OUTCOME",
  "total": 3910.4,
  "rows": [
    { "name": "Housing", "amount": 1582.4, "percentage": 40.5, "count": 2, "color": "var(--chart-5)", "categoryId": "…" },
    { "name": "Salary", "amount": 0, "percentage": 0, "count": 0, "color": "var(--chart-9)", "categoryId": "…" }
  ]
}
```

> **Empty month/type:** `total` is `0` and every row has `amount: 0, percentage: 0, count: 0`. The UI replaces the pie with the empty state (FR22). The contract has no special shape; there is no `null`.

#### `MonthlyDashboard` — page payload

| Field        | Type                                         | Required | Description                                   |
| ------------ | -------------------------------------------- | -------- | --------------------------------------------- |
| `month`      | `YearMonth`                                  | yes      | Selected month                                |
| `summary`    | `TransactionsSummary`                        | yes      | Existing type `{ income, outcome, total }`, month-scoped |
| `breakdowns` | `Record<TransactionType, CategoryBreakdown>` | yes      | Both types, precomputed                       |

```text
{
  "month": { "year": 2026, "month": 8 },
  "summary": { "income": 8510, "outcome": 3910.4, "total": 4599.6 },
  "breakdowns": { "OUTCOME": { "type": "OUTCOME", "total": 3910.4, "rows": [ … ] }, "INCOME": { … } }
}
```

Invariant (G2): `summary.income === breakdowns.INCOME.total` and `summary.outcome === breakdowns.OUTCOME.total`. Both are built from the same `CategoryTypeTotal[]` cents.

#### Fixed parameters at the source

| Query | Main parameters |
| --- | --- |
| `prisma.transaction.groupBy` | `by: ["categoryId", "type"]`, `where: { createdAt: { gte: start, lt: end } }`, `_sum: { amount: true }`, `_count: { _all: true }` |
| `listCategories` (existing) | `orderBy: { name: "asc" }`, `select: { id, name }` |

#### Schema change

```prisma
model Transaction {
  // …existing fields…
  @@index([categoryId])
  @@index([type])
  @@index([createdAt])
}
```

Migration: `pnpm db:migrate --name add_transaction_created_at_index`. This supports the month range filter and the existing `orderBy createdAt` history query.

### API endpoints

No JSON API is added. The contract is the pages' query parameters and redirects.

#### Overview

| Method | Route           | Description                                |
| ------ | --------------- | ------------------------------------------ |
| `GET`  | `/`             | Dashboard for the selected month           |
| `GET`  | `/transactions` | All-time balance + history (unchanged data) |

---

#### `GET /`

**Query parameters**

| Parameter | Type     | Default              | Rules |
| --------- | -------- | -------------------- | ----- |
| `month`   | `string` | current UTC month    | `YYYY-MM`, year ≥ 1000, month 01–12, not after the current UTC month. A repeated parameter (array) is invalid. |

**Responses**

| Status | Body | When |
| --- | --- | --- |
| `200` | Dashboard HTML | `month` absent (current month) or valid and not in the future |
| `307` | Redirect to `/?month=<current>` | `month` malformed, non-existent, repeated, or in the future |
| `500` | Next.js default error | DB unavailable (existing behavior; no custom `error.tsx`) |

**Example — success**

```http
GET /?month=2026-08
```

→ `200`, rendered from the `MonthlyDashboard` example above.

**Example — invalid / future** (current date 2026-09-24)

```http
GET /?month=2026-13
GET /?month=abc
GET /?month=2026-10
```

→ `307 Location: /?month=2026-09`

> Month navigation links always use an explicit `?month=`, including a link back to the current month, so the URL always shows which month is displayed after any navigation (FR11). Plain `/` stays valid and is not redirected.

---

#### `GET /transactions`

No parameters. Returns `200` with the all-time `SummaryCards`, the history (latest 100, newest first), or the existing empty state. Any query string is ignored.

---

## Integration points

None. There are no external services. The chart renders locally with Recharts inside the bundle, with no third-party calls or analytics (PRD constraint on personal data).

## Testing approach

Coverage floor: **80%** (`vitest.config.ts` thresholds, `.claude/rules/tests.md`). `coverage.include` grows to `src/lib/**`, `src/hooks/**`, `src/server/**`, `src/components/**` (excluding `src/components/ui/**`), and `src/app/**/page.tsx`. `buildCategoryBreakdown`, `buildMonthlyDashboard`, `toCents` and `resolveSelectedMonth` are critical and get exhaustive coverage. Every test uses AAA structure and one concept per test. Time is frozen with `vi.setSystemTime` or by passing an explicit `now`. Prisma is mocked with `vi.mock("@/lib/prisma")`, the same pattern as `get-transactions-summary.test.ts`. `next/navigation` `redirect` and `next/cache` `revalidatePath` are mocked. `vitest.setup.ts` adds a `ResizeObserver` stub so `ChartContainer` can mount in jsdom.

### Unit tests

| ID | Test case name | Acceptance criteria | Expected result |
|----|----------------|---------------------|-----------------|
| TU-01 | parses a valid month param | AC-09, AC-10 | `"2026-08"` → `{ year: 2026, month: 8 }` |
| TU-02 | rejects malformed month params | AC-11 | `"abc"`, `"2026-8"`, `"2026-13"`, `"2026-00"`, `"0999-01"`, `""`, `["2026-08","2026-07"]` → `null` |
| TU-03 | derives the current month in UTC | AC-07 | `now = 2026-10-01T02:30:00Z` → October 2026; `2026-09-24T12:00Z` → September 2026 |
| TU-04 | shifts months across year boundaries | AC-09 | Jan 2026 −1 → Dec 2025; Dec 2025 +1 → Jan 2026 |
| TU-05 | builds a UTC half-open month range | AC-12 | Sep 2026 → `[2026-09-01T00:00Z, 2026-10-01T00:00Z)` |
| TU-06 | formats month label and param | AC-08 | `"September 2026"`, `"2026-09"` |
| TU-07 | selects the current month when param is absent | AC-06, AC-07 | `{ kind: "selected", month: Sep 2026 }` |
| TU-08 | redirects a future month to the current month | AC-11 | `"2026-10"` → `{ kind: "redirect", month: Sep 2026 }` |
| TU-09 | redirects an invalid month to the current month | AC-11 | `"2026-13"` → redirect Sep 2026 |
| TU-10 | selects a valid past month | AC-10 | `"2026-08"` → selected Aug 2026 |
| TU-11 | computes category amounts and percentages | AC-16 | Housing 1000/50.0, Groceries 600/30.0, Transport 400/20.0, others 0/0.0/0 |
| TU-12 | counts transactions per category | AC-16 | `count` equals grouped `_count` per category |
| TU-13 | category amounts sum exactly to the type total | AC-17 | Amounts like 0.10 + 0.20 + 1450.55 … sum to `total` with `toBe` equality |
| TU-14 | percentages sum to 100 within 0.1 | AC-16 (G3) | Three equal thirds → 33.3 ×3 = 99.9, within tolerance |
| TU-15 | orders non-zero by amount desc then zero alphabetically | AC-19 | Expected order, ties broken by name |
| TU-16 | only aggregates the requested type | AC-15 | INCOME breakdown: Salary 3000/100.0, Groceries 0/0.0 |
| TU-17 | returns all categories at zero when total is zero | AC-20 | No `NaN`; every row 0 / 0 / 0; `total` 0 |
| TU-18 | assigns stable colors by alphabetical index and cycles | AC-18 | index 0 → `var(--chart-1)`, index 10 → `var(--chart-1)` |
| TU-19 | converts decimals to integer cents | AC-17 | `"1450.50"` → 145050, `null` → 0, `"0.1"` → 10 |
| TU-20 | month summary equals breakdown totals | AC-12, AC-17 | `summary.outcome === breakdowns.OUTCOME.total`, `total = income − outcome` |
| TU-21 | formats percentages with one decimal | AC-16 | `30` → `"30.0%"`, `0` → `"0.0%"` |
| TU-22 | queries grouped totals within the month range | AC-12 | `groupBy` called with `gte`/`lt` range and `by: ["categoryId","type"]`; rows mapped to cents |
| TU-23 | composes the monthly dashboard | AC-12, AC-15 | Mocked Prisma → both breakdowns + summary |
| TU-24 | revalidates both pages after creating a transaction | AC-04, AC-05 | `revalidatePath("/", "layout")` on success, not on validation error |
| TU-25 | header renders navigation, theme toggle and new transaction | AC-01 | Links "Dashboard"/"Transactions", toggle and button present |
| TU-26 | nav marks the current page | AC-02 | Current link has `aria-current="page"`; the other does not |
| TU-27 | month navigation links to the previous month | AC-08, AC-09 | Link `href="/?month=2026-08"`, name "Go to August 2026"; label "September 2026" |
| TU-28 | next month is disabled on the current month | AC-08 | Button disabled, no link |
| TU-29 | next month links forward on a past month | AC-09 | On Aug 2026: link `href="/?month=2026-09"` |
| TU-30 | breakdown defaults to Outcome and toggles to Income | AC-06, AC-15 | Outcome `aria-pressed=true`; after click, Income pressed and rows switch |
| TU-31 | section heading names type and month | AC-06 | "Outcome by category — September 2026" |
| TU-32 | list rows show name, amount, percentage, count and swatch | AC-16, AC-22 | Text `$600.00`, `30.0%`, `2 transactions`; swatch color = row color |
| TU-33 | empty type total shows empty state instead of the pie | AC-20 | "No outcome recorded in September 2026"; no chart; list rows at 0.0% |
| TU-34 | pie renders one slice per non-zero category with matching color | AC-18 | 3 slices; each `fill` equals the row `color` |
| TU-35 | focusing a slice shows its details | AC-21 | Readout shows "Groceries", "$600.00", "30.0%"; slice `aria-label` matches |
| TU-36 | hovering a slice shows its details and leaving clears them | AC-21 | Readout appears on `mouseEnter` and is empty on `mouseLeave` |
| TU-37 | chart exposes a text alternative | AC-22 | `figcaption` summarizes each category and percentage |
| TU-38 | useBreakdownType defaults to OUTCOME and updates | AC-06 | `renderHook` → `"OUTCOME"`, `setType("INCOME")` → `"INCOME"` |
| TU-39 | useActiveSlice activates and clears | AC-21 | `activate("id")` → `activeId === "id"`; `clear()` → `null` |

Strategy: pure functions (`src/lib/months`, `src/lib/dashboard`, `src/lib/money`) first, since they carry the critical rules. Server modules follow with Prisma mocked. Components are tested with Testing Library by role and name. Mocks are used only for Prisma, Next.js runtime functions and `ResizeObserver`.

### Integration tests

| ID | Test case name | Acceptance criteria | Expected result |
|----|----------------|---------------------|-----------------|
| TI-01 | dashboard page redirects an invalid month param | AC-11 | `await Home({ searchParams })` with `"abc"` and time frozen at 2026-09-24 → `redirect("/?month=2026-09")` |
| TI-02 | dashboard page renders month cards and breakdown without history | AC-12, AC-14 | Given Aug + Sep fixtures (Prisma mocked with a range-aware `groupBy`), the Sep cards include only Sep data; no `table` role |
| TI-03 | dashboard breakdown totals equal the balance cards | AC-17 | The rendered card outcome text equals the formatted breakdown total |
| TI-04 | transactions page renders all-time cards, history and current nav | AC-13, AC-14, AC-02 | All-time totals, `table` present, "Transactions" `aria-current="page"` |
| TI-05 | transactions page shows the empty state without transactions | AC-25 | "No transactions yet" |

These tests render the async page component together with its real child components, `src/lib` logic and server modules. Only `@/lib/prisma` and `next/navigation`/`next/cache` are stubbed. Fixtures are built per test in `beforeEach` (no shared module state).

### E2E tests

| ID | Test case name | Acceptance criteria | Expected result |
|----|----------------|---------------------|-----------------|
| E2E-01 | header is present and navigates between pages | AC-01, AC-02 | Header on both pages; the current link is highlighted with `aria-current` |
| E2E-02 | dashboard opens on the current month with Outcome selected | AC-06, AC-07, AC-08 | Current UTC month label, Outcome pressed, next disabled |
| E2E-03 | previous/next month updates URL and data and survives reload | AC-09, AC-10, AC-12 | URL `?month=` for the previous month; cards and breakdown show that month's seed; reload keeps it; next returns |
| E2E-04 | invalid and future month params redirect to the current month | AC-11 | `abc`, `2026-13`, `2026-00`, next month → URL shows the current month |
| E2E-05 | creating an outcome from the dashboard updates the breakdown | AC-03, AC-04 | Dialog has the same fields; Groceries +$50, count +1, cards updated, no reload |
| E2E-06 | creating a transaction on the transactions page updates history | AC-05 | New row first; all-time cards updated |
| E2E-07 | switching to Income shows income categories | AC-15 | Salary at 100.0% given the seed; other categories 0.0% |
| E2E-08 | keyboard focus on a slice announces its details | AC-21 | Tab to the slice → readout visible with name/amount/% |
| E2E-09 | pages pass an automated accessibility audit in both themes | AC-22, AC-23 | `@axe-core/playwright` reports no violations on `/` and `/transactions`, light and dark |
| E2E-10 | dashboard key content is above the fold at 1280×800 | AC-24 | Month nav, toggle, chart and first list row are in the viewport |
| E2E-11 | pages do not scroll horizontally at 360px | AC-24 (responsive guideline) | `scrollWidth <= clientWidth` on both pages |
| E2E-12 | a month without outcome shows the empty state | AC-20 | Empty-state message; list at 0.0% |

Setup: `@playwright/test` + `@axe-core/playwright`. `playwright.config.ts` has `webServer: pnpm build && pnpm start` on port 3100 and `DATABASE_URL` pointing to a dedicated `finance_e2e` database (`E2E_DATABASE_URL` in `.env.example`). `e2e/global-setup.ts` runs `prisma migrate deploy` and seeds a deterministic fixture **relative to the current UTC month** (current month: known outcome in 3 categories and a Salary income; previous month: different amounts; two months back: income only). The server clock cannot be frozen from Playwright, so assertions compute expected labels from the same UTC helpers instead. Mutating tests (E2E-05/06) reseed in `beforeEach` to stay independent. Scripts: `pnpm test:e2e`. The Vitest `exclude` gets `e2e/**`.

AC-23's non-text contrast (slices, swatches, active link at ≥ 3:1) is not checked by axe. The palette values are chosen by computing their ratios against `--card` in both themes, the ratios are recorded next to the tokens, and the check is repeated in `/05-execute-qa`.

## Development sequencing

### Build order

1. **Month helpers** (`src/lib/months/*`) + TU-01..10. They have no dependencies, and the page and navigation depend on them.
2. **Money + breakdown logic** (`cents.ts`, `format-percentage.ts`, `category-colors.ts`, `build-category-breakdown.ts`, `build-monthly-dashboard.ts`, `dashboard-types.ts`) + TU-11..21. This is the critical business logic.
3. **Schema index + server modules** (`@@index([createdAt])` migration, `get-monthly-category-totals.ts`, `get-monthly-dashboard.ts`) + TU-22..23.
4. **Shared header** (`app-header.tsx`, `app-nav.tsx`), delete `transactions-header.tsx`, change `createTransaction` to revalidate the layout + TU-24..26.
5. **Transactions page** (`src/app/transactions/page.tsx`), moving the current home content there + TI-04..05.
6. **Chart foundation**: `pnpm dlx shadcn@latest add chart`, categorical `--chart-1..10` tokens (light/dark) + `DESIGN.md` exception, `ResizeObserver` stub. **Spike first**: confirm that Recharts v3 `Pie` `shape` receives the payload/fill and that a `<g tabIndex>` wrapper receives focus. Fallback: render slices from `Pie` `label`-free `Cell`s and attach handlers via `onMouseEnter`/custom `shape` only.
7. **Dashboard components** (`month-navigation`, `breakdown-type-toggle`, `category-slice`, `active-slice-readout`, `category-pie-chart`, list/row, empty state, section) + hooks + TU-27..39.
8. **Dashboard page** (`src/app/page.tsx` rewrite with `resolveSelectedMonth` + `redirect`) + TI-01..03.
9. **Playwright wiring** + E2E-01..12; coverage config update; `pnpm test:coverage`, `pnpm check`.

### Technical dependencies

- PostgreSQL via `docker compose up -d`. A second database `finance_e2e` for E2E (created by global setup through `CREATE DATABASE` or documented manually).
- New packages: `recharts` (via shadcn `chart`), `@playwright/test`, `@axe-core/playwright`, and the Playwright browsers (`pnpm exec playwright install chromium`).
- The Prisma migration must be applied (`pnpm db:migrate`) before the index is available. The feature still works without it, just more slowly.

## Monitoring and observability

The project has no monitoring infrastructure, and this feature adds none. Server errors surface through Next.js' default logging and error page. No new logs, and in particular no logging of amounts or titles (personal financial data). To check the performance constraint (< 1 s server response with 10,000 transactions / 50 categories), run a one-off local measurement during QA with a bulk seed and `curl -w "%{time_starttransfer}"` against `/`. It is not an automated test.

## Technical considerations

### Key decisions

- **UTC for all month logic** (user decision). It matches `formatTransactionDate` and the seed data, and the boundaries use simple `Date.UTC` arithmetic. Trade-off: a user far from UTC may see a late-evening transaction on the 31st counted in the next month. This is accepted; switching to an IANA zone later only affects `currentYearMonth`, `monthRange` and the formatters.
- **Single `groupBy(categoryId, type)` feeding both cards and breakdown.** This guarantees G2 because both derive from the same source, and it is one round trip. Rejected: reusing `getTransactionsSummary` with a filter plus a separate breakdown query (two sources that could disagree, and two queries).
- **Integer cents in the pure layer.** `Decimal(12,2)` sums are converted once with `toCents`, and all further arithmetic uses integers. Values stay below 2^53. Rejected: float sums followed by `roundToCents` (the existing summary pattern), because it cannot guarantee exact equality of sums.
- **Standard rounding of each percentage** rather than largest-remainder. It satisfies FR17 exactly for each row and G3 within the PRD's ±0.1 tolerance.
- **Both breakdowns precomputed; toggle is client state.** Switching is instant with no request. The payload cost is small (≤ 50 categories × 2). Rejected: `?type=` in the URL, which the PRD does not require and which would add a server round trip.
- **Recharts via shadcn `chart`** (user decision). The chart uses the project's shadcn conventions and tokens. Because of recharts#6338 it does not use Recharts `Tooltip` or `accessibilityLayer` for slices. Instead, a custom `shape` gives each slice a tab stop, and a state-driven `ActiveSliceReadout` works identically for hover and focus. Rejected: Recharts `Tooltip` with controlled `active`/`defaultIndex`, because its keyboard behavior is unreliable.
- **Categorical chart palette as a scoped design exception** (user decision). Ten hues, excluding the emerald and red money hues, with light and dark values, used only for data-viz marks and swatches. The color is fixed per category (alphabetical index) so a category keeps its color across months and types. Beyond 10 categories the palette cycles; list rows remain distinct because each row names its category.
- **`AppHeader` rendered per page with a `children` slot**, not in `layout.tsx`. A layout cannot read `searchParams`, and the month navigation must be in the header on the dashboard only. The header receives `categories` (for the dialog) and `current` from each page.
- **Month navigation as links.** Changing months is navigation, so `next/link` gives prefetch, correct semantics and working back and forward browser history. The disabled "next" is a real `disabled` button, because links cannot be disabled.
- **`revalidatePath("/", "layout")`** refreshes every route under the root layout after a create. This is simpler than listing paths and covers future pages.

### Known risks

- **Recharts `Pie` `shape` API details in v3** (prop names, payload shape, focus on `<g>` inside the SVG). Mitigation: the spike in build step 6. Fallback: a thin wrapper that renders a `<Sector>` per slice from Recharts' computed sectors.
- **Recharts in jsdom** (`ResponsiveContainer` measures 0×0). Mitigation: a `ResizeObserver` stub plus a fixed `initialDimension` on `ChartContainer` in tests. The assertions target slices and the readout, not layout.
- **Palette contrast (WCAG 1.4.11)** for 10 hues in both themes. Mitigation: compute and record the ratios per token and verify in QA. A 1px `--card` stroke between slices separates adjacent similar hues.
- **E2E clock is not controllable on the server.** Mitigation: seed relative to the current UTC month and compute expectations with the same helpers. Around a UTC month rollover during a run the results could differ; this is documented as acceptable.
- **Header density at 360px** (nav + month nav + toggle + button). Mitigation: the header wraps into two rows below `sm` (nav + actions, then month navigation full-width), and E2E-11 guards against horizontal scroll.
- **Doc drift (resolved):** `AGENTS.md` used to describe `prisma-next`/`contract.prisma`. It now documents the Prisma 7 setup the code uses (`prisma/schema.prisma`, `src/lib/prisma.ts`, `pnpm db:*` scripts), and `prisma-next.md` was removed.

### AGENTS.md and rules compliance

Read `AGENTS.md`, `.claude/rules/code-standards.md`, `.claude/rules/react.md` and `.claude/rules/tests.md`. Constraints applied:

- Files ≤ 100 lines, functions ≤ 30 lines, ≤ 3 params (`BuildCategoryBreakdownParams` param object), guard clauses, no comments, named constants (`CENTS_PER_UNIT`, `CHART_PALETTE_SIZE`, `MONTH_PARAM_PATTERN`, `MONTH_PARAM = "month"`), no blank lines in function bodies. This drives the fine-grained file split above.
- React: function components only, no prop spreading outside `components/ui`, data access only in `src/server/**`, stateful logic in `use*` hooks, no `useEffect` (derived values computed during render), no `useMemo` (the data is small), Tailwind + `cn` + tokens, and `style` only for dynamic colors (`backgroundColor: row.color` on swatches).
- Accessibility: `nav` landmark + `aria-current`, `aria-pressed` toggle group, labelled month buttons, focusable slices with visible focus, `figure`/`figcaption` text alternative, `aria-live="polite"` on updating regions, heading order `h1` → `h2` on both pages.
- Tests: Vitest unit and integration, Playwright E2E, 80% floor, FIRST (frozen time, no real network), AAA, one concept per test, banned-only assertions avoided, writing order happy path → rules → edges → errors.
- No secrets: the E2E DB URL comes from `.env` (`E2E_DATABASE_URL` added to `.env.example`).

### Skills compliance

- `shadcn` — add `chart` through the CLI (`pnpm dlx shadcn@latest add chart`). Do not hand-write it, and do not edit the generated primitive beyond what the skill allows.
- `prisma-cli` / `prisma-client-api` — the `createdAt` index migration and the `groupBy` with `_sum` / `_count`.
- `impeccable` — design pass for the dashboard layout, header density and chart palette against `DESIGN.md`.
- `03-create-tasks` → `04-execute-task` → `05-execute-qa` → `06-execute-review` — downstream consumers of this spec.

Deviation: `DESIGN.md`'s Single Accent Rule is relaxed for chart marks only. This is justified by FR18 (distinct slice colors) and approved by the user, and it is recorded in `DESIGN.md`.

### Relevant and dependent files

- Modified: `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css`, `src/server/transactions/create-transaction.ts` (+ test), `prisma/schema.prisma` (+ new migration), `vitest.config.ts`, `vitest.setup.ts`, `package.json`, `.env.example`, `DESIGN.md`.
- New: `src/app/transactions/page.tsx`; `src/components/layout/{app-header,app-nav}.tsx`; `src/components/dashboard/{month-navigation,category-breakdown-section,breakdown-type-toggle,category-pie-chart,category-slice,active-slice-readout,category-breakdown-list,category-breakdown-row,category-breakdown-empty-state}.tsx`; `src/hooks/{use-breakdown-type,use-active-slice}.ts`; `src/lib/months/{year-month,month-param,format-month,resolve-selected-month}.ts`; `src/lib/money/cents.ts`; `src/lib/format-percentage.ts`; `src/lib/dashboard/{dashboard-types,category-colors,build-category-breakdown,build-monthly-dashboard}.ts`; `src/server/dashboard/{get-monthly-category-totals,get-monthly-dashboard}.ts`; `src/components/ui/chart.tsx` (generated); `playwright.config.ts`; `e2e/**`. Each with a colocated `*.test.ts(x)`.
- Deleted: `src/components/transactions/transactions-header.tsx`.
- Reused unchanged: `summary-cards.tsx`, `summary-card.tsx`, `transactions-table.tsx`, `transaction-row.tsx`, `transactions-empty-state.tsx`, `new-transaction-dialog.tsx`, `new-transaction-form.tsx`, `theme-toggle.tsx`, `use-create-transaction-form.ts`, `format-currency.ts`, `transaction-types.ts`, `list-categories.ts`, `list-transactions.ts`, `get-transactions-summary.ts`.
