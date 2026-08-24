import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { originFromElement, startThemeReveal } from "./theme-reveal";

function stubViewTransition(implementation: unknown) {
  Object.defineProperty(document, "startViewTransition", {
    configurable: true,
    value: implementation,
    writable: true,
  });
}

function mockMatchMedia(prefersReducedMotion: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({ matches: prefersReducedMotion }))
  );
}

beforeEach(() => {
  mockMatchMedia(false);
  document.documentElement.animate = vi.fn();
});

afterEach(() => {
  vi.unstubAllGlobals();
  Reflect.deleteProperty(document, "startViewTransition");
});

describe("originFromElement", () => {
  it("returns the center point of the element", () => {
    const element = document.createElement("button");
    element.getBoundingClientRect = () =>
      ({ height: 20, left: 100, top: 40, width: 40 }) as DOMRect;

    const origin = originFromElement(element);

    expect(origin).toEqual({ x: 120, y: 50 });
  });
});

describe("startThemeReveal", () => {
  it("animates a circular reveal from the origin when view transitions exist", async () => {
    const ready = Promise.resolve();
    stubViewTransition((update: () => void) => {
      update();
      return { ready };
    });
    const applyTheme = vi.fn();

    startThemeReveal({ applyTheme, origin: { x: 0, y: 0 } });
    await ready;

    expect(applyTheme).toHaveBeenCalledTimes(1);
    expect(document.documentElement.animate).toHaveBeenCalledWith(
      expect.objectContaining({
        clipPath: [
          "circle(0px at 0px 0px)",
          expect.stringContaining("circle("),
        ],
      }),
      expect.objectContaining({ pseudoElement: "::view-transition-new(root)" })
    );
  });

  it("applies the theme without animating when view transitions are unsupported", () => {
    const applyTheme = vi.fn();

    startThemeReveal({ applyTheme, origin: { x: 0, y: 0 } });

    expect(applyTheme).toHaveBeenCalledTimes(1);
    expect(document.documentElement.animate).not.toHaveBeenCalled();
  });

  it("applies the theme without animating when reduced motion is preferred", () => {
    mockMatchMedia(true);
    const startViewTransition = vi.fn();
    stubViewTransition(startViewTransition);
    const applyTheme = vi.fn();

    startThemeReveal({ applyTheme, origin: { x: 0, y: 0 } });

    expect(applyTheme).toHaveBeenCalledTimes(1);
    expect(startViewTransition).not.toHaveBeenCalled();
  });
});
