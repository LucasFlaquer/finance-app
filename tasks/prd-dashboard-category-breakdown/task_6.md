# Task 6.0: Chart foundation (shadcn `chart`, categorical palette, Recharts spike)

## Overview

Prepare everything the pie chart needs. Add the shadcn `chart` component (which brings in `recharts`), replace the unused grayscale `--chart-1..5` with a 10-hue categorical palette for light and dark themes (contrast ratios against `--card` recorded next to the tokens), record the palette as a scoped exception in `DESIGN.md`, and add a `ResizeObserver` stub to `vitest.setup.ts`. **Spike first:** confirm that a Recharts v3 `Pie` `shape` receives the payload and fill, and that a `<g tabIndex={0}>` wrapper can receive focus. The spike result decides whether 7.0 uses the main approach or the fallback.

**Depends on:** none. **Blocks:** 7.0.

<skills>
### Skills compliance

- `shadcn`: add the component with `pnpm dlx shadcn@latest add chart`. Do not hand-write or edit the generated `src/components/ui/chart.tsx`.
- `impeccable`: palette design pass against `DESIGN.md` (hues distinct from the emerald and red money hues, legible in both themes).
</skills>

<rules>
### AGENTS.md and rules compliance

Read `AGENTS.md`, `.claude/rules/code-standards.md`, `.claude/rules/react.md` and `.claude/rules/tests.md`. Relevant rules:

- Design tokens live in `globals.css`. Components use tokens, never raw hex.
- `src/components/ui/**` is generated. Its `...props` passthrough is allowed (react.md exception).
- No external chart APIs. Recharts renders locally (PRD "no third-party services").

**Justified deviation:** `DESIGN.md` Single Accent / Money Duotone rules are relaxed for chart marks only (FR18, user-approved, recorded in `DESIGN.md`).
</rules>

<requirements>
- Ten distinct categorical hues, `--chart-1..10`, in `:root` and `.dark`, registered as `--color-chart-1..10` in `@theme inline` (FR18).
- Slices and swatches reach ≥ 3:1 non-text contrast against `--card` in both themes (WCAG 1.4.11, AC-23). Ratios are recorded next to the tokens.
- `ChartContainer` mounts in jsdom (`ResizeObserver` stub).
- The spike's outcome (main approach or fallback) is written down in this task file before 7.0 starts.
</requirements>

## Subtasks

- [ ] 6.1 Spike: throwaway Recharts v3 `Pie` with a custom `shape` wrapping `Sector` in `<g tabIndex={0}>`. Verify the payload/fill props and keyboard focus in the browser. Record the result below.
- [ ] 6.2 `pnpm dlx shadcn@latest add chart` (adds `recharts` to `package.json`).
- [ ] 6.3 `src/app/globals.css`: categorical `--chart-1..10` (light and dark) + `@theme inline` registrations, with contrast ratios.
- [ ] 6.4 `DESIGN.md`: document the chart palette exception.
- [ ] 6.5 `vitest.setup.ts`: `ResizeObserver` stub. Run `pnpm test` to confirm the existing suite is still green.

### Spike result

_To be filled during 6.1: main approach (custom `shape` + `<g tabIndex>`) or fallback (per-slice `Sector` wrapper)._

## Implementation details

See `techspec.md`:

- "Component overview" → **Styles / schema / tooling** (`globals.css`, `chart.tsx`, `DESIGN.md`, `vitest.setup.ts`).
- "Development sequencing" → step 6 (spike and fallback).
- "Key decisions" → **Recharts via shadcn `chart`** and **Categorical chart palette as a scoped design exception**.
- "Known risks" → **Recharts `Pie` `shape` API details in v3**, **Recharts in jsdom**, **Palette contrast (WCAG 1.4.11)**.
- "Testing approach" → the AC-23 non-text contrast paragraph under E2E.

## Related acceptance criteria

- AC-18
- AC-23

## Task tests

The TechSpec defines no test cases for this task. It is infrastructure plus a spike. Validation:

- [ ] Existing suite passes after the `ResizeObserver` stub (`pnpm test`).
- [ ] The spike result is recorded. It is exercised by TU-34 and TU-35 in 7.0.
- [ ] The palette contrast ratios are recorded. They are re-checked in `/05-execute-qa`.

## Relevant files

- `src/components/ui/chart.tsx` — new (generated)
- `package.json`, `pnpm-lock.yaml` — modified (`recharts`)
- `src/app/globals.css` — modified
- `DESIGN.md` — modified
- `vitest.setup.ts` — modified
