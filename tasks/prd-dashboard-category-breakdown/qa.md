# QA report — Dashboard Category Breakdown

Browser tool evidence is saved in `tasks/prd-dashboard-category-breakdown/evidences/`.

Environment: production build (`pnpm start`) on port **3101** against the dedicated `finance_e2e` database (fixture relative to the current UTC month, 2026-09). Browser tool: Playwright (Chromium) scripted runs plus the E2E suite. The Chrome DevTools MCP could not attach to a Chrome instance, so Playwright was used as the equivalent tool. The `finance` dev database was not touched. All processes on 3100/3101 were stopped and the ports confirmed free.

## Summary
- Date: 2026-09-25
- Status: APPROVED
- Total acceptance criteria: 25
- Acceptance criteria met: 25
- Bugs found: 1 (fixed, regression test added)

## Acceptance criteria verified
| ID | Acceptance criterion | Test cases | Status | Evidence |
|----|----------------------|------------|--------|----------|
| AC-01 | Header with links, theme toggle, New transaction on any page | TU-25, E2E-01 | PASSED | `dashboard-light-desktop.png`, `transactions-light-desktop.png` |
| AC-02 | Current nav link highlighted and exposed as current page | TU-26, TI-04, E2E-01 | PASSED | `bug01-fixed-nav-light.png` |
| AC-03 | Dialog opens from the dashboard with the same fields | E2E-05 | PASSED | `dialog-open.png` (Title, Amount, Type, Category) |
| AC-04 | Creating a $50 Groceries outcome updates breakdown and cards without reload | TU-24, E2E-05 | PASSED | E2E-05 (Groceries $650.00, 3 transactions, outcome $2,050.00, performance mark survives) |
| AC-05 | Creating on `/transactions` shows the row first and updates all-time cards | TU-24, E2E-06 | PASSED | E2E-06 |
| AC-06 | No month param selects the current month with Outcome default | TU-07, TU-30, TU-31, TU-38, TI-01, E2E-02 | PASSED | `dashboard-light-desktop.png` |
| AC-07 | Current month derived from the current date (UTC) | TU-03, TU-07, E2E-02 | PASSED | `dashboard-light-desktop.png` ("September 2026") |
| AC-08 | Month label between prev/next, next disabled on the current month | TU-27, TU-28, E2E-02 | PASSED | `dashboard-light-desktop.png` |
| AC-09 | Previous month updates URL and data, next returns | TU-04, TU-29, E2E-03 | PASSED | `ac09-previous-month.png` (`?month=2026-08`, $2,500 / $1,200 / $1,300) |
| AC-10 | Reload keeps the selected month | TU-01, TU-10, E2E-03 | PASSED | E2E-03 |
| AC-11 | Invalid/future month redirects to the current month | TU-02, TU-08, TU-09, TI-01, E2E-04 | PASSED | E2E-04 (`abc`, `2026-13`, `2026-00`, next month); manual `?month=abc` to `?month=2026-09` |
| AC-12 | Cards only include the selected month | TU-05, TU-20, TU-22, TU-23, TI-02, E2E-03 | PASSED | `ac09-previous-month.png` |
| AC-13 | `/transactions` cards show all-time totals | TI-04 | PASSED | `transactions-light-desktop.png` |
| AC-14 | No history table on `/`, table on `/transactions` | TI-02, TI-04 | PASSED | Browser: `table` count 0 on `/`, 1 on `/transactions` |
| AC-15 | Income toggle shows Salary 100.0%, others 0.0% | TU-16, TU-30, TU-23, E2E-07 | PASSED | `dashboard-income.png` |
| AC-16 | List shows amount, percentage, count for every category | TU-11, TU-12, TU-14, TU-21, TU-32 | PASSED | Housing $1,000.00 / 50.0% / 1 transaction, Groceries $600.00 / 30.0% / 2, Transport $400.00 / 20.0% / 1, others $0.00 / 0.0% / 0 |
| AC-17 | Category sum equals the card value to the cent | TU-13, TU-19, TU-20, TI-03 | PASSED | `dashboard-light-desktop.png` (cards vs list) |
| AC-18 | One slice per non-zero category, slice color equals swatch | TU-18, TU-34 | PASSED | Browser: 3 slices; fills `--chart-5/3/10` match the swatches of Housing/Groceries/Transport |
| AC-19 | Non-zero first by amount desc, then zeros alphabetically | TU-15 | PASSED | List order in `dashboard-light-desktop.png` |
| AC-20 | Empty state naming month and type, list at 0.0% | TU-17, TU-33, E2E-12 | PASSED | `dashboard-no-transactions-empty.png` |
| AC-21 | Focused slice shows and announces name, amount, percentage | TU-35, TU-36, TU-39, E2E-08 | PASSED | `ac21-slice-focus.png` (`role=status` readout "Salary: $3,000.00, 100.0%"; slice `aria-label` identical) |
| AC-22 | Chart text alternative and list carries all data without color | TU-37, TU-32, E2E-09 | PASSED | `figcaption` "Income by category — September 2026: Salary 100.0%"; list has name, amount, %, count as text |
| AC-23 | WCAG AA contrast for text and graphical elements, both themes | E2E-09 | PASSED (after BUG-01) | See Accessibility. axe: 0 violations on `/` and `/transactions`, both themes |
| AC-24 | Month nav, toggle, chart and top of list visible at 1280x800 | E2E-10, E2E-11 | PASSED | `dashboard-light-desktop.png`; no horizontal scroll at 360px |
| AC-25 | Empty state with no transactions on `/transactions` | TI-05 | PASSED | `ac25-transactions-empty.png` |

## E2E tests run
| ID | Flow | Result | Notes |
|----|------|--------|-------|
| E2E-01 | Header present, navigates between pages | PASSED | `pnpm test:e2e` |
| E2E-02 | Dashboard opens on the current month with Outcome selected | PASSED | |
| E2E-03 | Previous/next month, URL, data, reload | PASSED | |
| E2E-04 | Invalid and future month params redirect | PASSED | 4 params |
| E2E-05 | Create outcome from the dashboard | PASSED | No full reload |
| E2E-06 | Create transaction on the transactions page | PASSED | |
| E2E-07 | Income toggle | PASSED | |
| E2E-08 | Keyboard focus on a slice announces details | PASSED | |
| E2E-09 | axe audit, both themes, both pages | PASSED | 4 audits; found the income-amount contrast defect during task 10 (`text-emerald-600` to `text-emerald-700`) |
| E2E-10 | Above the fold at 1280x800 | PASSED | |
| E2E-11 | No horizontal scroll at 360px | PASSED | Both pages |
| E2E-12 | Month without outcome shows empty state | PASSED | |

Result: 19 passed (`pnpm test:e2e`), rerun after the BUG-01 fix.

## Automated tests and coverage
| Layer | ID | Result | Validation/command | Notes |
|-------|----|--------|--------------------|-------|
| Unit | TU-01..TU-10 | PASSED | `pnpm test` | `lib/months/*.test.ts` |
| Unit | TU-11..TU-21 | PASSED | `pnpm test` | `lib/dashboard/*.test.ts`, `lib/money/cents.test.ts`, `lib/format-percentage.test.ts` |
| Unit | TU-22, TU-23 | PASSED | `pnpm test` | `server/dashboard/*.test.ts` |
| Unit | TU-24 | PASSED | `pnpm test` | `server/transactions/create-transaction.test.ts` |
| Unit | TU-25, TU-26 | PASSED | `pnpm test` | `components/layout/*.test.tsx` |
| Unit | TU-27..TU-37 | PASSED | `pnpm test` | `components/dashboard/*.test.tsx` |
| Unit | TU-38, TU-39 | PASSED | `pnpm test` | `hooks/use-breakdown-type.test.ts`, `hooks/use-active-slice.test.ts` |
| Integration | TI-01..TI-03 | PASSED | `pnpm test` | `app/page.test.tsx`, `app/page-redirect.test.tsx` |
| Integration | TI-04, TI-05 | PASSED | `pnpm test` | `app/transactions/page.test.tsx` |

- Suite: 42 files, 239 tests, all passing (`pnpm test:coverage`).
- Coverage: statements 96.76%, branches 92.52%, functions 96.26%, lines 96.64%. Target is 80%, so it is met.
- `pnpm check`: still reports 81 errors, none blocking QA. They are outside this feature's behavior: mostly `useConsistentTypeDefinitions` (the project rules require `type` aliases), `noSvgWithoutTitle` in `public/*.svg`, and `noEmptyBlockStatements` in `vitest.setup.ts`. Recommend a separate cleanup or a `biome.json` override.

## Accessibility
| Item | `/` | `/transactions` | Result |
|------|-----|-----------------|--------|
| Keyboard navigation (Tab, Enter, Esc) | Tab order: Dashboard, Transactions, theme toggle, New transaction, previous month, Outcome, Income, slices in list order, then leaves the chart. Next month is disabled so it is skipped. Esc closes the dialog and focus returns to "New transaction". | Same header order. Dialog fields reachable in order, first focus on Title. | PASSED |
| Descriptive labels | "Go to August 2026", "Switch to dark theme", slices "Housing: $1,000.00, 50.0%", toggle group "Breakdown type" with `aria-pressed`, list labelled by the section heading | Table headers, dialog labels | PASSED |
| Images and alternative text | Chart `figure` with a `figcaption` summary. Decorative icons are `aria-hidden`. | Decorative icons are `aria-hidden` | PASSED |
| Color contrast | axe: 0 violations in light and dark. Chart marks against `--card`: light 3.24 to 4.34:1, dark 6.15 to 10.25:1 (all at least 3:1). | axe: 0 violations in light and dark | PASSED |
| Form labels | Dialog `label`/`htmlFor` for Title, Amount, Type, Category | Same dialog | PASSED |
| Error messages | Server error "Amount must be a positive number" rendered with `role="alert"` (`dialog-error-state.png`) | Same | PASSED |
| Font sizes | 12px (secondary text), 14px, 16px, 18px, 24px. Secondary text (12px) passes axe contrast. | Same | PASSED |
| Console | No console errors or warnings across 6 theme/breakpoint combinations | | PASSED |

Non-text contrast (AC-23) values recorded from the built app:
- Chart marks vs card, light: 3.70 3.67 4.33 3.24 3.51 3.90 3.63 3.77 4.27 4.34. Dark: 6.73 7.45 6.26 10.25 8.68 6.63 9.26 8.45 7.22 6.15.
- Active nav link, before BUG-01: background vs page 1.10:1 (light) and 1.33:1 (dark), which does not meet 3:1. Fixed below.

## Visuals and responsiveness
Captured in light and dark at 1280, 768 and 360px (`dashboard-*-{desktop,tablet,mobile}.png`, `transactions-*-*.png`). States covered: data, Income view, slice focus, previous month, empty breakdown, empty transactions, dialog open, dialog error. No overflow or layout breakage at any breakpoint. Observations, none blocking:
- A single 100% slice (Income with only Salary) draws a radial line in the focus outline (`ac21-slice-focus.png`). Cosmetic.
- The "Total balance" icon is low contrast in dark mode. It is decorative and pre-existing.

## Bugs found and fixed
| ID | Description | Severity | Status | Fix | Regression test | Evidence |
|----|-------------|----------|--------|-----|-----------------|----------|
| BUG-01 | The active nav link was distinguished only by a `secondary` background (1.10:1 light, 1.33:1 dark against the page). AC-23 requires the active nav link to meet 3:1 and axe does not check it. | Medium | Fixed | `src/components/layout/app-nav.tsx`: the current link now gets `underline decoration-2 underline-offset-8` (foreground color, at least 14:1). | `app-nav.test.tsx` "underlines the current page so the state does not rely on the low-contrast background". Verified it fails when the fix is removed. | `bug01-fixed-nav-light.png`, `bug01-fixed-nav-dark.png` |

Also fixed earlier (task 10, caught by the E2E-09 audit): income amounts in the transactions table used `text-emerald-600` (3.65:1). They now use `text-emerald-700` in light mode, and the axe audit passes.

## Conclusion
All 25 acceptance criteria are verified and met. The 19 E2E tests and 239 unit/integration tests pass, coverage is 96.8% statements against an 80% floor, and both themes pass axe with no violations. One defect (BUG-01, active nav contrast) was fixed at the root with a regression test. **APPROVED.** Open item outside the feature: the pre-existing `pnpm check` lint backlog (81 errors).
