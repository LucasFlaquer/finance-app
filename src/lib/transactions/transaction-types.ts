export type TransactionType = "INCOME" | "OUTCOME";

export type TransactionListItem = {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  categoryName: string;
  createdAt: Date;
};

export type TransactionsSummary = {
  income: number;
  outcome: number;
  total: number;
};

export type TransactionAmountByType = {
  type: TransactionType;
  amount: number;
};

export type CategoryOption = {
  id: string;
  name: string;
};
