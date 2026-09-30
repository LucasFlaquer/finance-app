import { fromCents, toCents } from "../money/cents";
import type { CategoryOption } from "../transactions/transaction-types";
import { buildCategoryBreakdown } from "./build-category-breakdown";
import type { CategoryTypeTotal, MonthlyDashboard } from "./dashboard-types";

type BuildMonthlyDashboardParams = {
  categories: CategoryOption[];
  totals: CategoryTypeTotal[];
};

export function buildMonthlyDashboard({
  categories,
  totals,
}: BuildMonthlyDashboardParams): Omit<MonthlyDashboard, "month"> {
  const income = buildCategoryBreakdown({ categories, totals, type: "INCOME" });
  const outcome = buildCategoryBreakdown({
    categories,
    totals,
    type: "OUTCOME",
  });
  const balanceCents = toCents(income.total) - toCents(outcome.total);
  return {
    breakdowns: { INCOME: income, OUTCOME: outcome },
    summary: {
      income: income.total,
      outcome: outcome.total,
      total: fromCents(balanceCents),
    },
  };
}
