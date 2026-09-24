# Product Requirements Document (PRD)

## Overview

Today the finance app has a single page (`/`) that mixes the income/outcome/total balance cards with the full transaction history. Users can see how much money came in and went out, but not **where** it went or came from. There is no way to answer "which category consumes most of my money this month?" without mentally summing rows in the table.

This feature turns the home page into a **dashboard** focused on a per-category breakdown for a selected month — a pie chart plus a list with each category's amount, percentage, and transaction count, switchable between outcome (spending) and income — while the transaction history moves to a dedicated **Transactions** page that keeps the all-time balance cards. A shared header present on every page provides navigation between the two pages, the theme toggle, and the "New transaction" action. The target user is the individual tracking personal finances; the value is fast insight into spending and earning distribution without manual calculation.

## Goals

- **G1 — Category insight:** a user can identify the category with the highest outcome for the current month within 5 seconds of opening the dashboard, without scrolling on a 1280×800 viewport.
- **G2 — Data accuracy:** for any selected month and type, the sum of all category amounts shown equals the corresponding balance card total (income or outcome) for that month, to the cent — 100% of the time.
- **G3 — Percentage consistency:** displayed category percentages for a given month/type sum to 100% (±0.1 percentage point tolerance for rounding) whenever the type total is greater than zero.
- **G4 — Clear separation of concerns:** 100% of transaction history rendering lives on the Transactions page; the dashboard contains no transaction table.
- **G5 — Accessibility:** both pages meet WCAG 2.1 AA; the category breakdown is fully understandable without seeing the chart (screen reader and color-blind users).
- **G6 — Quality:** new and changed code reaches at least 80% automated test coverage, with category aggregation and percentage calculation covered exhaustively as critical business logic.

## User stories

- **US1:** As a user, I want to see how my spending is distributed across categories for the current month so that I know where my money is going.
- **US2:** As a user, I want to switch the category breakdown between outcome and income so that I can also understand where my money comes from.
- **US3:** As a user, I want to select a different month on the dashboard so that I can review past months and compare my behavior over time.
- **US4:** As a user, I want each category to show its amount, percentage of the total, and number of transactions so that I can judge both the size and the frequency of my spending.
- **US5:** As a user, I want to see income, outcome, and balance totals for the selected month on the dashboard so that the category breakdown has context.
- **US6:** As a user, I want a dedicated Transactions page with the full history and my all-time balance so that I can audit individual entries.
- **US7:** As a user, I want a header on every page with navigation, the theme toggle, and a "New transaction" button so that I can move between pages and record a transaction from anywhere.
- **US8:** As a user, after creating a transaction, I want the page I'm on to reflect it immediately so that I trust the numbers I see.
- **US9 (edge case):** As a user with no transactions of the selected type in the selected month, I want a clear empty state instead of a broken or blank chart.
- **US10 (accessibility):** As a screen reader or keyboard user, I want to access the category breakdown and navigation without relying on the chart's colors or a mouse.

## Key features

### F1 — Shared app header

Present on every page. Gives consistent navigation and access to global actions; on the dashboard it also hosts the month navigation (see F2).

- **FR1:** The header is displayed on every page of the app (Dashboard and Transactions).
- **FR2:** The header contains navigation links to "Dashboard" (`/`) and "Transactions" (`/transactions`).
- **FR3:** The link for the current page is visually highlighted and announced as the current page to assistive technologies.
- **FR4:** The header contains the theme toggle (existing behavior preserved).
- **FR5:** The header contains the "New transaction" button, which opens the existing create-transaction dialog with the existing form and validation.
- **FR6:** After a transaction is created successfully, the currently displayed page reflects the new data (balances, category breakdown, and/or history) without a manual reload.

### F2 — Dashboard (home page `/`)

The overview of a selected month.

- **FR7:** The default selected month is the calendar month of the current date at the moment the page is requested.
- **FR8:** On the dashboard, the shared header shows the selected month's name and year between a "previous month" button and a "next month" button.
- **FR9:** The "previous month" button moves the selection back one month; the "next month" button moves it forward one month.
- **FR10:** When the selected month is the current month, the "next month" button is disabled; moving forward to a future month is never possible.
- **FR11:** The selected month is reflected in the page URL as a query parameter, so it survives reloads and can be bookmarked or shared.
- **FR12:** When the month query parameter is invalid (malformed, non-existent month such as month 13, or otherwise unparseable) or refers to a future month, the user is redirected to the dashboard for the current month, and the URL reflects the current month.
- **FR13:** The dashboard shows the three balance cards (total income, total outcome, total balance) calculated only from transactions created within the selected month.
- **FR14:** The dashboard does not show the transaction history table.

### F3 — Category breakdown section (dashboard)

Visualizes how the selected type's total is distributed across categories.

- **FR15:** The section has an income/outcome toggle; the default is **Outcome**.
- **FR16:** For the selected month and type, each category's amount is the sum of its transactions of that type in that month.
- **FR17:** Each category's percentage is its amount divided by the total of the selected type for the month, displayed with one decimal place.
- **FR18:** A pie chart displays one slice per category with amount greater than zero, sized proportionally to its percentage, each with a distinct color.
- **FR19:** A list displays **every** category, each row showing: a color swatch matching its pie slice, category name, amount (formatted as currency), percentage, and number of transactions.
- **FR20:** List rows are ordered by amount descending; categories with zero amount appear at the bottom at 0%, ordered alphabetically.
- **FR21:** Hovering or focusing a pie slice reveals the category name, amount, and percentage.
- **FR22:** When the selected type total for the month is zero, the pie chart is replaced by an empty-state message (e.g., "No outcome recorded in September 2026"); the list still shows all categories at 0%.
- **FR23:** The section title/labels make the selected month and type explicit (e.g., "Outcome by category — September 2026").

### F4 — Transactions page (`/transactions`)

The audit view with full history.

- **FR24:** A new page at `/transactions` displays the transaction history table currently shown on the home page, with the same columns, ordering (newest first), and limits as today.
- **FR25:** The Transactions page displays the three balance cards (total income, total outcome, total balance) calculated from **all** transactions (all-time), matching today's behavior.
- **FR26:** The existing empty state for "no transactions" is preserved on the Transactions page.

## Acceptance criteria

- **AC-01 (US7, FR1–FR2):** Given the user is on any page, when the page loads, then a header with "Dashboard" and "Transactions" links, the theme toggle, and a "New transaction" button is visible.
- **AC-02 (US7, FR3):** Given the user is on `/transactions`, when the header renders, then the "Transactions" link is visually highlighted and exposed as the current page (e.g., announced as "current page" by a screen reader).
- **AC-03 (US7, FR5):** Given the user is on the dashboard, when they click "New transaction", then the create-transaction dialog opens with the same fields and validation as today.
- **AC-04 (US8, FR6):** Given the user is on the dashboard viewing the current month's outcome, when they create an outcome of $50 in "Groceries", then the Groceries amount increases by $50, its transaction count increases by 1, percentages recalculate, and the outcome/balance cards update — without a manual reload.
- **AC-05 (US8, FR6):** Given the user is on `/transactions`, when they create a transaction, then it appears at the top of the history table and the all-time balance cards update without a manual reload.
- **AC-06 (US1, FR7, FR15):** Given the user opens `/` with no month in the URL, when the page loads, then the current calendar month is selected and the breakdown shows **Outcome** by default.
- **AC-07 (US1, FR7):** Given the current date is 24 September 2026, when the user opens `/` with no month in the URL, then September 2026 is the selected month.
- **AC-08 (US3, FR8, FR10):** Given the user is on the dashboard with the current month selected, when the header renders, then it shows the month name and year between "previous month" and "next month" buttons, and the "next month" button is disabled.
- **AC-09 (US3, FR9, FR11):** Given September 2026 is selected, when the user clicks "previous month", then August 2026 becomes selected, the URL reflects August 2026, and the balance cards and category breakdown show August's data; when they then click "next month", September 2026 is selected again.
- **AC-10 (US3, FR11):** Given the user selected August 2026, when they reload the page, then August 2026 remains selected.
- **AC-11 (US3, FR12):** Given the current date is 24 September 2026, when the user opens the dashboard with a month query parameter that is malformed (e.g., "abc"), non-existent (e.g., month 13 or 00), or in the future (e.g., October 2026), then they are redirected to the dashboard for September 2026 and the URL reflects September 2026.
- **AC-12 (US5, FR13):** Given transactions exist in both August and September 2026, when the user selects September 2026, then the dashboard balance cards only include September's transactions.
- **AC-13 (US6, FR25):** Given transactions exist across several months, when the user opens `/transactions`, then the balance cards show all-time totals.
- **AC-14 (G4, FR14, FR24):** Given the user opens `/`, when the page renders, then no transaction history table is present; and given they open `/transactions`, then the history table is present.
- **AC-15 (US2, FR15–FR16):** Given September 2026 has $3,000 Salary income and $800 Groceries outcome, when the user switches the toggle to **Income**, then Salary shows $3,000 at 100.0% and Groceries shows $0 at 0.0%.
- **AC-16 (US4, FR17, FR19, G3):** Given outcome for the month is Housing $1,000, Groceries $600, Transport $400, when the breakdown renders, then the list shows Housing $1,000 / 50.0% / its count, Groceries $600 / 30.0%, Transport $400 / 20.0%, and all other categories at $0 / 0.0% / 0.
- **AC-17 (G2, FR16):** Given any selected month and type, when the breakdown renders, then the sum of category amounts equals the corresponding balance card value (income or outcome) to the cent.
- **AC-18 (FR18):** Given three categories have outcome > 0, when the pie chart renders, then it has exactly three slices, each proportional to its percentage, and each slice color matches the swatch of its list row.
- **AC-19 (FR20):** Given categories with differing amounts and some at zero, when the list renders, then non-zero categories appear first ordered by amount descending, followed by zero-amount categories in alphabetical order.
- **AC-20 (US9, FR22):** Given no outcome exists in the selected month, when the Outcome breakdown renders, then an empty-state message naming the month and type is shown instead of the pie, and the list shows every category at 0.0%.
- **AC-21 (FR21, US10):** Given a keyboard user tabs into the pie chart, when a slice receives focus, then its category name, amount, and percentage are shown and announced.
- **AC-22 (US10, G5):** Given a screen reader user, when they reach the category breakdown, then the chart exposes a text alternative and all data (name, amount, percentage, count) is available through the list without relying on color.
- **AC-23 (G5):** Given either page in light and dark themes, when audited, then text and meaningful graphical elements (slices, swatches, active nav link) meet WCAG 2.1 AA contrast requirements.
- **AC-24 (G1):** Given a 1280×800 viewport, when the dashboard loads, then the month navigation, type toggle, pie chart, and top of the category list are visible without scrolling.
- **AC-25 (FR26):** Given there are no transactions at all, when the user opens `/transactions`, then the existing empty state is shown.

## User experience

**User profile:** an individual managing personal finances, recording income and outcome manually, checking the app a few times per week to understand monthly spending. Uses both desktop and mobile, in light or dark theme.

**Main flows:**

1. **Monthly check-in:** user opens the app, lands on the dashboard for the month of the current date, sees totals in the cards and the outcome breakdown; identifies the top category from the list or the largest slice.
2. **Income view:** user flips the toggle to Income to see which sources contributed to earnings.
3. **Past month review:** user steps back and forward through months with the previous/next buttons in the header (never past the current month); the cards and breakdown update together; the URL reflects the month.
4. **Invalid link:** user opens a bookmarked or hand-edited URL with an invalid or future month; they land on the current month instead of an error.
5. **Audit:** user clicks "Transactions" in the header, scans the full history and all-time balance.
6. **Record from anywhere:** user clicks "New transaction" in the header on either page, submits the form, and sees the current page update.

**Layout guidelines:**

- Header on top of every page: app navigation on one side; theme toggle and "New transaction" on the other. On the dashboard, the header also shows the month navigation: "previous month" button, selected month name and year, "next month" button.
- Dashboard: balance cards → category section (pie chart and list side by side on wide screens; stacked, chart first, on narrow screens).
- Transactions page: page title → all-time balance cards → history table.
- Reuse the existing visual language (cards, typography, tokens, currency and date formatting). Chart colors must work in both light and dark themes.
- Fully responsive down to 360px width with no horizontal page scroll.

**Accessibility requirements:**

- Navigation uses semantic `nav` landmark; current link is marked as current page.
- Previous/next month buttons are keyboard operable and have accessible names that include the target month (e.g., "Go to August 2026"); the disabled "next month" button is exposed as disabled.
- The type toggle is keyboard operable, labelled, and exposes its selected state.
- Pie chart has an accessible name and text alternative summarizing the breakdown; slices are focusable with visible focus indication.
- Color is never the only carrier of information: every slice's data is available as text in the list.
- Updates after creating a transaction or changing month/type are announced politely to assistive technologies.
- Heading hierarchy descends without skipping levels on both pages.

## High-level technical constraints

- Must integrate with the existing data model (categories and transactions with type INCOME/OUTCOME, decimal amounts, creation timestamp) and the existing create-transaction flow; no change to how transactions are recorded.
- Must stay within the current stack: Next.js App Router, React, Tailwind CSS with the existing design tokens and shadcn/ui components, PostgreSQL via Prisma.
- Monetary aggregation must be exact to the cent; no floating-point drift in displayed totals or amount sums.
- The current date, the default month, the future-month check, and month boundaries are all evaluated in a single, consistent timezone for balance cards, category breakdown, and month navigation (to be defined in the TechSpec).
- The month query parameter is untrusted user input and must be validated on the server before any data is queried.
- Aggregations must be computed server-side; the dashboard must render in under 1 second (server response) with up to 10,000 transactions and 50 categories on a local development database.
- Data is personal financial information; no data is sent to third-party services (charting must render locally, no external analytics or chart APIs).
- Must comply with the project's code, React, and testing rules, including ≥80% coverage, with aggregation/percentage logic covered by unit tests.

## Out of scope

- Budgets, spending limits, goals, or alerts per category.
- Creating, editing, renaming, deleting, or recoloring categories (category list remains as seeded).
- Custom date ranges, week/year views, or comparison between months (e.g., month-over-month deltas).
- Drill-down from a pie slice or list row into filtered transactions.
- Filtering, searching, sorting, pagination, editing, or deleting on the Transactions page (history keeps today's behavior and limit).
- Month filtering on the Transactions page (it stays all-time; month navigation is not shown there).
- Error pages or messages for invalid month URLs (a silent redirect to the current month is the only handling).
- Other chart types (bar, line, trends over time).
- Exporting data (CSV/PDF) and multi-currency support.
- Multi-user accounts, authentication, and per-user data separation.
