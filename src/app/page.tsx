import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CategoryBreakdownSection } from "@/components/dashboard/category-breakdown-section";
import { MonthNavigation } from "@/components/dashboard/month-navigation";
import { AppHeader } from "@/components/layout/app-header";
import { SummaryCards } from "@/components/transactions/summary-cards";
import { formatMonthParam, MONTH_PARAM } from "@/lib/months/month-param";
import { resolveSelectedMonth } from "@/lib/months/resolve-selected-month";
import { listCategories } from "@/server/categories/list-categories";
import { getMonthlyDashboard } from "@/server/dashboard/get-monthly-dashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
};

type HomeProps = {
  searchParams: Promise<{ month?: string | string[] }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const { month: monthParam } = await searchParams;
  const selection = resolveSelectedMonth(monthParam, new Date());
  if (selection.kind === "redirect") {
    redirect(`/?${MONTH_PARAM}=${formatMonthParam(selection.month)}`);
  }
  const { month, currentMonth } = selection;
  const [dashboard, categories] = await Promise.all([
    getMonthlyDashboard(month),
    listCategories(),
  ]);
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-10">
      <AppHeader categories={categories} current="dashboard">
        <MonthNavigation currentMonth={currentMonth} month={month} />
      </AppHeader>
      <h1 className="font-semibold text-2xl tracking-tight">Dashboard</h1>
      <SummaryCards summary={dashboard.summary} />
      <CategoryBreakdownSection
        breakdowns={dashboard.breakdowns}
        month={month}
      />
    </main>
  );
}
