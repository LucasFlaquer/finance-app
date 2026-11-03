import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatSignedCurrency } from "@/lib/format-currency";
import { formatTransactionDate } from "@/lib/format-date";
import type { TransactionListItem } from "@/lib/transactions/transaction-types";
import { cn } from "@/lib/utils";

export type TransactionRowProps = {
  transaction: TransactionListItem;
};

export function TransactionRow({ transaction }: TransactionRowProps) {
  const isIncome = transaction.type === "INCOME";
  return (
    <TableRow>
      <TableCell className="font-medium">{transaction.title}</TableCell>
      <TableCell>
        <Badge variant="secondary">{transaction.categoryName}</Badge>
      </TableCell>
      <TableCell className="text-muted-foreground tabular-nums">
        {formatTransactionDate(transaction.createdAt)}
      </TableCell>
      <TableCell
        className={cn(
          "text-right font-semibold tabular-nums",
          isIncome
            ? "text-emerald-700 dark:text-emerald-400"
            : "text-destructive"
        )}
      >
        {formatSignedCurrency(transaction.amount, transaction.type)}
      </TableCell>
    </TableRow>
  );
}
