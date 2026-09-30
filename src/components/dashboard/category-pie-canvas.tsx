"use client";

import { memo } from "react";
import { Pie, PieChart } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { CategorySlice, type SliceDatum } from "./category-slice";

const NO_TAB_STOP = -1;
const CHART_CONFIG = {};

type CategoryPieCanvasProps = {
  data: SliceDatum[];
};

function CategoryPieCanvasBase({ data }: CategoryPieCanvasProps) {
  return (
    <ChartContainer
      className="mx-auto aspect-square w-full max-w-72"
      config={CHART_CONFIG}
    >
      <PieChart accessibilityLayer={false}>
        <Pie
          data={data}
          dataKey="amount"
          isAnimationActive={false}
          nameKey="name"
          rootTabIndex={NO_TAB_STOP}
          shape={CategorySlice}
        />
      </PieChart>
    </ChartContainer>
  );
}

const CategoryPieCanvas = memo(CategoryPieCanvasBase);

export { CategoryPieCanvas };
