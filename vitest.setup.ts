import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

const STUB_SIZE = { height: 320, width: 320 };

class ResizeObserverStub {
  private readonly callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element) {
    const entry = {
      contentRect: {
        ...STUB_SIZE,
        bottom: STUB_SIZE.height,
        left: 0,
        right: STUB_SIZE.width,
        top: 0,
        x: 0,
        y: 0,
      },
      target,
    } as ResizeObserverEntry;
    this.callback([entry], this as unknown as ResizeObserver);
  }

  unobserve = vi.fn();

  disconnect = vi.fn();
}

globalThis.ResizeObserver = ResizeObserverStub;

afterEach(() => {
  cleanup();
});
