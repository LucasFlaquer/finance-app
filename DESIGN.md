---
name: Finance App
description: A pocket-sized ledger for tracking income and outcome, one entry at a time.
colors:
  vault-green: "oklch(0.508 0.118 165.612)"
  vault-green-foreground: "oklch(0.979 0.021 166.113)"
  income-emerald: "oklch(0.596 0.145 163.225)"
  outcome-red: "oklch(0.577 0.245 27.325)"
  paper: "oklch(1 0 0)"
  ink: "oklch(0.145 0 0)"
  quiet-surface: "oklch(0.97 0 0)"
  quiet-ink: "oklch(0.556 0 0)"
  chip-surface: "oklch(0.967 0.001 286.375)"
  chip-ink: "oklch(0.21 0.006 285.885)"
  hairline: "oklch(0.922 0 0)"
  focus-ring: "oklch(0.708 0 0)"
typography:
  display:
    fontFamily: "Nunito Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: "2rem"
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Nunito Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 500
    lineHeight: "1.75rem"
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Nunito Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: "1.375"
    letterSpacing: "normal"
  body:
    fontFamily: "Nunito Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: "1.25rem"
    letterSpacing: "normal"
  label:
    fontFamily: "Nunito Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: "1rem"
    letterSpacing: "normal"
  numeral:
    fontFamily: "Nunito Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: "2rem"
    letterSpacing: "-0.025em"
    fontFeature: "tabular-nums"
rounded:
  sm: "0.27rem"
  md: "0.36rem"
  lg: "0.45rem"
  xl: "0.63rem"
  pill: "1.17rem"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  page: "40px"
components:
  button-primary:
    backgroundColor: "{colors.vault-green}"
    textColor: "{colors.vault-green-foreground}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "0 10px"
    height: "32px"
  button-primary-hover:
    backgroundColor: "color-mix(in oklch, oklch(0.508 0.118 165.612) 80%, transparent)"
    textColor: "{colors.vault-green-foreground}"
  button-outline:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "0 10px"
    height: "32px"
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.xl}"
    padding: "16px"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "4px 10px"
    height: "32px"
  badge-secondary:
    backgroundColor: "{colors.chip-surface}"
    textColor: "{colors.chip-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "2px 8px"
    height: "20px"
---

# Design System: Finance App

## Overview

**Creative North Star: "The Pocket Teller"**

A bank window that fits in a hand. The product is used standing up, one-handed, seconds after money moves — so every surface has to earn its place on a small screen, and the interface behaves like a teller who already knows why you walked up: it shows the balance, takes the entry, and gets out of the way.

The register is quiet and monetary. A single desaturated green (Vault Green) carries brand and action; money itself speaks in a separate two-tone language of emerald for income and red for outcome, and nothing else in the system is allowed to borrow those two colors. Type is a soft humanist sans (Nunito Sans) run at small sizes with tight tracking, with tabular figures wherever a number can be compared to another number. Surfaces are near-white paper with hairline rings, gently lifted so a card reads as a physical slip rather than a painted rectangle.

Density is compact by intent — 32px controls, 16px card padding, 16px gaps — because the design starts at a phone and grows outward, never the reverse. What it rejects: crypto-fintech neon (glassmorphism, gradient glow, purple-to-cyan), corporate bank blue (navy chrome, enterprise widget density), and playful cartoon budgeting (mascots, confetti, pastel gamification).

**Key Characteristics:**
- Mobile-first density: 32px control height, 16px rhythm, thumb-reachable primary action
- One brand green, held apart from the money colors
- Emerald/red as a strict semantic pair, never decoration
- Tabular numerals on every figure, right-aligned in tables
- Near-white paper, hairline rings, gentle ambient lift
- Rounded but not soft: 7.2px base radius, pill only for category chips

## Colors

A near-neutral grayscale field with exactly three saturated voices: one brand green and two money tones.

### Primary
- **Vault Green** (`oklch(0.508 0.118 165.612)`): The brand and action color. Fills the primary button, tints the balance card's icon well at 10% opacity, and colors links. Desaturated and mid-dark — the color of the container, not the contents. Dark mode drops it to `oklch(0.432 0.095 166.913)` so it does not glare on a near-black field.

### Secondary
- **Income Emerald** (`oklch(0.596 0.145 163.225)`): Money arriving. Amount text on income rows, the income summary figure, and its icon well at 10% opacity. Lifts to `oklch(0.765 0.177 163.223)` in dark mode for contrast. Brighter and more chromatic than Vault Green on purpose — the two must never be confused.
- **Outcome Red** (`oklch(0.577 0.245 27.325)`): Money leaving, and destructive intent. Amount text on outcome rows, the outcome summary figure, form error text, and invalid-field rings. `oklch(0.704 0.191 22.216)` in dark mode.

### Neutral
- **Paper** (`oklch(1 0 0)`): Page and card background in light mode. Cards do not tint away from the page; separation comes from ring and lift, not fill.
- **Ink** (`oklch(0.145 0 0)`): Primary text, table headers, transaction titles, the neutral balance figure.
- **Quiet Ink** (`oklch(0.556 0 0)`): Supporting text — card labels, dates, descriptions, placeholders, empty-state copy.
- **Quiet Surface** (`oklch(0.97 0 0)`): Hover fill for rows and ghost buttons, muted panels.
- **Chip Surface / Chip Ink** (`oklch(0.967 0.001 286.375)` / `oklch(0.21 0.006 285.885)`): The category badge only. The one place a faintly cool neutral appears.
- **Hairline** (`oklch(0.922 0 0)`): Borders, table row rules, input strokes. In dark mode borders become `oklch(1 0 0 / 10%)` — light at 10%, never a solid gray.
- **Focus Ring** (`oklch(0.708 0 0)`): Neutral focus color, always rendered as a 3px ring at 50% opacity plus a border shift.

### Named Rules
**The Money Duotone Rule.** Emerald and red mean income and outcome. Nothing decorative may use them — no emerald success toasts, no red badges for non-financial state. If a color on screen is emerald or red, a user is entitled to read it as money direction.

**The Single Accent Rule.** Vault Green is the only brand color. Never introduce a second accent hue for a new feature; reach for neutral weight, position, or the money duotone instead.

**The No-Tinted-Card Rule.** Card backgrounds equal the page background. Depth comes from the hairline ring and ambient lift. A card that tints itself is a card that has stopped being paper.

## Typography

**Display / Body Font:** Nunito Sans (with `ui-sans-serif, system-ui, sans-serif`) — one family across the whole system, loaded as `--font-sans`.
**Mono Font:** Geist Mono (`--font-geist-mono`), available but unused in the current surface; reserve it for raw identifiers, never for money.

**Character:** Humanist, slightly rounded, low-contrast — friendly enough for a personal tool, neutral enough that a currency figure never looks styled. Every size below `1.125rem` runs at default tracking; everything at or above it gets `-0.025em` so headings and figures stay tight at small scale.

### Hierarchy
- **Display** (600, `1.5rem`/`2rem`, `-0.025em`): The page title ("Transactions") and every large money figure on a summary card. One per region, never two competing.
- **Headline** (500, `1.125rem`/`1.75rem`, `-0.025em`): Section headings inside the page ("History").
- **Title** (500, `1rem`, `1.375`): Card titles and dialog titles.
- **Body** (400, `0.875rem`/`1.25rem`): The default. Table cells, descriptions, form labels, buttons, empty-state copy. Supporting prose is capped near `24rem` (`max-w-sm`) so it never runs long on a phone.
- **Label** (500, `0.75rem`/`1rem`): Category badges and other chip text. Sentence case — never uppercase, never letter-spaced.
- **Numeral** (600, `1.5rem`, tabular): Summary figures. Row amounts use the same tabular treatment at body size and 600 weight.

### Named Rules
**The Tabular Money Rule.** Every rendered amount and date carries `tabular-nums`. Figures that sit in a column must align on the decimal, at any weight or size.

**The One Family Rule.** Nunito Sans carries display, body, and label. Hierarchy is made from weight, size, and tracking — never from a second display face.

**The Sentence Case Rule.** All UI copy is sentence case, including buttons and headers ("New transaction", "Total income"). No uppercase labels, no title case.

## Layout

A single centered column, mobile-first. The page is a `max-w-5xl` (64rem) container with `24px` horizontal padding and `40px` vertical padding, and it stacks its regions — header, summary, history — at a `32px` gap. Inside a region the rhythm tightens to `16px`, and inside a component to `8px`.

The spacing scale is a strict 4/8/16/24/32/40 ladder; no value off that ladder appears in layout code. Summary cards are a single stacked column and become three equal columns at `sm` (640px) — the only breakpoint the system uses. The transaction table is horizontally scrollable inside its rounded container rather than reflowing or truncating, so a narrow screen never hides a column.

The page header wraps: title and subtitle on one line, the primary action falling below on narrow screens and returning to the baseline-aligned right edge when there is room.

### Named Rules
**The One Column Rule.** The layout is one column that widens. Multi-column arrangements are permitted only inside a region (the summary grid), never as page structure.

**The Scroll-Don't-Squeeze Rule.** Tabular data scrolls sideways in its own container. Never shrink a money column to fit, never truncate an amount.

## Elevation & Depth

Gently layered. Every surface sits on the page with a `1px` hairline ring at 10% foreground opacity, and resting containers carry a soft ambient shadow that reads as a slip of paper laid down rather than a panel bolted on. Overlays lift further: the dialog and the select menu take a stronger shadow, and the dialog dims the page behind it with `black/10` plus a small backdrop blur rather than a heavy scrim.

Depth is never carried by color. A raised surface has the same background as the page beneath it; the ring and the shadow do all the work.

### Shadow Vocabulary
- **Resting** (`box-shadow: 0 1px 2px oklch(0.145 0 0 / 0.04), 0 2px 8px oklch(0.145 0 0 / 0.04)`): Cards and the table container at rest.
- **Overlay** (`box-shadow: 0 4px 6px -1px oklch(0.145 0 0 / 0.1), 0 2px 4px -2px oklch(0.145 0 0 / 0.1)`): Select menus and dialogs.
- **Scrim** (`background: oklch(0 0 0 / 0.1)` + `backdrop-filter: blur(4px)`): Behind a dialog only.

### Named Rules
**The Ring-First Rule.** Every elevated surface gets the hairline ring first; shadow is added on top of it, never in place of it. In dark mode the ring becomes `oklch(1 0 0 / 10%)` and the shadow all but disappears — depth there is carried by the lighter card fill (`oklch(0.205 0 0)` against a `oklch(0.145 0 0)` page).

**The Two-Step Rule.** There are exactly two elevations: resting and overlay. Nothing sits between them, and nothing stacks above an overlay.

*Current implementation note:* resting surfaces ship today with the ring but no ambient shadow. The Resting shadow above is the committed doctrine; apply it on the next pass over `card.tsx` and the table container.

## Shapes

Rounded, not soft. One radius scale derives from a `0.45rem` (7.2px) base: `sm` 4.3px, `md` 5.8px, `lg` 7.2px, `xl` 10.1px. Controls — buttons, inputs, select triggers — take `lg`. Containers — cards, dialogs, the table shell, the empty state — take `xl`. Category badges and icon wells are the only fully round forms: badges are pills (`1.17rem`), summary icon wells are perfect circles at `36px`.

Borders are always exactly `1px`, in Hairline or as a foreground ring at 10%. The empty state is the single place a dashed stroke appears, marking an absence of content rather than a container.

### Named Rules
**The Circle-Means-Icon Rule.** Full-round shapes are reserved for category chips and icon wells. A rectangular element never becomes a pill to attract attention.

## Components

### Buttons
- **Character:** Tactile and thumb-ready — compact, but with a visible physical response.
- **Shape:** `lg` radius (7.2px), `32px` tall by default (`36px` at `lg`, `28px` at `sm`), `10px` horizontal padding, `6px` gap to an icon.
- **Primary:** Vault Green fill, near-white green-tinted text, weight 500 at body size. The one primary action per screen.
- **Outline:** Paper fill, hairline border, Ink text; hovers to Quiet Surface. Used for Cancel.
- **Ghost:** No fill at rest, Quiet Surface on hover. Used for low-weight and icon-only controls.
- **Hover / Active / Focus:** Primary fades to 80% opacity on hover; every non-popup button nudges down `1px` on press (`active:translate-y-px`); focus-visible shifts the border to the ring color and adds a `3px` ring at 50%.
- **Busy:** A submitting button sets `aria-busy`, disables, and swaps its label to the present participle ("Saving…"). Never a spinner-only button.

### Chips
- **Style:** Pill, Chip Surface fill, Chip Ink text, label typography, `20px` tall, `8px` horizontal padding.
- **Use:** Category names on transaction rows. Chips are informational here, not filters — they carry no selected state and no hover affordance unless they become links.

### Cards / Containers
- **Corner Style:** `xl` radius (10.1px).
- **Background:** Paper, matching the page.
- **Shadow Strategy:** Resting shadow plus hairline ring (see Elevation & Depth).
- **Border:** `1px` foreground ring at 10% opacity, not a solid border.
- **Internal Padding:** `16px` on all sides via the `--card-spacing` variable, dropping to `12px` at `sm` size.
- **Summary card anatomy:** label and a `36px` circular icon well on one row, tinted by tone at 10% opacity; the figure below at display size, 600 weight, tabular, colored by tone.

### Inputs / Fields
- **Style:** Transparent fill, `1px` hairline border, `lg` radius, `32px` tall, `10px` horizontal padding. Text renders at `1rem` on mobile and `0.875rem` from `md` up, so iOS never zooms on focus.
- **Label:** Always a real `<label>` above the field at body size, `8px` gap.
- **Focus:** Border shifts to the ring color and a `3px` ring at 50% opacity appears — no glow, no color change to the fill.
- **Error:** The field takes the Outcome Red border and a `3px` red ring at 20%; the message renders below the form in Outcome Red at body size with `role="alert"`.
- **Disabled:** 50% opacity, muted fill, pointer events off.

### Select
- Trigger matches the input exactly. The menu is a Paper popover at `lg` radius with the Overlay shadow and hairline ring, animated in over `100ms` with a `95%` zoom and a `2px` slide from the trigger side.

### Dialog
- Centered, `max-w-sm` (24rem) on desktop and full width minus `32px` on mobile, `xl` radius, `16px` padding, `16px` gap between header, form, and footer. Enters with the same `100ms` fade-and-zoom as the select menu. The footer holds Cancel (outline) then the primary submit.

### Table
- Header cells are `40px` tall, Ink, weight 500, left-aligned — except the amount column, which is right-aligned everywhere including the header. Rows are separated by a `1px` hairline rule, drop the rule on the last row, and tint to Quiet Surface at 50% on hover. Cells are `8px` padded and never wrap. Titles are weight 500; dates are Quiet Ink and tabular; amounts are weight 600, tabular, signed, and colored by the money duotone.

### Empty State
- The signature quiet moment: a dashed hairline container at `xl` radius, `24px` horizontal and `64px` vertical padding, centered — a `32px` Quiet Ink icon, a title-size heading, and one line of Quiet Ink copy capped at `24rem`. It states what to do next, never apologizes.

## Do's and Don'ts

### Do:
- **Do** put every amount and date in tabular figures, and right-align amounts in any column.
- **Do** keep money in the duotone: Income Emerald for income, Outcome Red for outcome, Ink for a neutral total.
- **Do** size controls at `32px` with the `4/8/16/24/32/40` spacing ladder — the phone is the design target.
- **Do** separate surfaces with the `1px` foreground/10 ring first, then the Resting shadow.
- **Do** write UI copy in sentence case, and label a busy button with its action in progress ("Saving…").
- **Do** give every icon-only control an `aria-label` and every decorative icon `aria-hidden="true"`.
- **Do** let tabular regions scroll horizontally inside their rounded container.

### Don't:
- **Don't** introduce a second brand accent, gradient, or glow — Vault Green is the only brand color.
- **Don't** use emerald or red for anything that is not money direction.
- **Don't** tint a card background away from the page background to suggest depth.
- **Don't** uppercase or letter-space labels, or add a second typeface.
- **Don't** truncate, abbreviate, or round an amount to make a column fit.
- **Don't** stack a third elevation level, or float anything above a dialog.
- **Don't** reach for navy chrome, enterprise widget density, mascots, confetti, or pastel gamification.
