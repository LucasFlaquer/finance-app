# Code review report — Dashboard Category Breakdown

## Summary
- Date: 2026-09-25
- Branch: master (uncommitted working tree; no feature branch)
- Status: APPROVED WITH RESERVATIONS

Tests, typecheck, production build and E2E all pass, and the implementation matches the TechSpec. `pnpm check` (Ultracite) still exits non-zero with 70 diagnostics. None come from a functional defect: they are rule conflicts with `.claude/rules/react.md`, generated shadcn code, pre-existing files, or a design the TechSpec mandates. This is the only reason the verdict is not plain APPROVED.

## Rules compliance
| Rule | Status | Notes |
|------|--------|-------|
| code-standards: no comments | OK | Only `month-param.ts:5` (regex intent), which the rule allows. |
| code-standards: file ≤ 100 lines | OK | Four test files were over the limit (see Problems found, fixed). All `.ts`/`.tsx` files are now ≤ 100 lines. |
| code-standards: function ≤ 30 lines, ≤ 3 params, guard clauses | OK | `BuildCategoryBreakdownParams` is a param object. `resolveSelectedMonth` and `parseMonthParam` use guard clauses. |
| code-standards: no blank lines inside functions | OK | Blank lines only between class methods in `vitest.setup.ts`. |
| code-standards: magic numbers/strings as constants | OK | `CENTS_PER_UNIT`, `CHART_PALETTE_SIZE`, `PERCENTAGE_SCALE`, `MONTH_PARAM`, `NO_TAB_STOP`, etc. |
| code-standards: no hardcoded secrets | OK | `E2E_DATABASE_URL` comes from `.env`, and `.env.example` has the placeholder. `readE2eDatabaseUrl` refuses names not ending in `_e2e`. |
| code-standards: prefer narrowing over type assertions | OK (minor) | `group.type as TransactionType` in `get-monthly-category-totals.ts:22` and two casts in `vitest.setup.ts` (test stub). Low. |
| react: function components, no `React.FC`, no `forwardRef`, no prop spreading | OK | No `{...props}` in application code. |
| react: no unnecessary `useEffect` | OK | None added. |
| react: `useMemo` only for heavy work or stable references | OK (minor) | `category-pie-chart.tsx:24-28` memoizes `slices` and `data`. `data` feeds the memoized `CategoryPieCanvas`, which the rule allows. `slices` is cheap. The TechSpec said "no useMemo". Low. |
| react: data access out of components | OK | Prisma is only used in `src/server/**`. |
| react: logic in `use*` hooks | OK | `use-breakdown-type.ts`, `use-active-slice.ts`. |
| react: accessibility attributes | OK | `nav` with `aria-label`, `aria-current`, `aria-pressed`, `role="group"`, labelled month links, `figure`/`figcaption`, `output aria-live`, `aria-hidden` icons. axe reports 0 violations in both themes. |
| react: Tailwind, `cn`, tokens; `style` only when dynamic | OK | The only `style` is `backgroundColor: row.color` on the swatch. |
| tests: Vitest / Playwright, pyramid | OK | 239 Vitest tests and 19 Playwright tests. |
| tests: FIRST, AAA, one concept per test | OK | Time is frozen or `now` is passed, Prisma is mocked, one behavior per `it`. |
| tests: no test whose only assertion is `toBeDefined` etc. | OK | Assertions check values, names, attributes. |
| tests: coverage ≥ 80% | OK | 96.97% statements, 92.72% branches, 96.46% functions, 96.87% lines. |
| AGENTS.md: `pnpm check` clean | NOK | 70 diagnostics (see Problems found). Not caused by this feature's behavior. |

## TechSpec adherence
| Technical decision | Implemented | Notes |
|--------------------|-------------|-------|
| `/` reads `searchParams.month`, `redirect()` on invalid or future value, parallel fetch | YES | `src/app/page.tsx`. `resolveSelectedMonth` handles missing, malformed, array and future values. |
| `/transactions` route with all-time cards and history | YES | `src/app/transactions/page.tsx`. |
| Shared `AppHeader` and `AppNav` (props only, `aria-current`), `transactions-header.tsx` deleted | YES | The month navigation goes through the `children` slot. |
| UTC month logic in `src/lib/months/*` | YES | `Date.UTC`, `getUTC*`, `Intl` with `timeZone: "UTC"`. |
| Single `groupBy(categoryId, type)` with `gte`/`lt` range | YES | `get-monthly-category-totals.ts`. |
| Integer-cents math; `summary` and breakdown totals come from the same data (G2) | YES | `buildMonthlyDashboard` derives the summary from the breakdown totals. |
| Percentage `Math.round(cents*1000/total)/10`, ordering (non-zero by amount desc then name, zeros last), stable color by alphabetical index | YES | `build-category-breakdown.ts`, `category-colors.ts`. |
| Both breakdowns precomputed, toggle is client state | YES | `useBreakdownType` defaults to `OUTCOME`. |
| Slice `shape` with `<g tabIndex=0 role="img" aria-label>`, no Recharts `Tooltip`, `accessibilityLayer={false}` | YES | `category-slice.tsx`, `category-pie-canvas.tsx`. |
| `figure`/`figcaption` text alternative, `output aria-live` readout | YES | `category-pie-chart.tsx`, `active-slice-readout.tsx`. |
| `revalidatePath("/", "layout")` after create | YES | `create-transaction.ts`, test updated. |
| `@@index([createdAt])` and migration | YES | `20260925184229_add_transaction_created_at_index`. |
| Categorical `--chart-1..10` tokens (light and dark) and DESIGN.md exception | YES | Ratios recorded next to the tokens. |
| shadcn `chart` added via CLI, `recharts` dependency | YES | `src/components/ui/chart.tsx`, `recharts` 3.8.0. |
| Playwright wiring, global setup on `finance_e2e`, Vitest excludes `e2e/**`, coverage include broadened, `ResizeObserver` stub | YES | Port 3100. `pnpm test:e2e` builds, migrates, reseeds relative to the current UTC month. |
| No `useMemo` in the dashboard components | NO (justified) | `category-pie-chart.tsx` uses it to keep a stable `data` reference for the memoized canvas, which `react.md` allows. Not blocking. |

## Tasks verified
| Task | Status | Notes |
|------|--------|-------|
| 1.0 Month helpers | COMPLETE | Code and tests for TU-01..10. |
| 2.0 Money and breakdown logic | COMPLETE | TU-11..21, split across several test files. |
| 3.0 Index migration and server modules | COMPLETE | TU-22..23. |
| 4.0 Shared header and layout revalidation | COMPLETE | TU-24..26. |
| 5.0 Transactions page | COMPLETE | TI-04..05. |
| 6.0 Chart foundation | COMPLETE | shadcn chart, palette, `ResizeObserver` stub, DESIGN.md. |
| 7.0 Accessible pie chart | COMPLETE | TU-34..37, TU-39. |
| 8.0 Remaining dashboard components | COMPLETE | TU-27..33, TU-38. |
| 9.0 Dashboard page rewrite | COMPLETE | TI-01..03. |
| 10.0 Playwright, E2E suite, coverage config | COMPLETE | 19 E2E tests (E2E-01..12 plus the parametrized redirects and axe runs). |

## Tests
- Total tests: 239 unit/integration (44 files) + 19 E2E = 258
- Passing: 258
- Failing: 0
- Coverage: 96.97% statements / 92.72% branches / 96.46% functions / 96.87% lines (target 80%, met)
- Other validations: `tsc --noEmit` clean; `next build` succeeded as part of `pnpm test:e2e`; `pnpm check` FAILS (70 diagnostics, see below).

Environment used: `docker compose` PostgreSQL that was already running (the user's own), dedicated `finance_e2e` database, production server on port 3100 (fixed by `playwright.config.ts`, started and stopped by Playwright). Afterwards ports 3000, 3100 and 3101 were free, with no leftover `next`/`playwright` processes. The `finance` development database was not touched.

## Problems found
| Severity | File | Line | Description | Suggestion |
|----------|------|------|-------------|------------|
| Medium | `category-breakdown-section.test.tsx`, `category-pie-chart.test.tsx`, `app/transactions/page.test.tsx`, `server/transactions/create-transaction.test.ts` | – | Four test files were over the 100-line limit (148, 147, 102, 103). **Fixed:** fixtures extracted to `category-breakdown-section-fixtures.tsx`, `category-pie-chart-fixtures.tsx`, `app/testing/transactions-page-fixtures.ts`, `create-transaction-form-data.ts`. Section and chart tests split into `*-empty.test.tsx` and `*-interaction.test.tsx`. Test count is unchanged (239). | – |
| Low | `category-pie-chart.test.tsx` (8), `app-header.test.tsx` (1) | – | Regex literals inside tests (`useTopLevelRegex`), plus the `noEmptyBlockStatements` errors in `vitest.setup.ts`. **Fixed:** exact slice names as constants, a hoisted `SWITCH_THEME_PATTERN`, and `vi.fn()` for the stub methods. | – |
| Low | `tasks/prd-dashboard-category-breakdown/task_8.md-E` | – | Stray `sed -i` backup file (older copy with unchecked boxes). **Fixed:** deleted. | – |
| Low | repo-wide (47 diagnostics) | – | `lint/style/useConsistentTypeDefinitions` wants `interface`; `react.md` examples and the whole codebase use `type`. The two rule sets conflict. `react.md` takes precedence, so this is not fixed. | Add a `biome.json` override to disable the rule, or add a line to the rules docs. |
| Low | `components/ui/chart.tsx`, `ui/dialog.tsx`, `ui/label.tsx`, `public/*.svg` | – | About 14 diagnostics in generated shadcn primitives and Next.js starter SVGs. `chart.tsx` must come from the CLI and not be hand-edited. | Ignore `src/components/ui/**` and `public/**` in `biome.json`. |
| Low | `category-slice.tsx`, `breakdown-type-toggle.tsx` | 17-22, 20-30 | `noJsxPropsBind` (inline handlers), `noInteractiveElementToNoninteractiveRole` (`tabIndex` on `role="img"`) and `useSemanticElements` (`role="group"`). The a11y shape is required by the TechSpec and passed axe. The handler pattern already exists in `new-transaction-dialog.tsx`. | Disable the perf rule in `biome.json`; keep the spec design. |
| Low | `category-pie-chart.tsx` | 24-28 | `useMemo` on a cheap `filter`. The `data` memo is justified, the `slices` one is not. | Optional: derive `slices` without `useMemo`. |
| Low | `get-monthly-category-totals.ts` | 22 | `group.type as TransactionType` type assertion. | Use the Prisma enum type directly if the generated type is compatible. |
| Low | `package.json` / `AGENTS.md` | – | `AGENTS.md` documents `pnpm lint`, but there is no `lint` script; running it fails with `Command "eslint" not found`. | Add `"lint": "biome check"` or fix the docs. |

## Strengths
- The critical money and percentage logic is small pure functions on integer cents, tested in several files: ordering, rounding, zero totals, colors, exact-sum equality.
- Cards and breakdown come from one `groupBy`, so G2 holds by construction (TI-03 confirms it).
- Careful accessibility work: keyboard focus per slice with a readout, a text alternative, contrast ratios recorded beside the tokens, axe clean in both themes.
- The E2E setup is isolated: a dedicated `_e2e` database with a name guard, a fixture relative to the current UTC month, and no shared state between tests.
- The layers stay clean: Prisma only in `src/server`, hooks for state, param objects, no prop spreading.
- The shadcn `chart` was added through the CLI, and the design exception is recorded in `DESIGN.md`.

## Recommendations
- Reconcile the Biome/Ultracite config with the project rules (`useConsistentTypeDefinitions` off, ignore `components/ui/**` and `public/**`) so `pnpm check` becomes a usable gate again (it fails today).
- Add the missing `lint` script or fix `AGENTS.md`.
- The E2E run cannot control the server clock, so it may misbehave around a UTC month rollover (already noted in the TechSpec).
- Commit on a feature branch; the work currently sits uncommitted on `master`.

## Conclusion
The implementation follows the TechSpec, every task is complete with its tests, and all 258 tests pass with 96.97% coverage. I fixed the violations that could be fixed within this feature: the four oversized test files, the regex and empty-block lint errors, and a stray backup file. The remaining `pnpm check` diagnostics come from a conflict between Ultracite defaults and the project rules, generated or pre-existing files, and the accessibility design the TechSpec mandates. No security issue was found. **APPROVED WITH RESERVATIONS.**
