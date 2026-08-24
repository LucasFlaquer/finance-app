# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are individuals tracking their own personal money — a real public product, not a single-owner tool. The usage scene is mobile-first: entries happen on a phone, in the moment (after paying, after getting paid), in short bursts. Desktop is a secondary, larger-canvas view of the same data.

Accounts and authentication are not built yet but are planned; every future decision should assume each user sees only their own data.

## Product Purpose

Let a person know where their money stands and why, without spreadsheet work.

Four jobs, in confirmed priority of intent:

1. **Know the current balance fast** — an at-a-glance answer to "where do I stand right now", from income, outcome, and total.
2. **Budget per category** — set limits per category, track spend against them, surface overruns.
3. **See trends over time** — period-over-period comparison of income and spending, spotting patterns.
4. **Accounts and imports** — multiple accounts/wallets and statement import (CSV/OFX) with reconciliation.

Only job 1 exists today. Jobs 2–4 are confirmed product direction, not shipped behavior.

## Positioning

Undecided. The user has not committed to a differentiating mechanism or claim; future work must not invent one.

## Operating Context

- Money is entered by hand, one transaction at a time: title, amount, type (income/outcome), category. The manual entry flow is the critical path and is used far more often than any reading view.
- Transactions are reviewed as a reverse-chronological history plus a summary of income, outcome, and total.
- Categories are a fixed seeded set today: Salary, Investments, Housing, Groceries, Transport, Health, Education, Entertainment, Subscriptions, Other.
- Sessions are short and interruption-prone (phone, standing, one hand).

## Capabilities and Constraints

Built today:

- Create a transaction (title, amount, income/outcome type, category) via a dialog.
- List all transactions, newest first.
- Summary of total income, total outcome, and net balance.
- Category list read from the database.

Durable constraints:

- **Single currency.** No multi-currency amounts, no conversion.
- **Manual entry.** No bank sync. Statement import is a future capability, not a substitute for hand entry.
- **Mobile-first web.** Phone is the real usage scene; the design is responsive up to desktop, not down from it. No native app.
- Amounts are stored as `Decimal(12,2)`; cent precision must never be lost to floating point.
- A transaction always belongs to exactly one category; categories cannot be deleted while transactions reference them.
- Transaction type is a closed set: `INCOME` or `OUTCOME`.

Explicitly undecided: authentication model, multi-account model, budget period semantics (calendar month vs rolling), import formats, whether transactions can be edited or deleted.

## Brand Commitments

None established. There is no confirmed name beyond the working title "finance-app", no logo, no voice guide, and no binding visual references. Future work must not present invented brand assets as existing ones.

## Evidence on Hand

- Seeded demo data only (`prisma/seed-data.ts`): ten categories and a set of sample transactions. This is fixture data, not real user data.
- No testimonials, customers, benchmarks, press, pricing, or usage numbers exist. Do not fabricate any.

## Product Principles

1. **Entry is the product.** The path from "I spent money" to "it is recorded" must stay the shortest, most forgiving flow in the app, on a phone, one-handed.
2. **Answer before detail.** Every screen leads with the number the user came for; breakdowns come after.
3. **Never guess with money.** Amounts, categories, and totals are shown exactly as recorded — no rounding away cents, no inferred categories, no silent defaults that change a figure.
4. **Earn each new capability.** Budgets, trends, and imports layer onto the existing record; none of them may complicate the balance-at-a-glance or the entry flow.
5. **Built for many users, one at a time.** Assume per-user data isolation in every model and view, even before auth ships.
