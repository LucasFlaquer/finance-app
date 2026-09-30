import type { PieSectorShapeProps } from "recharts";
import { Sector } from "recharts";
import type { CategoryBreakdownRow } from "@/lib/dashboard/dashboard-types";
import { formatCurrency } from "@/lib/format-currency";
import { formatPercentage } from "@/lib/format-percentage";

const SLICE_SEPARATOR_STROKE = "var(--card)";

export type SliceDatum = CategoryBreakdownRow & {
  onActivate: () => void;
  onClear: () => void;
};

function CategorySlice(sector: PieSectorShapeProps) {
  const row: SliceDatum = sector.payload;
  return (
    // biome-ignore lint/a11y/noInteractiveElementToNoninteractiveRole: AC-21 requires focusable slices announced as named images
    <g
      aria-label={`${row.name}: ${formatCurrency(row.amount)}, ${formatPercentage(row.percentage)}`}
      className="outline-none focus-visible:[&>path]:stroke-[3px] focus-visible:[&>path]:stroke-foreground"
      onBlur={row.onClear}
      onFocus={row.onActivate}
      onMouseEnter={row.onActivate}
      onMouseLeave={row.onClear}
      role="img"
      tabIndex={0}
    >
      <Sector
        cornerRadius={sector.cornerRadius}
        cx={sector.cx}
        cy={sector.cy}
        endAngle={sector.endAngle}
        fill={row.color}
        innerRadius={sector.innerRadius}
        outerRadius={sector.outerRadius}
        startAngle={sector.startAngle}
        stroke={SLICE_SEPARATOR_STROKE}
      />
    </g>
  );
}

export { CategorySlice };
