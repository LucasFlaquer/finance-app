import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useActiveSlice } from "./use-active-slice";

describe("useActiveSlice", () => {
  it("starts with no active slice", () => {
    const { result } = renderHook(() => useActiveSlice());

    expect(result.current.activeId).toBeNull();
  });

  it("activates the given category", () => {
    const { result } = renderHook(() => useActiveSlice());

    act(() => result.current.activate("groceries"));

    expect(result.current.activeId).toBe("groceries");
  });

  it("clears the active slice", () => {
    const { result } = renderHook(() => useActiveSlice());
    act(() => result.current.activate("groceries"));

    act(() => result.current.clear());

    expect(result.current.activeId).toBeNull();
  });

  it("replaces the active slice when another one is activated", () => {
    const { result } = renderHook(() => useActiveSlice());
    act(() => result.current.activate("groceries"));

    act(() => result.current.activate("housing"));

    expect(result.current.activeId).toBe("housing");
  });
});
