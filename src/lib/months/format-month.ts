import type { YearMonth } from "./year-month";

const MONTH_LABEL_LOCALE = "en-US";

export function formatMonthLabel(value: YearMonth): string {
  const firstDay = new Date(Date.UTC(value.year, value.month - 1, 1));
  return new Intl.DateTimeFormat(MONTH_LABEL_LOCALE, {
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  }).format(firstDay);
}
