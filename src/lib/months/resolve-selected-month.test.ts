import { beforeEach, describe, expect, it } from "vitest";
import { resolveSelectedMonth } from "./resolve-selected-month";

const CURRENT_MONTH = { month: 9, year: 2026 };
let now: Date;

beforeEach(() => {
  now = new Date("2026-09-24T12:00:00Z");
});

describe("resolveSelectedMonth", () => {
  it("selects the current month when the param is absent", () => {
    expect(resolveSelectedMonth(undefined, now)).toEqual({
      currentMonth: CURRENT_MONTH,
      kind: "selected",
      month: CURRENT_MONTH,
    });
  });

  it("selects the current month when it is passed explicitly", () => {
    expect(resolveSelectedMonth("2026-09", now)).toEqual({
      currentMonth: CURRENT_MONTH,
      kind: "selected",
      month: CURRENT_MONTH,
    });
  });

  it("selects a valid past month", () => {
    expect(resolveSelectedMonth("2026-08", now)).toEqual({
      currentMonth: CURRENT_MONTH,
      kind: "selected",
      month: { month: 8, year: 2026 },
    });
  });

  it("selects a past month from a previous year", () => {
    expect(resolveSelectedMonth("2024-02", now)).toEqual({
      currentMonth: CURRENT_MONTH,
      kind: "selected",
      month: { month: 2, year: 2024 },
    });
  });

  it("redirects a future month to the current month", () => {
    expect(resolveSelectedMonth("2026-10", now)).toEqual({
      kind: "redirect",
      month: CURRENT_MONTH,
    });
  });

  it("redirects a future year to the current month", () => {
    expect(resolveSelectedMonth("2027-01", now)).toEqual({
      kind: "redirect",
      month: CURRENT_MONTH,
    });
  });

  it.each([
    ["free text", "abc"],
    ["month 13", "2026-13"],
    ["month 00", "2026-00"],
    ["an empty string", ""],
    ["a year below 1000", "0999-01"],
    ["an array", ["2026-08", "2026-07"]],
  ])("redirects %s to the current month", (_label, raw) => {
    expect(resolveSelectedMonth(raw, now)).toEqual({
      kind: "redirect",
      month: CURRENT_MONTH,
    });
  });

  it("evaluates the current month in UTC at a month boundary", () => {
    const boundary = new Date("2026-09-30T23:59:59.999Z");

    expect(resolveSelectedMonth("2026-10", boundary)).toEqual({
      kind: "redirect",
      month: CURRENT_MONTH,
    });
  });

  it("accepts the new month once UTC midnight passes", () => {
    const boundary = new Date("2026-10-01T00:00:00.000Z");
    const result = resolveSelectedMonth("2026-10", boundary);

    expect(result.kind).toBe("selected");
  });
});
