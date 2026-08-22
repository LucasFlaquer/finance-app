import prisma from "@/lib/prisma";
import type { CategoryOption } from "@/lib/transactions/transaction-types";

export async function listCategories(): Promise<CategoryOption[]> {
  return await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
}
