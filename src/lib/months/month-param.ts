import type { YearMonth } from "./year-month";

export const MONTH_PARAM = "month";

// Matches "YYYY-MM" with a four-digit year >= 1000 and a month from 01 to 12
const MONTH_PARAM_PATTERN = /^([1-9]\d{3})-(0[1-9]|1[0-2])$/;
const MONTH_PARAM_MONTH_DIGITS = 2;

export function parseMonthParam(
  raw: string | string[] | undefined
): YearMonth | null {
  if (typeof raw !== "string") {
    return null;
  }
  const match = MONTH_PARAM_PATTERN.exec(raw);
  if (!match) {
    return null;
  }
  return { month: Number(match[2]), year: Number(match[1]) };
}

export function formatMonthParam(value: YearMonth): string {
  const month = String(value.month).padStart(MONTH_PARAM_MONTH_DIGITS, "0");
  return `${value.year}-${month}`;
}
