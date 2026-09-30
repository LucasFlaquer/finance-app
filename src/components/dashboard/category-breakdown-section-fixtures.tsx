import { render } from "@testing-library/react";
import type {
  CategoryBreakdown,
  CategoryBreakdownRow,
} from "@/lib/dashboard/dashboard-types";
import type { TransactionType } from "@/lib/transactions/transaction-types";
import { CategoryBreakdownSection } from "./category-breakdown-section";

const SEPTEMBER_2026 = { month: 9, year: 2026 };

function buildRow(
  overrides: Partial<CategoryBreakdownRow>
): CategoryBreakdownRow {
  return {
    amount: 0,
    categoryId: "id",
    color: "var(--chart-1)",
    count: 0,
    name: "Name",
    percentage: 0,
    ...overrides,
  };
}

const GROCERIES = buildRow({
  amount: 600,
  categoryId: "groceries",
  count: 2,
  name: "Groceries",
  percentage: 100,
});
const SALARY = buildRow({
  amount: 3000,
  categoryId: "salary",
  color: "var(--chart-2)",
  count: 1,
  name: "Salary",
  percentage: 100,
});

export const EMPTY_GROCERIES = buildRow({
  categoryId: "groceries",
  name: "Groceries",
});
export const EMPTY_SALARY = buildRow({ categoryId: "salary", name: "Salary" });

export function buildBreakdowns(
  overrides: Partial<Record<TransactionType, CategoryBreakdown>> = {}
): Record<TransactionType, CategoryBreakdown> {
  return {
    INCOME: { rows: [SALARY], total: 3000, type: "INCOME" },
    OUTCOME: { rows: [GROCERIES], total: 600, type: "OUTCOME" },
    ...overrides,
  };
}

export function renderSection(breakdowns = buildBreakdowns()) {
  return render(
    <CategoryBreakdownSection breakdowns={breakdowns} month={SEPTEMBER_2026} />
  );
}
