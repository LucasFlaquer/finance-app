import type { CategoryOption } from "@/lib/transactions/transaction-types";
import { NewTransactionDialog } from "./new-transaction-dialog";

export type TransactionsHeaderProps = {
  categories: CategoryOption[];
};

export function TransactionsHeader({ categories }: TransactionsHeaderProps) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-2xl tracking-tight">Transactions</h1>
        <p className="text-muted-foreground text-sm">
          Track your income and outcome in one place.
        </p>
      </div>
      <NewTransactionDialog categories={categories} />
    </header>
  );
}
