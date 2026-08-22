import type { TransactionType } from "./transactions/transaction-types";

const CURRENCY_LOCALE = "en-US";
const CURRENCY_CODE = "USD";

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat(CURRENCY_LOCALE, {
    currency: CURRENCY_CODE,
    style: "currency",
  }).format(value);
}

export function formatSignedCurrency(
  value: number,
  type: TransactionType
): string {
  const sign = type === "INCOME" ? "+" : "-";
  return `${sign}${formatCurrency(Math.abs(value))}`;
}
