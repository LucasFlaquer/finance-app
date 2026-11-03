import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  GROCERIES,
  GROCERIES_SLICE_NAME,
  HOUSING,
  HOUSING_SLICE_NAME,
  renderChart,
} from "./category-pie-chart-fixtures";

describe("CategoryPieChart interaction", () => {
  it("shows nothing in the readout before a slice is active", () => {
    renderChart([GROCERIES, HOUSING]);

    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });

  it("shows the slice details in the readout on focus", () => {
    renderChart([GROCERIES, HOUSING]);

    fireEvent.focus(screen.getByRole("img", { name: GROCERIES_SLICE_NAME }));

    expect(screen.getByRole("status")).toHaveTextContent(
      "Groceries: $600.00, 30.0%"
    );
  });

  it("keeps the same slice element while it becomes active so focus is not lost", () => {
    renderChart([GROCERIES, HOUSING]);
    const slice = screen.getByRole("img", { name: GROCERIES_SLICE_NAME });

    fireEvent.focus(slice);

    expect(screen.getByRole("img", { name: GROCERIES_SLICE_NAME })).toBe(slice);
  });

  it("clears the readout on blur", () => {
    renderChart([GROCERIES, HOUSING]);
    fireEvent.focus(screen.getByRole("img", { name: GROCERIES_SLICE_NAME }));

    fireEvent.blur(screen.getByRole("img", { name: GROCERIES_SLICE_NAME }));

    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });

  it("shows the slice details in the readout on hover", () => {
    renderChart([GROCERIES, HOUSING]);

    fireEvent.mouseEnter(screen.getByRole("img", { name: HOUSING_SLICE_NAME }));

    expect(screen.getByRole("status")).toHaveTextContent(
      "Housing: $1,000.00, 50.0%"
    );
  });

  it("clears the readout when the pointer leaves the slice", () => {
    renderChart([GROCERIES, HOUSING]);
    fireEvent.mouseEnter(screen.getByRole("img", { name: HOUSING_SLICE_NAME }));

    fireEvent.mouseLeave(screen.getByRole("img", { name: HOUSING_SLICE_NAME }));

    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });
});
