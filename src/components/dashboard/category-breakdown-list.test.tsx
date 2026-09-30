import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { CategoryBreakdownRow } from "@/lib/dashboard/dashboard-types";
import { CategoryBreakdownList } from "./category-breakdown-list";

function buildRow(
  overrides: Partial<CategoryBreakdownRow>
): CategoryBreakdownRow {
  return {
    amount: 0,
    categoryId: "id",
    color: "var(--chart-1)",
    count: 0,
    name: "Name",
    percentage: 0,
    ...overrides,
  };
}

const GROCERIES = buildRow({
  amount: 600,
  categoryId: "groceries",
  color: "rgb(1, 2, 3)",
  count: 2,
  name: "Groceries",
  percentage: 30,
});
const UNUSED = buildRow({ categoryId: "unused", name: "Unused" });
const SINGLE = buildRow({ categoryId: "single", count: 1, name: "Single" });

function renderList(rows: CategoryBreakdownRow[]) {
  return render(<CategoryBreakdownList label="Outcome" rows={rows} />);
}

describe("CategoryBreakdownList", () => {
  it("shows the category name", () => {
    renderList([GROCERIES]);

    expect(screen.getByText("Groceries")).toBeInTheDocument();
  });

  it("shows the currency amount", () => {
    renderList([GROCERIES]);

    expect(screen.getByText("$600.00")).toBeInTheDocument();
  });

  it("shows the percentage with one decimal", () => {
    renderList([GROCERIES]);

    expect(screen.getByText("30.0%")).toBeInTheDocument();
  });

  it("shows the plural transaction count", () => {
    renderList([GROCERIES]);

    expect(screen.getByText("2 transactions")).toBeInTheDocument();
  });

  it("shows the singular transaction count for one transaction", () => {
    renderList([SINGLE]);

    expect(screen.getByText("1 transaction")).toBeInTheDocument();
  });

  it("colors the swatch with the row color", () => {
    renderList([GROCERIES]);

    expect(screen.getByTestId("category-swatch")).toHaveStyle({
      backgroundColor: "rgb(1, 2, 3)",
    });
  });

  it("hides the swatch from assistive technologies", () => {
    renderList([GROCERIES]);

    expect(screen.getByTestId("category-swatch")).toHaveAttribute(
      "aria-hidden",
      "true"
    );
  });

  it("lists every category including zero ones in the given order", () => {
    renderList([GROCERIES, UNUSED]);

    const items = within(screen.getByRole("list")).getAllByRole("listitem");

    expect(items.map((item) => item.textContent)).toEqual([
      "Groceries2 transactions$600.0030.0%",
      "Unused0 transactions$0.000.0%",
    ]);
  });
});
