export const CHART_PALETTE_SIZE = 10;

export function categoryColor(alphabeticalIndex: number): string {
  return `var(--chart-${(alphabeticalIndex % CHART_PALETTE_SIZE) + 1})`;
}
