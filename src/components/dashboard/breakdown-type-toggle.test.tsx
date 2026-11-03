import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BreakdownTypeToggle } from "./breakdown-type-toggle";

describe("BreakdownTypeToggle", () => {
  it("exposes a labelled group", () => {
    render(<BreakdownTypeToggle onChange={vi.fn()} type="OUTCOME" />);

    expect(
      screen.getByRole("group", { name: "Breakdown type" })
    ).toBeInTheDocument();
  });

  it("marks the selected type as pressed", () => {
    render(<BreakdownTypeToggle onChange={vi.fn()} type="INCOME" />);

    expect(screen.getByRole("button", { name: "Income" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: "Outcome" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("reports the chosen type", () => {
    const onChange = vi.fn();
    render(<BreakdownTypeToggle onChange={onChange} type="OUTCOME" />);

    fireEvent.click(screen.getByRole("button", { name: "Income" }));

    expect(onChange).toHaveBeenCalledWith("INCOME");
  });
});
