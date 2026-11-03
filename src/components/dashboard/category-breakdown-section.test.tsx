import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderSection } from "./category-breakdown-section-fixtures";

describe("CategoryBreakdownSection", () => {
  it("defaults to Outcome pressed", () => {
    renderSection();

    expect(screen.getByRole("button", { name: "Outcome" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("names the type and month in the heading", () => {
    renderSection();

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Outcome by category — September 2026",
      })
    ).toBeInTheDocument();
  });

  it("switches to the income breakdown on toggle", () => {
    renderSection();

    fireEvent.click(screen.getByRole("button", { name: "Income" }));

    expect(screen.getByRole("button", { name: "Income" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByText("$3,000.00")).toBeInTheDocument();
    expect(screen.queryByText("Groceries")).not.toBeInTheDocument();
  });

  it("updates the heading when switching to income", () => {
    renderSection();

    fireEvent.click(screen.getByRole("button", { name: "Income" }));

    expect(
      screen.getByRole("heading", {
        name: "Income by category — September 2026",
      })
    ).toBeInTheDocument();
  });

  it("wraps the breakdown list in a polite live region", () => {
    renderSection();

    const region = screen.getByRole("list").closest("[aria-live]");

    expect(region).toHaveAttribute("aria-live", "polite");
  });
});
