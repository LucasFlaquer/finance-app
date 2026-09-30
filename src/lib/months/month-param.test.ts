import { describe, expect, it } from "vitest";
import { formatMonthParam, parseMonthParam } from "./month-param";

describe("parseMonthParam", () => {
  it("parses a valid month param", () => {
    expect(parseMonthParam("2026-09")).toEqual({ month: 9, year: 2026 });
  });

  it("accepts the boundary months 01 and 12", () => {
    expect(parseMonthParam("2026-01")).toEqual({ month: 1, year: 2026 });
    expect(parseMonthParam("2026-12")).toEqual({ month: 12, year: 2026 });
  });

  it("accepts the minimum year 1000", () => {
    expect(parseMonthParam("1000-01")).toEqual({ month: 1, year: 1000 });
  });

  it.each([
    ["undefined", undefined],
    ["an empty string", ""],
    ["free text", "abc"],
    ["month 13", "2026-13"],
    ["month 00", "2026-00"],
    ["a single-digit month", "2026-9"],
    ["a slash separator", "2026/09"],
    ["a two-digit year", "26-09"],
    ["a year below 1000", "0999-01"],
    ["a five-digit year", "12026-09"],
    ["surrounding whitespace", " 2026-09"],
    ["a trailing suffix", "2026-09-01"],
    ["an array", ["2026-09", "2026-08"]],
    ["a single-item array", ["2026-09"]],
  ])("rejects %s", (_label, raw) => {
    expect(parseMonthParam(raw)).toBeNull();
  });
});

describe("formatMonthParam", () => {
  it("pads a single-digit month", () => {
    expect(formatMonthParam({ month: 9, year: 2026 })).toBe("2026-09");
  });

  it("keeps a two-digit month", () => {
    expect(formatMonthParam({ month: 12, year: 2026 })).toBe("2026-12");
  });

  it("round-trips through parseMonthParam", () => {
    const value = { month: 3, year: 2025 };

    expect(parseMonthParam(formatMonthParam(value))).toEqual(value);
  });
});
