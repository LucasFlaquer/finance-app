import { describe, expect, it } from "vitest";
import { ALPHABETICAL_CATEGORIES, outcomeTotal } from "./breakdown-fixtures";
import { buildCategoryBreakdown } from "./build-category-breakdown";

function namesFor(totals: ReturnType<typeof outcomeTotal>[]): string[] {
  const { rows } = buildCategoryBreakdown({
    categories: ALPHABETICAL_CATEGORIES,
    totals,
    type: "OUTCOME",
  });
  return rows.map((row) => row.name);
}

describe("buildCategoryBreakdown ordering", () => {
  it("orders non-zero rows by amount descending", () => {
    const totals = [
      outcomeTotal("groceries", 100),
      outcomeTotal("transport", 900),
    ];

    expect(namesFor(totals)).toEqual([
      "Transport",
      "Groceries",
      "Housing",
      "Salary",
    ]);
  });

  it("breaks amount ties by name ascending", () => {
    const totals = [
      outcomeTotal("transport", 500),
      outcomeTotal("groceries", 500),
    ];

    expect(namesFor(totals).slice(0, 2)).toEqual(["Groceries", "Transport"]);
  });

  it("lists zero rows after non-zero rows, alphabetically", () => {
    expect(namesFor([outcomeTotal("transport", 1)])).toEqual([
      "Transport",
      "Groceries",
      "Housing",
      "Salary",
    ]);
  });

  it("treats a category with a zero-cent total as a zero row", () => {
    const totals = [
      outcomeTotal("groceries", 0, 1),
      outcomeTotal("housing", 100),
    ];

    expect(namesFor(totals)).toEqual([
      "Housing",
      "Groceries",
      "Salary",
      "Transport",
    ]);
  });
});
