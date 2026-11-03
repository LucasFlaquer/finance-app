"use client";

import { useMemo } from "react";
import { useActiveSlice } from "@/hooks/use-active-slice";
import type { CategoryBreakdownRow } from "@/lib/dashboard/dashboard-types";
import { formatPercentage } from "@/lib/format-percentage";
import { ActiveSliceReadout } from "./active-slice-readout";
import { CategoryPieCanvas } from "./category-pie-canvas";
import type { SliceDatum } from "./category-slice";

type CategoryPieChartProps = {
  rows: CategoryBreakdownRow[];
  label: string;
};

function summarize(rows: CategoryBreakdownRow[]): string {
  return rows
    .map((row) => `${row.name} ${formatPercentage(row.percentage)}`)
    .join(", ");
}

function CategoryPieChart({ rows, label }: CategoryPieChartProps) {
  const { activeId, activate, clear } = useActiveSlice();
  const slices = useMemo(() => rows.filter((row) => row.amount > 0), [rows]);
  const data = useMemo<SliceDatum[]>(
    () =>
      slices.map((row) => ({
        ...row,
        onActivate: () => activate(row.categoryId),
        onClear: clear,
      })),
    [slices, activate, clear]
  );
  const activeRow = slices.find((row) => row.categoryId === activeId) ?? null;
  return (
    <figure className="flex flex-col gap-2">
      <CategoryPieCanvas data={data} />
      <ActiveSliceReadout row={activeRow} />
      <figcaption className="sr-only">{`${label}: ${summarize(slices)}`}</figcaption>
    </figure>
  );
}

export { CategoryPieChart };
