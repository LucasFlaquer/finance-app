import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NOW } from "./testing/dashboard-page-fixtures";
import {
  getSummaryCard,
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

const { metadata } = await import("./page");
const OUTCOME_HEADING = "Outcome by category — September 2026";

describe("Home dashboard page", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    resetDashboardMocks({ categoryFindMany, redirect, transactionGroupBy });
  });

  it("renders only the selected month in the balance cards", async () => {
    render(await renderHome("2026-09"));

    expect(getSummaryCard("Total income").getByText("$5,000.00")).toBeVisible();
    expect(getSummaryCard("Total outcome").getByText("$200.00")).toBeVisible();
    expect(
      getSummaryCard("Total balance").getByText("$4,800.00")
    ).toBeVisible();
  });

  it("renders the previous month data when selected", async () => {
    render(await renderHome("2026-08"));

    expect(getSummaryCard("Total income").getByText("$3,000.00")).toBeVisible();
    expect(
      getSummaryCard("Total balance").getByText("$2,800.00")
    ).toBeVisible();
  });

  it("does not render a transaction history table", async () => {
    render(await renderHome("2026-09"));

    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "History" })
    ).not.toBeInTheDocument();
  });

  it("renders the dashboard heading followed by the breakdown heading", async () => {
    render(await renderHome("2026-09"));

    expect(
      screen.getByRole("heading", { level: 1, name: "Dashboard" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: OUTCOME_HEADING })
    ).toBeInTheDocument();
  });

  it("marks the dashboard link as the current page", async () => {
    render(await renderHome("2026-09"));

    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  it("shows the balance card outcome equal to the breakdown total", async () => {
    render(await renderHome("2026-09"));

    const cardOutcome = getSummaryCard("Total outcome").getByText("$200.00");
    const breakdownOutcome = screen.getByRole("list", {
      name: OUTCOME_HEADING,
    }).textContent;
    expect(cardOutcome).toBeVisible();
    expect(breakdownOutcome).toContain("$200.00");
  });

  it("sets the page title to Dashboard", () => {
    expect(metadata.title).toBe("Dashboard");
  });
});
