import type { CategoryBreakdownRow as CategoryBreakdownRowData } from "@/lib/dashboard/dashboard-types";
import { formatCurrency } from "@/lib/format-currency";
import { formatPercentage } from "@/lib/format-percentage";
import { formatTransactionCount } from "./transaction-count-label";

type CategoryBreakdownRowProps = {
  row: CategoryBreakdownRowData;
};

function CategoryBreakdownRow({ row }: CategoryBreakdownRowProps) {
  return (
    <li className="flex items-center gap-3 py-2">
      <span
        aria-hidden="true"
        className="size-3 shrink-0 rounded-full"
        data-testid="category-swatch"
        style={{ backgroundColor: row.color }}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-medium text-sm">{row.name}</span>
        <span className="text-muted-foreground text-xs">
          {formatTransactionCount(row.count)}
        </span>
      </div>
      <div className="flex flex-col items-end tabular-nums">
        <span className="font-medium text-sm">
          {formatCurrency(row.amount)}
        </span>
        <span className="text-muted-foreground text-xs">
          {formatPercentage(row.percentage)}
        </span>
      </div>
    </li>
  );
}

export { CategoryBreakdownRow };
