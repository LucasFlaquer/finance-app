const DATE_LOCALE = "en-US";

export function formatTransactionDate(date: Date): string {
  return new Intl.DateTimeFormat(DATE_LOCALE, {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  }).format(date);
}
