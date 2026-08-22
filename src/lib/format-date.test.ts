import { describe, expect, it } from "vitest";
import { formatTransactionDate } from "./format-date";

describe("formatTransactionDate", () => {
  it("formats a date as day, short month and year in UTC", () => {
    expect(formatTransactionDate(new Date("2026-08-03T08:15:00Z"))).toBe(
      "Aug 03, 2026"
    );
  });

  it("keeps the UTC day for a late-evening timestamp", () => {
    expect(formatTransactionDate(new Date("2026-12-31T23:30:00Z"))).toBe(
      "Dec 31, 2026"
    );
  });
});
