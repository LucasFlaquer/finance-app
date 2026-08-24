import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useThemeToggle } from "./use-theme-toggle";

const setTheme = vi.fn();
const resolvedTheme = vi.fn(() => "light");

vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: resolvedTheme(), setTheme }),
}));

vi.mock("@/lib/theme/theme-reveal", () => ({
  originFromElement: () => ({ x: 10, y: 20 }),
  startThemeReveal: ({ applyTheme }: { applyTheme: () => void }) => {
    applyTheme();
  },
}));

beforeEach(() => {
  setTheme.mockClear();
  resolvedTheme.mockReturnValue("light");
});

describe("useThemeToggle", () => {
  it("switches to dark when the resolved theme is light", () => {
    const { result } = renderHook(() => useThemeToggle());

    act(() => result.current.toggleTheme(document.createElement("button")));

    expect(setTheme).toHaveBeenCalledWith("dark");
  });

  it("switches to light when the resolved theme is dark", () => {
    resolvedTheme.mockReturnValue("dark");
    const { result } = renderHook(() => useThemeToggle());

    act(() => result.current.toggleTheme(document.createElement("button")));

    expect(setTheme).toHaveBeenCalledWith("light");
  });

  it("reports the dark state from the resolved theme", () => {
    resolvedTheme.mockReturnValue("dark");

    const { result } = renderHook(() => useThemeToggle());

    expect(result.current.isDark).toBe(true);
  });

  it("reports mounted after the first effect so the label can hydrate safely", () => {
    const { result } = renderHook(() => useThemeToggle());

    expect(result.current.isMounted).toBe(true);
  });
});
