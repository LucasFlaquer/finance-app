import type { CategoryBreakdownRow } from "@/lib/dashboard/dashboard-types";
import { formatCurrency } from "@/lib/format-currency";
import { formatPercentage } from "@/lib/format-percentage";

type ActiveSliceReadoutProps = {
  row: CategoryBreakdownRow | null;
};

function ActiveSliceReadout({ row }: ActiveSliceReadoutProps) {
  return (
    <output
      aria-live="polite"
      className="block min-h-6 text-center font-medium text-sm tabular-nums"
    >
      {row
        ? `${row.name}: ${formatCurrency(row.amount)}, ${formatPercentage(row.percentage)}`
        : null}
    </output>
  );
}

export { ActiveSliceReadout };
