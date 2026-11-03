import type { TransactionType } from "@/lib/transactions/transaction-types";
import { BREAKDOWN_TYPE_LABELS } from "./breakdown-type-labels";

type CategoryBreakdownEmptyStateProps = {
  type: TransactionType;
  monthLabel: string;
};

function CategoryBreakdownEmptyState({
  type,
  monthLabel,
}: CategoryBreakdownEmptyStateProps) {
  const noun = BREAKDOWN_TYPE_LABELS[type].toLowerCase();
  return (
    <p className="rounded-lg border border-dashed p-8 text-center text-muted-foreground text-sm">
      {`No ${noun} recorded in ${monthLabel}`}
    </p>
  );
}

export { CategoryBreakdownEmptyState };
