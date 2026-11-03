import { describe, expect, it } from "vitest";
import { formatMonthLabel } from "./format-month";

describe("formatMonthLabel", () => {
  it("formats the month name and year", () => {
    expect(formatMonthLabel({ month: 9, year: 2026 })).toBe("September 2026");
  });

  it("formats January", () => {
    expect(formatMonthLabel({ month: 1, year: 2026 })).toBe("January 2026");
  });

  it("formats December", () => {
    expect(formatMonthLabel({ month: 12, year: 2025 })).toBe("December 2025");
  });
});
