import type {
  TransactionAmountByType,
  TransactionsSummary,
} from "./transaction-types";

const CENTS_PER_UNIT = 100;

function roundToCents(value: number): number {
  return Math.round(value * CENTS_PER_UNIT) / CENTS_PER_UNIT;
}

export function summarizeTransactions(
  amountsByType: TransactionAmountByType[]
): TransactionsSummary {
  let income = 0;
  let outcome = 0;
  for (const entry of amountsByType) {
    if (entry.type === "INCOME") {
      income += entry.amount;
      continue;
    }
    outcome += entry.amount;
  }
  return {
    income: roundToCents(income),
    outcome: roundToCents(outcome),
    total: roundToCents(income - outcome),
  };
}
