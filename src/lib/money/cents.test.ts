import { describe, expect, it } from "vitest";
import { fromCents, toCents } from "./cents";

describe("toCents", () => {
  it("converts a decimal string to integer cents", () => {
    expect(toCents("1450.50")).toBe(145_050);
  });

  it("converts a number to integer cents", () => {
    expect(toCents(87.65)).toBe(8765);
  });

  it("converts a decimal-like object to integer cents", () => {
    expect(toCents({ toString: () => "12.34" })).toBe(1234);
  });

  it("converts null to zero", () => {
    expect(toCents(null)).toBe(0);
  });

  it("converts a single fractional digit to cents", () => {
    expect(toCents("0.1")).toBe(10);
  });

  it("avoids float drift on values like 0.29", () => {
    expect(toCents("0.29")).toBe(29);
  });

  it("rounds sub-cent decimals to the nearest cent", () => {
    expect(toCents("0.006")).toBe(1);
  });

  it("keeps zero as zero", () => {
    expect(toCents("0")).toBe(0);
  });
});

describe("fromCents", () => {
  it("converts integer cents to dollars", () => {
    expect(fromCents(87_565)).toBe(875.65);
  });

  it("converts zero cents to zero", () => {
    expect(fromCents(0)).toBe(0);
  });
});
