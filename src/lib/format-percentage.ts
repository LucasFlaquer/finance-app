const PERCENTAGE_FRACTION_DIGITS = 1;

export function formatPercentage(value: number): string {
  return `${value.toFixed(PERCENTAGE_FRACTION_DIGITS)}%`;
}
