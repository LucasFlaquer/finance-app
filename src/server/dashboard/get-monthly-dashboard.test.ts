import { beforeEach, describe, expect, it, vi } from "vitest";

const getMonthlyCategoryTotals = vi.fn();
const listCategories = vi.fn();

vi.mock("./get-monthly-category-totals", () => ({
  getMonthlyCategoryTotals: (...args: unknown[]) =>
    getMonthlyCategoryTotals(...args),
}));
vi.mock("../categories/list-categories", () => ({
  listCategories: () => listCategories(),
}));

const { getMonthlyDashboard } = await import("./get-monthly-dashboard");

const AUGUST = { month: 8, year: 2026 };

describe("getMonthlyDashboard", () => {
  beforeEach(() => {
    getMonthlyCategoryTotals.mockReset();
    listCategories.mockReset();
    listCategories.mockResolvedValue([
      { id: "food", name: "Food" },
      { id: "salary", name: "Salary" },
    ]);
    getMonthlyCategoryTotals.mockResolvedValue([
      { amountCents: 25_000, categoryId: "food", count: 2, type: "OUTCOME" },
      { amountCents: 100_000, categoryId: "salary", count: 1, type: "INCOME" },
    ]);
  });

  it("composes the summary and breakdowns for the month", async () => {
    const dashboard = await getMonthlyDashboard(AUGUST);

    expect(dashboard.month).toEqual(AUGUST);
    expect(dashboard.summary).toEqual({
      income: 1000,
      outcome: 250,
      total: 750,
    });
    expect(dashboard.breakdowns.OUTCOME.rows[0]).toMatchObject({
      amount: 250,
      categoryId: "food",
      count: 2,
      name: "Food",
    });
    expect(dashboard.breakdowns.INCOME.rows[0]).toMatchObject({
      amount: 1000,
      categoryId: "salary",
      count: 1,
      name: "Salary",
    });
  });

  it("queries totals with the UTC range of the selected month", async () => {
    await getMonthlyDashboard(AUGUST);

    expect(getMonthlyCategoryTotals).toHaveBeenCalledWith({
      end: new Date("2026-09-01T00:00:00.000Z"),
      start: new Date("2026-08-01T00:00:00.000Z"),
    });
  });

  it("returns zeroed summary for a month without transactions", async () => {
    getMonthlyCategoryTotals.mockResolvedValue([]);

    const dashboard = await getMonthlyDashboard(AUGUST);

    expect(dashboard.summary).toEqual({ income: 0, outcome: 0, total: 0 });
  });
});
