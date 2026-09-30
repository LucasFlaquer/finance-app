import { render } from "@testing-library/react";
import type { CategoryBreakdownRow } from "@/lib/dashboard/dashboard-types";
import { CategoryPieChart } from "./category-pie-chart";

const CHART_LABEL = "Outcome by category";

function buildRow(
  overrides: Partial<CategoryBreakdownRow>
): CategoryBreakdownRow {
  return {
    amount: 0,
    categoryId: "id",
    color: "var(--chart-1)",
    count: 1,
    name: "Name",
    percentage: 0,
    ...overrides,
  };
}

export const GROCERIES = buildRow({
  amount: 600,
  categoryId: "groceries",
  color: "var(--chart-1)",
  name: "Groceries",
  percentage: 30,
});
export const HOUSING = buildRow({
  amount: 1000,
  categoryId: "housing",
  color: "var(--chart-2)",
  name: "Housing",
  percentage: 50,
});
export const TRANSPORT = buildRow({
  amount: 400,
  categoryId: "transport",
  color: "var(--chart-3)",
  name: "Transport",
  percentage: 20,
});
export const UNUSED = buildRow({
  categoryId: "unused",
  color: "var(--chart-4)",
  name: "Unused",
});

export const GROCERIES_SLICE_NAME = "Groceries: $600.00, 30.0%";
export const HOUSING_SLICE_NAME = "Housing: $1,000.00, 50.0%";

export function renderChart(rows: CategoryBreakdownRow[]) {
  return render(<CategoryPieChart label={CHART_LABEL} rows={rows} />);
}
