import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MonthNavigation } from "./month-navigation";

const SEPTEMBER_2026 = { month: 9, year: 2026 };
const AUGUST_2026 = { month: 8, year: 2026 };
const JANUARY_2026 = { month: 1, year: 2026 };

describe("MonthNavigation", () => {
  it("links to the previous month with an explicit month param", () => {
    render(
      <MonthNavigation currentMonth={SEPTEMBER_2026} month={SEPTEMBER_2026} />
    );

    expect(
      screen.getByRole("link", { name: "Go to August 2026" })
    ).toHaveAttribute("href", "/?month=2026-08");
  });

  it("shows the selected month label", () => {
    render(
      <MonthNavigation currentMonth={SEPTEMBER_2026} month={SEPTEMBER_2026} />
    );

    expect(screen.getByText("September 2026")).toBeInTheDocument();
  });

  it("disables next on the current month", () => {
    render(
      <MonthNavigation currentMonth={SEPTEMBER_2026} month={SEPTEMBER_2026} />
    );

    expect(
      screen.getByRole("button", { name: "Go to October 2026" })
    ).toBeDisabled();
  });

  it("does not render a next link on the current month", () => {
    render(
      <MonthNavigation currentMonth={SEPTEMBER_2026} month={SEPTEMBER_2026} />
    );

    expect(
      screen.queryByRole("link", { name: "Go to October 2026" })
    ).not.toBeInTheDocument();
  });

  it("links to the next month on a past month", () => {
    render(
      <MonthNavigation currentMonth={SEPTEMBER_2026} month={AUGUST_2026} />
    );

    expect(
      screen.getByRole("link", { name: "Go to September 2026" })
    ).toHaveAttribute("href", "/?month=2026-09");
  });

  it("links to the previous year across the January boundary", () => {
    render(
      <MonthNavigation currentMonth={SEPTEMBER_2026} month={JANUARY_2026} />
    );

    expect(
      screen.getByRole("link", { name: "Go to December 2025" })
    ).toHaveAttribute("href", "/?month=2025-12");
  });
});
