import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { TransactionListItem } from "@/lib/transactions/transaction-types";
import { TransactionsTable } from "./transactions-table";

function buildTransaction(
  overrides: Partial<TransactionListItem> = {}
): TransactionListItem {
  return {
    amount: 120.5,
    categoryName: "Groceries",
    createdAt: new Date("2026-08-05T19:20:00Z"),
    id: "transaction-1",
    title: "Weekly groceries",
    type: "OUTCOME",
    ...overrides,
  };
}

describe("TransactionsTable", () => {
  it("renders a row for each transaction", () => {
    render(
      <TransactionsTable
        transactions={[
          buildTransaction(),
          buildTransaction({ id: "transaction-2", title: "August salary" }),
        ]}
      />
    );

    expect(screen.getAllByRole("row")).toHaveLength(3);
  });

  it("renders an outcome amount with a minus sign", () => {
    render(<TransactionsTable transactions={[buildTransaction()]} />);

    expect(screen.getByText("-$120.50")).toBeInTheDocument();
  });

  it("renders an income amount with a plus sign", () => {
    render(
      <TransactionsTable
        transactions={[buildTransaction({ amount: 5400, type: "INCOME" })]}
      />
    );

    expect(screen.getByText("+$5,400.00")).toBeInTheDocument();
  });

  it("renders the transaction category and date", () => {
    render(<TransactionsTable transactions={[buildTransaction()]} />);

    expect(screen.getByText("Groceries")).toBeInTheDocument();
    expect(screen.getByText("Aug 05, 2026")).toBeInTheDocument();
  });

  it("renders the empty state when there are no transactions", () => {
    render(<TransactionsTable transactions={[]} />);

    expect(
      screen.getByRole("heading", { name: "No transactions yet" })
    ).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });
});
