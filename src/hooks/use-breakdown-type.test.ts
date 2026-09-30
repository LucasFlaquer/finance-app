import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useBreakdownType } from "./use-breakdown-type";

describe("useBreakdownType", () => {
  it("defaults to OUTCOME", () => {
    const { result } = renderHook(() => useBreakdownType());

    expect(result.current.type).toBe("OUTCOME");
  });

  it("updates to the given type", () => {
    const { result } = renderHook(() => useBreakdownType());

    act(() => result.current.setType("INCOME"));

    expect(result.current.type).toBe("INCOME");
  });

  it("switches back to OUTCOME", () => {
    const { result } = renderHook(() => useBreakdownType());
    act(() => result.current.setType("INCOME"));

    act(() => result.current.setType("OUTCOME"));

    expect(result.current.type).toBe("OUTCOME");
  });
});
