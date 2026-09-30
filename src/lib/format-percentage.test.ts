import { describe, expect, it } from "vitest";
import { formatPercentage } from "./format-percentage";

describe("formatPercentage", () => {
  it("formats a whole number with one decimal", () => {
    expect(formatPercentage(30)).toBe("30.0%");
  });

  it("formats zero with one decimal", () => {
    expect(formatPercentage(0)).toBe("0.0%");
  });

  it("keeps a single decimal digit", () => {
    expect(formatPercentage(33.3)).toBe("33.3%");
  });

  it("formats one hundred percent", () => {
    expect(formatPercentage(100)).toBe("100.0%");
  });
});
