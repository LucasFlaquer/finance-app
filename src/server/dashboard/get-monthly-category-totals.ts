import type { CategoryTypeTotal } from "@/lib/dashboard/dashboard-types";
import { toCents } from "@/lib/money/cents";
import prisma from "@/lib/prisma";
import type { TransactionType } from "@/lib/transactions/transaction-types";

type MonthRange = {
  start: Date;
  end: Date;
};

export async function getMonthlyCategoryTotals({
  start,
  end,
}: MonthRange): Promise<CategoryTypeTotal[]> {
  const groups = await prisma.transaction.groupBy({
    _count: { _all: true },
    _sum: { amount: true },
    by: ["categoryId", "type"],
    where: { createdAt: { gte: start, lt: end } },
  });
  return groups.map((group) => ({
    amountCents: toCents(group._sum.amount),
    categoryId: group.categoryId,
    count: group._count._all,
    type: group.type as TransactionType,
  }));
}
