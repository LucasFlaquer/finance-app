import prisma from "@/lib/prisma";
import type {
  TransactionListItem,
  TransactionType,
} from "@/lib/transactions/transaction-types";

const TRANSACTIONS_LIMIT = 100;

export async function listTransactions(): Promise<TransactionListItem[]> {
  const transactions = await prisma.transaction.findMany({
    include: { category: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: TRANSACTIONS_LIMIT,
  });
  return transactions.map((transaction) => ({
    amount: Number(transaction.amount),
    categoryName: transaction.category.name,
    createdAt: transaction.createdAt,
    id: transaction.id,
    title: transaction.title,
    type: transaction.type as TransactionType,
  }));
}
