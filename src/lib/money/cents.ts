export const CENTS_PER_UNIT = 100;

export function toCents(
  value: { toString: () => string } | number | null
): number {
  if (value === null) {
    return 0;
  }
  return Math.round(Number(value.toString()) * CENTS_PER_UNIT);
}

export function fromCents(cents: number): number {
  return cents / CENTS_PER_UNIT;
}
