import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  buildBreakdowns,
  EMPTY_GROCERIES,
  EMPTY_SALARY,
  renderSection,
} from "./category-breakdown-section-fixtures";

describe("CategoryBreakdownSection empty and chart states", () => {
  it("renders the pie chart when the type has a total", () => {
    renderSection();

    expect(screen.getByRole("figure")).toBeInTheDocument();
  });

  it("shows the empty state instead of the pie when the total is zero", () => {
    renderSection(
      buildBreakdowns({
        OUTCOME: { rows: [EMPTY_GROCERIES], total: 0, type: "OUTCOME" },
      })
    );

    expect(
      screen.getByText("No outcome recorded in September 2026")
    ).toBeInTheDocument();
    expect(screen.queryByRole("figure")).not.toBeInTheDocument();
  });

  it("still lists every category at 0.0% when the total is zero", () => {
    renderSection(
      buildBreakdowns({
        INCOME: { rows: [EMPTY_SALARY], total: 0, type: "INCOME" },
      })
    );

    fireEvent.click(screen.getByRole("button", { name: "Income" }));

    expect(screen.getByText("Salary")).toBeInTheDocument();
    expect(screen.getByText("0.0%")).toBeInTheDocument();
  });
});
