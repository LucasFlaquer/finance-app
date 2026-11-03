import { parseMonthParam } from "./month-param";
import {
  compareYearMonth,
  currentYearMonth,
  type YearMonth,
} from "./year-month";

export type SelectedMonth =
  | { kind: "selected"; month: YearMonth; currentMonth: YearMonth }
  | { kind: "redirect"; month: YearMonth };

export function resolveSelectedMonth(
  raw: string | string[] | undefined,
  now: Date
): SelectedMonth {
  const currentMonth = currentYearMonth(now);
  if (raw === undefined) {
    return { currentMonth, kind: "selected", month: currentMonth };
  }
  const month = parseMonthParam(raw);
  if (!month) {
    return { kind: "redirect", month: currentMonth };
  }
  if (compareYearMonth(month, currentMonth) > 0) {
    return { kind: "redirect", month: currentMonth };
  }
  return { currentMonth, kind: "selected", month };
}
