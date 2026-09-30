import { buildMonthlyDashboard } from "@/lib/dashboard/build-monthly-dashboard";
import type { MonthlyDashboard } from "@/lib/dashboard/dashboard-types";
import { monthRange, type YearMonth } from "@/lib/months/year-month";
import { listCategories } from "../categories/list-categories";
import { getMonthlyCategoryTotals } from "./get-monthly-category-totals";

export async function getMonthlyDashboard(
  month: YearMonth
): Promise<MonthlyDashboard> {
  const [totals, categories] = await Promise.all([
    getMonthlyCategoryTotals(monthRange(month)),
    listCategories(),
  ]);
  return { month, ...buildMonthlyDashboard({ categories, totals }) };
}
