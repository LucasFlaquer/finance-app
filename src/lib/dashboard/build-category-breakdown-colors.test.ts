import { describe, expect, it } from "vitest";
import { ALPHABETICAL_CATEGORIES, outcomeTotal } from "./breakdown-fixtures";
import { buildCategoryBreakdown } from "./build-category-breakdown";
import type { CategoryBreakdownRow } from "./dashboard-types";

function colorOf(rows: CategoryBreakdownRow[], categoryId: string) {
  return rows.find((row) => row.categoryId === categoryId)?.color;
}

describe("buildCategoryBreakdown colors", () => {
  it("assigns colors by alphabetical index regardless of ordering", () => {
    const { rows } = buildCategoryBreakdown({
      categories: ALPHABETICAL_CATEGORIES,
      totals: [outcomeTotal("transport", 900)],
      type: "OUTCOME",
    });

    expect(colorOf(rows, "transport")).toBe("var(--chart-4)");
    expect(colorOf(rows, "groceries")).toBe("var(--chart-1)");
  });

  it("keeps a category color stable across types", () => {
    const outcome = buildCategoryBreakdown({
      categories: ALPHABETICAL_CATEGORIES,
      totals: [outcomeTotal("housing", 100)],
      type: "OUTCOME",
    });
    const income = buildCategoryBreakdown({
      categories: ALPHABETICAL_CATEGORIES,
      totals: [],
      type: "INCOME",
    });

    expect(colorOf(income.rows, "housing")).toBe(
      colorOf(outcome.rows, "housing")
    );
  });

  it("cycles colors after the palette size", () => {
    const categories = Array.from({ length: 11 }, (_, index) => ({
      id: `c${index}`,
      name: `Category ${String(index).padStart(2, "0")}`,
    }));

    const { rows } = buildCategoryBreakdown({
      categories,
      totals: [],
      type: "OUTCOME",
    });

    expect(colorOf(rows, "c10")).toBe("var(--chart-1)");
  });
});
