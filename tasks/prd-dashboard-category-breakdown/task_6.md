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

- [x] 6.1 Spike: throwaway Recharts v3 `Pie` with a custom `shape` wrapping `Sector` in `<g tabIndex={0}>`. Verify the payload/fill props and keyboard focus in the browser. Record the result below.
- [x] 6.2 `pnpm dlx shadcn@latest add chart` (adds `recharts` to `package.json`).
- [x] 6.3 `src/app/globals.css`: categorical `--chart-1..10` (light and dark) + `@theme inline` registrations, with contrast ratios.
- [x] 6.4 `DESIGN.md`: document the chart palette exception.
- [x] 6.5 `vitest.setup.ts`: `ResizeObserver` stub. Run `pnpm test` to confirm the existing suite is still green.

### Spike result

**Outcome: main approach confirmed** (custom `shape` + `<g tabIndex={0}>`). Verified in jsdom and in real Chrome (Playwright, Tab key).

- `shape` receives `PieSectorShapeProps`: `index`, `isActive`, `fill`, `name`, `value`, `percent`, `payload` (the original datum), plus geometry. `fill` comes from the datum's `fill` field.
- Recharts injects `stroke="#fff"` and `tabIndex={-1}` into those props. Spread them into `Sector`, then override `stroke` with `var(--card)`. The wrapper `<g tabIndex={0}>` gets focus and fires `onFocus`.
- **Extra tab stop:** `Pie` renders a root `<g class="recharts-pie" tabindex="0">` (`rootTabIndex` defaults to 0). Pass `rootTabIndex={-1}` to `Pie`, otherwise one unlabeled stop precedes the slices. With it, Tab order is slice A, slice B, next element.
- **jsdom:** `ResponsiveContainer` measures 0x0 even with `initialDimension`. The `ResizeObserver` stub in `vitest.setup.ts` therefore calls its callback on `observe` with a 320x320 rect, and slices render.
- **Generated file fix:** the shadcn CLI wrote `import { cn } from "cn"` in `chart.tsx` and added a bogus `cn` package. The package was removed and the import changed to `@/lib/utils`. The CLI also overwrote `card.tsx` (reverted with `git checkout`).

### Palette contrast vs `--card`

Light (`--card` white) 3.25 to 4.35:1, dark (`oklch(0.205 0 0)`) 6.14 to 10.22:1. Per-token ratios are in `globals.css` next to each token. Lowest is `--chart-4` amber at 3.25:1 in light.

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

- [x] Existing suite passes after the `ResizeObserver` stub (`pnpm test`).
- [x] The spike result is recorded. It is exercised by TU-34 and TU-35 in 7.0.
- [x] The palette contrast ratios are recorded. They are re-checked in `/05-execute-qa`.

## Relevant files

- `src/components/ui/chart.tsx` — new (generated)
- `package.json`, `pnpm-lock.yaml` — modified (`recharts`)
- `src/app/globals.css` — modified
- `DESIGN.md` — modified
- `vitest.setup.ts` — modified
