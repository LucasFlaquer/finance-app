import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import type { TransactionType } from "@/lib/transactions/transaction-types";
import { BREAKDOWN_TYPE_LABELS } from "./breakdown-type-labels";

type BreakdownTypeOptionProps = {
  option: TransactionType;
  isSelected: boolean;
  onSelect: (type: TransactionType) => void;
};

function BreakdownTypeOption({
  option,
  isSelected,
  onSelect,
}: BreakdownTypeOptionProps) {
  const select = useCallback(() => onSelect(option), [onSelect, option]);
  return (
    <Button
      aria-pressed={isSelected}
      onClick={select}
      variant={isSelected ? "secondary" : "ghost"}
    >
      {BREAKDOWN_TYPE_LABELS[option]}
    </Button>
  );
}

export { BreakdownTypeOption };
