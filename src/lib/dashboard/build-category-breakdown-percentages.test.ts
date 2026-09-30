import { describe, expect, it } from "vitest";
import { ALPHABETICAL_CATEGORIES, outcomeTotal } from "./breakdown-fixtures";
import { buildCategoryBreakdown } from "./build-category-breakdown";

const PERCENTAGE_TOLERANCE = 0.1;
const FLOAT_SLACK = 1e-9;

describe("buildCategoryBreakdown percentages", () => {
  it("keeps percentages within 0.1 of 100 for three equal thirds", () => {
    const totals = [
      outcomeTotal("groceries", 100),
      outcomeTotal("housing", 100),
      outcomeTotal("transport", 100),
    ];

    const { rows } = buildCategoryBreakdown({
      categories: ALPHABETICAL_CATEGORIES,
      totals,
      type: "OUTCOME",
    });

    const sum = rows.reduce((acc, row) => acc + row.percentage, 0);
    expect(rows.slice(0, 3).map((row) => row.percentage)).toEqual([
      33.3, 33.3, 33.3,
    ]);
    expect(Math.abs(sum - 100)).toBeLessThanOrEqual(
      PERCENTAGE_TOLERANCE + FLOAT_SLACK
    );
  });

  it("rounds each percentage to one decimal with standard rounding", () => {
    const totals = [outcomeTotal("groceries", 1), outcomeTotal("housing", 2)];

    const { rows } = buildCategoryBreakdown({
      categories: ALPHABETICAL_CATEGORIES,
      totals,
      type: "OUTCOME",
    });

    expect(rows.slice(0, 2).map((row) => row.percentage)).toEqual([66.7, 33.3]);
  });

  it("rounds a half tenth up", () => {
    const totals = [
      outcomeTotal("groceries", 1),
      outcomeTotal("housing", 1999),
    ];

    const { rows } = buildCategoryBreakdown({
      categories: ALPHABETICAL_CATEGORIES,
      totals,
      type: "OUTCOME",
    });

    expect(rows.find((row) => row.categoryId === "groceries")?.percentage).toBe(
      0.1
    );
  });
});
