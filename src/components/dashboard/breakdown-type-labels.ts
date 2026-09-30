import type { TransactionType } from "@/lib/transactions/transaction-types";

export const BREAKDOWN_TYPE_LABELS: Record<TransactionType, string> = {
  INCOME: "Income",
  OUTCOME: "Outcome",
};
