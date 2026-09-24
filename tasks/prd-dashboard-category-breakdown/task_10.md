# Task 10.0: Playwright E2E wiring, E2E suite and coverage config

## Overview

Wire up Playwright for the first time and cover the critical journeys end to end:

- Config: `webServer: pnpm build && pnpm start` on port 3100, pointed at a dedicated `finance_e2e` database.
- Global setup: migrate, then seed a deterministic fixture **relative to the current UTC month**.
- Accessibility audits with axe in both themes.

Then expand the Vitest `coverage.include`, exclude `e2e/**` from Vitest, and run the full quality gate.

**Depends on:** 1.0–9.0.

<skills>
### Skills compliance

- `prisma-cli`: `prisma migrate deploy` and seeding against `finance_e2e` in `e2e/global-setup.ts`.
</skills>

<rules>
### AGENTS.md and rules compliance

Read `AGENTS.md`, `.claude/rules/code-standards.md`, `.claude/rules/react.md` and `.claude/rules/tests.md`. Relevant rules:

- The E2E layer is the smallest one: critical journeys only (tests.md pyramid).
- Independent: mutating tests (E2E-05, E2E-06) reseed in `beforeEach`.
- Repeatable: the server clock cannot be frozen, so expected labels are computed with the same `src/lib/months` helpers. A UTC month rollover during a run is documented as acceptable.
- AAA (GIVEN/WHEN/THEN) and one concept per test. Queries by role and name.
- No secrets: `E2E_DATABASE_URL` is read from `.env`, with a placeholder added to `.env.example`.
- 80% coverage floor over the broadened `coverage.include`.

Prisma setup (per `AGENTS.md`): schema `prisma/schema.prisma`, seed `prisma/seed.ts` / `prisma/seed-data.ts`, `prisma migrate deploy` for the E2E database. Prisma 7 does not auto-seed after migrations, so the seed runs explicitly.
</rules>

<requirements>
- Playwright runs against a production build with a separate database. It never touches `finance` (the dev database).
- The seed covers: current month with known outcome in 3 categories and a Salary income; previous month with different amounts; two months back with income only.
- The E2E suite covers AC-01 to AC-24 as mapped below.
- `pnpm test:coverage` passes the 80% threshold and `pnpm check` is clean.
</requirements>

## Subtasks

- [ ] 10.1 Install `@playwright/test` and `@axe-core/playwright`, run `pnpm exec playwright install chromium`, and add a `test:e2e` script to `package.json`.
- [ ] 10.2 `playwright.config.ts` (port 3100, `webServer`, `DATABASE_URL` = `E2E_DATABASE_URL`). Add `E2E_DATABASE_URL` to `.env.example`.
- [ ] 10.3 `e2e/global-setup.ts`: create `finance_e2e` if missing, `prisma migrate deploy`, deterministic seed relative to the current UTC month (reusable reseed helper).
- [ ] 10.4 E2E specs (E2E-01 to E2E-12).
- [ ] 10.5 `vitest.config.ts`: `exclude` `e2e/**`. `coverage.include` adds `src/lib/**`, `src/hooks/**`, `src/server/**`, `src/components/**` (excluding `src/components/ui/**`) and `src/app/**/page.tsx`.
- [ ] 10.6 Run `pnpm test:coverage`, `pnpm test:e2e` and `pnpm check`. Fix any gaps.

## Implementation details

See `techspec.md`:

- "E2E tests" table and **Setup** paragraph.
- The AC-23 non-text contrast paragraph (axe does not check it; recorded ratios from 6.0, re-checked in QA).
- "Testing approach" → the `coverage.include` list.
- "Development sequencing" → step 9 and **Technical dependencies**.
- "Known risks" → **E2E clock is not controllable on the server**.

## Related acceptance criteria

- AC-01
- AC-02
- AC-03
- AC-04
- AC-05
- AC-06
- AC-07
- AC-08
- AC-09
- AC-10
- AC-11
- AC-12
- AC-15
- AC-20
- AC-21
- AC-22
- AC-23
- AC-24

## Task tests

### E2E tests

- [ ] E2E-01 — header is present and navigates between pages
- [ ] E2E-02 — dashboard opens on the current month with Outcome selected
- [ ] E2E-03 — previous/next month updates URL and data and survives reload
- [ ] E2E-04 — invalid and future month params redirect to the current month
- [ ] E2E-05 — creating an outcome from the dashboard updates the breakdown
- [ ] E2E-06 — creating a transaction on the transactions page updates history
- [ ] E2E-07 — switching to Income shows income categories
- [ ] E2E-08 — keyboard focus on a slice announces its details
- [ ] E2E-09 — pages pass an automated accessibility audit in both themes
- [ ] E2E-10 — dashboard key content is above the fold at 1280×800
- [ ] E2E-11 — pages do not scroll horizontally at 360px
- [ ] E2E-12 — a month without outcome shows the empty state

## Relevant files

- `playwright.config.ts` — new
- `e2e/global-setup.ts` — new
- `e2e/*.spec.ts` — new
- `package.json`, `pnpm-lock.yaml` — modified (deps, `test:e2e`)
- `.env.example` — modified (`E2E_DATABASE_URL`)
- `vitest.config.ts` — modified (`exclude`, `coverage.include`)
- `prisma/seed.ts`, `prisma/seed-data.ts` — reference for seeding
