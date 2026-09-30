import type { CategoryTypeTotal } from "./dashboard-types";

export const HOUSING = { id: "housing", name: "Housing" };
export const GROCERIES = { id: "groceries", name: "Groceries" };
export const TRANSPORT = { id: "transport", name: "Transport" };
export const SALARY = { id: "salary", name: "Salary" };
export const ALPHABETICAL_CATEGORIES = [GROCERIES, HOUSING, SALARY, TRANSPORT];

export function outcomeTotal(
  categoryId: string,
  amountCents: number,
  count = 1
): CategoryTypeTotal {
  return { amountCents, categoryId, count, type: "OUTCOME" };
}
