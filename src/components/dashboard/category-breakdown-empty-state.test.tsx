import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CategoryBreakdownEmptyState } from "./category-breakdown-empty-state";

describe("CategoryBreakdownEmptyState", () => {
  it("names the outcome type and month", () => {
    render(
      <CategoryBreakdownEmptyState monthLabel="September 2026" type="OUTCOME" />
    );

    expect(
      screen.getByText("No outcome recorded in September 2026")
    ).toBeInTheDocument();
  });

  it("names the income type and month", () => {
    render(
      <CategoryBreakdownEmptyState monthLabel="August 2026" type="INCOME" />
    );

    expect(
      screen.getByText("No income recorded in August 2026")
    ).toBeInTheDocument();
  });
});
