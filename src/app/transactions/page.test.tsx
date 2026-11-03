import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  GROCERIES_ROW,
  SALARY_ROW,
} from "@/app/testing/transactions-page-fixtures";

const transactionFindMany = vi.fn();
const transactionGroupBy = vi.fn();
const categoryFindMany = vi.fn();

vi.mock("@/lib/prisma", () => ({
  default: {
    category: { findMany: (...args: unknown[]) => categoryFindMany(...args) },
    transaction: {
      findMany: (...args: unknown[]) => transactionFindMany(...args),
      groupBy: (...args: unknown[]) => transactionGroupBy(...args),
    },
  },
}));

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const { default: TransactionsPage, metadata } = await import("./page");

describe("TransactionsPage", () => {
  beforeEach(() => {
    transactionFindMany.mockReset();
    transactionGroupBy.mockReset();
    categoryFindMany.mockReset();
    categoryFindMany.mockResolvedValue([{ id: "category-1", name: "Salary" }]);
    transactionFindMany.mockResolvedValue([GROCERIES_ROW, SALARY_ROW]);
    transactionGroupBy.mockResolvedValue([
      { _sum: { amount: { toString: () => "3000.00" } }, type: "INCOME" },
      { _sum: { amount: { toString: () => "120.50" } }, type: "OUTCOME" },
    ]);
  });

  it("renders the all-time balance cards", async () => {
    render(await TransactionsPage());

    expect(screen.getByText("$3,000.00")).toBeInTheDocument();
    expect(screen.getByText("$120.50")).toBeInTheDocument();
    expect(screen.getByText("$2,879.50")).toBeInTheDocument();
  });

  it("renders the history table with every transaction", async () => {
    render(await TransactionsPage());

    const table = screen.getByRole("table");
    expect(within(table).getByText("Monthly salary")).toBeInTheDocument();
    expect(within(table).getByText("Weekly groceries")).toBeInTheDocument();
  });

  it("marks the transactions link as the current page", async () => {
    render(await TransactionsPage());

    expect(screen.getByRole("link", { name: "Transactions" })).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  it("renders the transactions heading followed by the history heading", async () => {
    render(await TransactionsPage());

    expect(
      screen.getByRole("heading", { level: 1, name: "Transactions" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "History" })
    ).toBeInTheDocument();
  });

  it("shows the empty state without transactions", async () => {
    transactionFindMany.mockResolvedValue([]);
    transactionGroupBy.mockResolvedValue([]);

    render(await TransactionsPage());

    expect(screen.getByText("No transactions yet")).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("sets the page title to Transactions", () => {
    expect(metadata.title).toBe("Transactions");
  });
});
