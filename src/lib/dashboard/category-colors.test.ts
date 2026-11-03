import { describe, expect, it } from "vitest";
import { categoryColor } from "./category-colors";

describe("categoryColor", () => {
  it("maps index 0 to the first chart color", () => {
    expect(categoryColor(0)).toBe("var(--chart-1)");
  });

  it("maps index 9 to the last chart color", () => {
    expect(categoryColor(9)).toBe("var(--chart-10)");
  });

  it("cycles back to the first color at index 10", () => {
    expect(categoryColor(10)).toBe("var(--chart-1)");
  });

  it("keeps cycling past the second lap", () => {
    expect(categoryColor(23)).toBe("var(--chart-4)");
  });

  it("returns the same color for the same index", () => {
    expect(categoryColor(4)).toBe(categoryColor(4));
  });
});
