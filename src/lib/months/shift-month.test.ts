import { describe, expect, it } from "vitest";
import { shiftMonth } from "./year-month";

describe("shiftMonth", () => {
  it("shifts back one month inside a year", () => {
    expect(shiftMonth({ month: 9, year: 2026 }, -1)).toEqual({
      month: 8,
      year: 2026,
    });
  });

  it("shifts back across the year boundary", () => {
    expect(shiftMonth({ month: 1, year: 2026 }, -1)).toEqual({
      month: 12,
      year: 2025,
    });
  });

  it("shifts forward across the year boundary", () => {
    expect(shiftMonth({ month: 12, year: 2025 }, 1)).toEqual({
      month: 1,
      year: 2026,
    });
  });

  it("shifts by more than a year", () => {
    expect(shiftMonth({ month: 3, year: 2026 }, -15)).toEqual({
      month: 12,
      year: 2024,
    });
  });

  it("returns the same month for a zero delta", () => {
    expect(shiftMonth({ month: 6, year: 2026 }, 0)).toEqual({
      month: 6,
      year: 2026,
    });
  });
});
