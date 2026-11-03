"use client";

import { useBreakdownType } from "@/hooks/use-breakdown-type";
import type { CategoryBreakdown } from "@/lib/dashboard/dashboard-types";
import { formatMonthLabel } from "@/lib/months/format-month";
import type { YearMonth } from "@/lib/months/year-month";
import type { TransactionType } from "@/lib/transactions/transaction-types";
import { BREAKDOWN_TYPE_LABELS } from "./breakdown-type-labels";
import { BreakdownTypeToggle } from "./breakdown-type-toggle";
import { CategoryBreakdownEmptyState } from "./category-breakdown-empty-state";
import { CategoryBreakdownList } from "./category-breakdown-list";
import { CategoryPieChart } from "./category-pie-chart";

type CategoryBreakdownSectionProps = {
  month: YearMonth;
  breakdowns: Record<TransactionType, CategoryBreakdown>;
};

function CategoryBreakdownSection({
  month,
  breakdowns,
}: CategoryBreakdownSectionProps) {
  const { type, setType } = useBreakdownType();
  const breakdown = breakdowns[type];
  const monthLabel = formatMonthLabel(month);
  const heading = `${BREAKDOWN_TYPE_LABELS[type]} by category — ${monthLabel}`;
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-medium text-lg tracking-tight">{heading}</h2>
        <BreakdownTypeToggle onChange={setType} type={type} />
      </div>
      <div aria-live="polite" className="grid items-start gap-6 lg:grid-cols-2">
        {breakdown.total > 0 ? (
          <CategoryPieChart label={heading} rows={breakdown.rows} />
        ) : (
          <CategoryBreakdownEmptyState monthLabel={monthLabel} type={type} />
        )}
        <CategoryBreakdownList label={heading} rows={breakdown.rows} />
      </div>
    </section>
  );
}

export { CategoryBreakdownSection };
