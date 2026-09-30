import type { YearMonth } from "../months/year-month";
import type {
  TransactionsSummary,
  TransactionType,
} from "../transactions/transaction-types";

export type CategoryTypeTotal = {
  categoryId: string;
  type: TransactionType;
  amountCents: number;
  count: number;
};

export type CategoryBreakdownRow = {
  categoryId: string;
  name: string;
  amount: number;
  percentage: number;
  count: number;
  color: string;
};

export type CategoryBreakdown = {
  type: TransactionType;
  total: number;
  rows: CategoryBreakdownRow[];
};

export type MonthlyDashboard = {
  month: YearMonth;
  summary: TransactionsSummary;
  breakdowns: Record<TransactionType, CategoryBreakdown>;
};
