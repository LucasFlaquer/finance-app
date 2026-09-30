import { describe, expect, it } from "vitest";
import { buildMonthlyDashboard } from "./build-monthly-dashboard";
import type { CategoryTypeTotal } from "./dashboard-types";

const CATEGORIES = [
  { id: "groceries", name: "Groceries" },
  { id: "salary", name: "Salary" },
];

const TOTALS: CategoryTypeTotal[] = [
  { amountCents: 851_010, categoryId: "salary", count: 2, type: "INCOME" },
  { amountCents: 87_565, categoryId: "groceries", count: 3, type: "OUTCOME" },
  { amountCents: 10, categoryId: "salary", count: 1, type: "OUTCOME" },
];

describe("buildMonthlyDashboard", () => {
  it("makes the summary income equal the income breakdown total", () => {
    const { summary, breakdowns } = buildMonthlyDashboard({
      categories: CATEGORIES,
      totals: TOTALS,
    });

    expect(summary.income).toBe(8510.1);
    expect(summary.income).toBe(breakdowns.INCOME.total);
  });

  it("makes the summary outcome equal the outcome breakdown total", () => {
    const { summary, breakdowns } = buildMonthlyDashboard({
      categories: CATEGORIES,
      totals: TOTALS,
    });

    expect(summary.outcome).toBe(875.75);
    expect(summary.outcome).toBe(breakdowns.OUTCOME.total);
  });

  it("computes the balance as income minus outcome without float drift", () => {
    const { summary } = buildMonthlyDashboard({
      categories: CATEGORIES,
      totals: TOTALS,
    });

    expect(summary.total).toBe(7634.35);
  });

  it("builds both breakdowns from the same grouped rows", () => {
    const { breakdowns } = buildMonthlyDashboard({
      categories: CATEGORIES,
      totals: TOTALS,
    });

    expect(breakdowns.INCOME.type).toBe("INCOME");
    expect(breakdowns.OUTCOME.type).toBe("OUTCOME");
    expect(breakdowns.OUTCOME.rows[0].name).toBe("Groceries");
  });

  it("returns a zeroed summary for an empty month", () => {
    const { summary, breakdowns } = buildMonthlyDashboard({
      categories: CATEGORIES,
      totals: [],
    });

    expect(summary).toEqual({ income: 0, outcome: 0, total: 0 });
    expect(breakdowns.INCOME.rows).toHaveLength(CATEGORIES.length);
  });

  it("reports a negative balance when outcome exceeds income", () => {
    const { summary } = buildMonthlyDashboard({
      categories: CATEGORIES,
      totals: [
        { amountCents: 1000, categoryId: "salary", count: 1, type: "INCOME" },
        {
          amountCents: 2550,
          categoryId: "groceries",
          count: 1,
          type: "OUTCOME",
        },
      ],
    });

    expect(summary.total).toBe(-15.5);
  });
});
