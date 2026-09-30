import { describe, expect, it } from "vitest";
import {
  ALPHABETICAL_CATEGORIES,
  outcomeTotal,
  SALARY,
} from "./breakdown-fixtures";
import { buildCategoryBreakdown } from "./build-category-breakdown";
import type { CategoryTypeTotal } from "./dashboard-types";

describe("buildCategoryBreakdown edge cases", () => {
  it("only aggregates the requested type", () => {
    const totals: CategoryTypeTotal[] = [
      { amountCents: 300_000, categoryId: "salary", count: 1, type: "INCOME" },
      outcomeTotal("groceries", 50_000),
    ];

    const { rows, total, type } = buildCategoryBreakdown({
      categories: ALPHABETICAL_CATEGORIES,
      totals,
      type: "INCOME",
    });

    expect(type).toBe("INCOME");
    expect(total).toBe(3000);
    expect(rows.map((row) => [row.name, row.amount, row.percentage])).toEqual([
      ["Salary", 3000, 100],
      ["Groceries", 0, 0],
      ["Housing", 0, 0],
      ["Transport", 0, 0],
    ]);
  });

  it("returns every category at zero when the total is zero", () => {
    const { rows, total } = buildCategoryBreakdown({
      categories: ALPHABETICAL_CATEGORIES,
      totals: [],
      type: "OUTCOME",
    });

    expect(total).toBe(0);
    expect(rows.map((row) => [row.amount, row.percentage, row.count])).toEqual(
      ALPHABETICAL_CATEGORIES.map(() => [0, 0, 0])
    );
  });

  it("returns no rows when there are no categories", () => {
    const { rows, total } = buildCategoryBreakdown({
      categories: [],
      totals: [],
      type: "OUTCOME",
    });

    expect(rows).toEqual([]);
    expect(total).toBe(0);
  });

  it("returns only plain numbers and strings", () => {
    const { rows } = buildCategoryBreakdown({
      categories: [SALARY],
      totals: [outcomeTotal("salary", 100)],
      type: "OUTCOME",
    });

    expect(Object.keys(rows[0]).sort()).toEqual([
      "amount",
      "categoryId",
      "color",
      "count",
      "name",
      "percentage",
    ]);
  });
});
