import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NOW } from "./testing/dashboard-page-fixtures";
import {
  REDIRECT_SIGNAL,
  renderHome,
  resetDashboardMocks,
} from "./testing/dashboard-page-helpers";

const transactionGroupBy = vi.fn();
const categoryFindMany = vi.fn();
const redirect = vi.fn();

vi.mock("@/lib/prisma", () => ({
  default: {
    category: { findMany: (...args: unknown[]) => categoryFindMany(...args) },
    transaction: {
      groupBy: (...args: unknown[]) => transactionGroupBy(...args),
    },
  },
}));

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({
  redirect: (...args: unknown[]) => redirect(...args),
}));

describe("Home dashboard page redirects", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    resetDashboardMocks({ categoryFindMany, redirect, transactionGroupBy });
  });

  it("redirects an invalid month param to the current month", async () => {
    await expect(renderHome("abc")).rejects.toThrowError(REDIRECT_SIGNAL);

    expect(redirect).toHaveBeenCalledWith("/?month=2026-09");
  });

  it("redirects a future month param to the current month", async () => {
    await expect(renderHome("2026-10")).rejects.toThrowError(REDIRECT_SIGNAL);

    expect(redirect).toHaveBeenCalledWith("/?month=2026-09");
  });

  it("redirects a repeated month param to the current month", async () => {
    await expect(renderHome(["2026-08", "2026-07"])).rejects.toThrowError(
      REDIRECT_SIGNAL
    );

    expect(redirect).toHaveBeenCalledWith("/?month=2026-09");
  });

  it("does not query totals when redirecting", async () => {
    await expect(renderHome("2026-13")).rejects.toThrowError(REDIRECT_SIGNAL);

    expect(transactionGroupBy).not.toHaveBeenCalled();
  });

  it("does not redirect when the month param is missing", async () => {
    render(await renderHome());

    expect(redirect).not.toHaveBeenCalled();
    expect(screen.getByText("September 2026")).toBeInTheDocument();
  });
});
