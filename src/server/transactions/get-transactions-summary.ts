import prisma from "@/lib/prisma";
import { summarizeTransactions } from "@/lib/transactions/summarize-transactions";
import type {
  TransactionsSummary,
  TransactionType,
} from "@/lib/transactions/transaction-types";

export async function getTransactionsSummary(): Promise<TransactionsSummary> {
  const groups = await prisma.transaction.groupBy({
    _sum: { amount: true },
    by: ["type"],
  });
  return summarizeTransactions(
    groups.map((group) => ({
      amount: Number(group._sum.amount ?? 0),
      type: group.type as TransactionType,
    }))
  );
}
