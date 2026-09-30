import type { CategoryBreakdownRow as CategoryBreakdownRowData } from "@/lib/dashboard/dashboard-types";
import { CategoryBreakdownRow } from "./category-breakdown-row";

type CategoryBreakdownListProps = {
  rows: CategoryBreakdownRowData[];
  label: string;
};

function CategoryBreakdownList({ rows, label }: CategoryBreakdownListProps) {
  return (
    <ul aria-label={label} className="flex flex-col divide-y divide-border">
      {rows.map((row) => (
        <CategoryBreakdownRow key={row.categoryId} row={row} />
      ))}
    </ul>
  );
}

export { CategoryBreakdownList };
