import { describe, expect, it } from "vitest";
import { formatCurrency, formatSignedCurrency } from "./format-currency";

describe("formatCurrency", () => {
  it("formats a value as US dollars", () => {
    expect(formatCurrency(1234.5)).toBe("$1,234.50");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("formats a negative balance", () => {
    expect(formatCurrency(-42.75)).toBe("-$42.75");
  });
});

describe("formatSignedCurrency", () => {
  it("prefixes income with a plus sign", () => {
    expect(formatSignedCurrency(200, "INCOME")).toBe("+$200.00");
  });

  it("prefixes outcome with a minus sign", () => {
    expect(formatSignedCurrency(89.9, "OUTCOME")).toBe("-$89.90");
  });
});
