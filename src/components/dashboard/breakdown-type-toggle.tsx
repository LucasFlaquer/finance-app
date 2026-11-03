import type { TransactionType } from "@/lib/transactions/transaction-types";
import { BreakdownTypeOption } from "./breakdown-type-option";

type BreakdownTypeToggleProps = {
  type: TransactionType;
  onChange: (type: TransactionType) => void;
};

const TYPE_OPTIONS: TransactionType[] = ["OUTCOME", "INCOME"];

function BreakdownTypeToggle({ type, onChange }: BreakdownTypeToggleProps) {
  return (
    <fieldset aria-label="Breakdown type" className="flex items-center gap-1">
      {TYPE_OPTIONS.map((option) => (
        <BreakdownTypeOption
          isSelected={option === type}
          key={option}
          onSelect={onChange}
          option={option}
        />
      ))}
    </fieldset>
  );
}

export { BreakdownTypeToggle };
