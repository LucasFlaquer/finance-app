import { describe, expect, it } from "vitest";
import { compareYearMonth, currentYearMonth, monthRange } from "./year-month";

describe("currentYearMonth", () => {
  it("derives the current month in UTC", () => {
    const now = new Date("2026-09-24T12:00:00Z");

    expect(currentYearMonth(now)).toEqual({ month: 9, year: 2026 });
  });

  it("keeps the UTC month for a timestamp at the last UTC millisecond", () => {
    const now = new Date("2026-09-30T23:59:59.999Z");

    expect(currentYearMonth(now)).toEqual({ month: 9, year: 2026 });
  });

  it("moves to the next UTC month at midnight UTC", () => {
    const now = new Date("2026-10-01T00:00:00.000Z");

    expect(currentYearMonth(now)).toEqual({ month: 10, year: 2026 });
  });
});

describe("compareYearMonth", () => {
  it("returns a negative number when the first month is earlier", () => {
    const result = compareYearMonth(
      { month: 12, year: 2025 },
      { month: 1, year: 2026 }
    );

    expect(result).toBeLessThan(0);
  });

  it("returns a positive number when the first month is later", () => {
    const result = compareYearMonth(
      { month: 10, year: 2026 },
      { month: 9, year: 2026 }
    );

    expect(result).toBeGreaterThan(0);
  });

  it("returns zero for equal months", () => {
    const result = compareYearMonth(
      { month: 9, year: 2026 },
      { month: 9, year: 2026 }
    );

    expect(result).toBe(0);
  });
});

describe("monthRange", () => {
  it("builds a UTC half-open range", () => {
    const range = monthRange({ month: 9, year: 2026 });

    expect(range.start.toISOString()).toBe("2026-09-01T00:00:00.000Z");
    expect(range.end.toISOString()).toBe("2026-10-01T00:00:00.000Z");
  });

  it("ends on January 1st for December", () => {
    const range = monthRange({ month: 12, year: 2026 });

    expect(range.end.toISOString()).toBe("2027-01-01T00:00:00.000Z");
  });

  it("covers the 29 days of a leap-year February", () => {
    const { start, end } = monthRange({ month: 2, year: 2028 });
    const days = (end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000);

    expect(days).toBe(29);
  });
});
