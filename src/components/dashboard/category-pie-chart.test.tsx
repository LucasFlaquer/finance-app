import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  GROCERIES,
  GROCERIES_SLICE_NAME,
  HOUSING,
  renderChart,
  TRANSPORT,
  UNUSED,
} from "./category-pie-chart-fixtures";

describe("CategoryPieChart", () => {
  it("renders one slice per non-zero category filled with its row color", () => {
    renderChart([GROCERIES, HOUSING, UNUSED, TRANSPORT]);

    const slices = screen.getAllByRole("img");

    expect(slices).toHaveLength(3);
    expect(
      slices.map((slice) => slice.querySelector("path")?.getAttribute("fill"))
    ).toEqual(["var(--chart-1)", "var(--chart-2)", "var(--chart-3)"]);
  });

  it("labels each slice with name, amount and percentage", () => {
    renderChart([GROCERIES, HOUSING]);

    expect(
      screen.getByRole("img", { name: GROCERIES_SLICE_NAME })
    ).toBeInTheDocument();
  });

  it("makes every slice focusable", () => {
    renderChart([GROCERIES, HOUSING]);

    for (const slice of screen.getAllByRole("img")) {
      expect(slice).toHaveAttribute("tabindex", "0");
    }
  });

  it("exposes a text alternative summarizing each category and percentage", () => {
    renderChart([GROCERIES, HOUSING, UNUSED]);

    expect(screen.getByRole("figure")).toHaveTextContent(
      "Outcome by category: Groceries 30.0%, Housing 50.0%"
    );
  });

  it("leaves zero categories out of the text alternative", () => {
    renderChart([GROCERIES, UNUSED]);

    expect(screen.getByRole("figure")).not.toHaveTextContent("Unused");
  });
});
