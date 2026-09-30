import type { TransactionType } from "../transactions/transaction-types";
import type { CategoryTypeTotal } from "./dashboard-types";

export type CategorySum = {
  amountCents: number;
  count: number;
};

export const EMPTY_SUM: CategorySum = { amountCents: 0, count: 0 };

export function sumTotalsByCategory(
  totals: CategoryTypeTotal[],
  type: TransactionType
): Map<string, CategorySum> {
  const byCategory = new Map<string, CategorySum>();
  for (const total of totals) {
    if (total.type !== type) {
      continue;
    }
    const current = byCategory.get(total.categoryId) ?? EMPTY_SUM;
    byCategory.set(total.categoryId, {
      amountCents: current.amountCents + total.amountCents,
      count: current.count + total.count,
    });
  }
  return byCategory;
}
