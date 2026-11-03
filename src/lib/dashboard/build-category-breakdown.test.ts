import { describe, expect, it } from "vitest";
import {
  ALPHABETICAL_CATEGORIES,
  HOUSING,
  outcomeTotal,
} from "./breakdown-fixtures";
import { buildCategoryBreakdown } from "./build-category-breakdown";

describe("buildCategoryBreakdown amounts", () => {
  it("computes category amounts and percentages", () => {
    const totals = [
      outcomeTotal("housing", 100_000),
      outcomeTotal("groceries", 60_000),
      outcomeTotal("transport", 40_000),
    ];

    const { rows, total } = buildCategoryBreakdown({
      categories: ALPHABETICAL_CATEGORIES,
      totals,
      type: "OUTCOME",
    });

    expect(total).toBe(2000);
    expect(rows.map((row) => [row.name, row.amount, row.percentage])).toEqual([
      ["Housing", 1000, 50],
      ["Groceries", 600, 30],
      ["Transport", 400, 20],
      ["Salary", 0, 0],
    ]);
  });

  it("counts transactions per category", () => {
    const totals = [
      outcomeTotal("housing", 100_000, 2),
      outcomeTotal("groceries", 500, 3),
    ];

    const { rows } = buildCategoryBreakdown({
      categories: ALPHABETICAL_CATEGORIES,
      totals,
      type: "OUTCOME",
    });

    expect(rows.map((row) => [row.name, row.count])).toEqual([
      ["Housing", 2],
      ["Groceries", 3],
      ["Salary", 0],
      ["Transport", 0],
    ]);
  });

  it("sums several grouped rows of the same category and type", () => {
    const totals = [
      outcomeTotal("housing", 1000, 1),
      outcomeTotal("housing", 250, 2),
    ];

    const { rows } = buildCategoryBreakdown({
      categories: [HOUSING],
      totals,
      type: "OUTCOME",
    });

    expect(rows[0]).toMatchObject({ amount: 12.5, count: 3 });
  });

  it("makes category amounts sum exactly to the type total", () => {
    const totals = [
      outcomeTotal("groceries", 10),
      outcomeTotal("housing", 20),
      outcomeTotal("transport", 145_055),
    ];

    const { rows, total } = buildCategoryBreakdown({
      categories: ALPHABETICAL_CATEGORIES,
      totals,
      type: "OUTCOME",
    });

    const sumInCents = rows.reduce(
      (sum, row) => sum + Math.round(row.amount * 100),
      0
    );
    expect(sumInCents).toBe(145_085);
    expect(total).toBe(1450.85);
  });
});
