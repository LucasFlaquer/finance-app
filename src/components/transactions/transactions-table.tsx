import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TransactionListItem } from "@/lib/transactions/transaction-types";
import { TransactionRow } from "./transaction-row";
import { TransactionsEmptyState } from "./transactions-empty-state";

export type TransactionsTableProps = {
  transactions: TransactionListItem[];
};

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  if (transactions.length === 0) {
    return <TransactionsEmptyState />;
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-resting">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TransactionRow key={transaction.id} transaction={transaction} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
