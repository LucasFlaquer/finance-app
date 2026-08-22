import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { DEFAULT_CATEGORIES, SEED_TRANSACTIONS } from "./seed-data";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function seedCategories() {
  await prisma.category.createMany({
    data: DEFAULT_CATEGORIES.map((name) => ({ name })),
    skipDuplicates: true,
  });
}

async function seedTransactions() {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
  });
  const categoryIdByName = new Map(
    categories.map((category) => [category.name, category.id])
  );
  await prisma.transaction.deleteMany();
  await prisma.transaction.createMany({
    data: SEED_TRANSACTIONS.map((transaction) => ({
      amount: transaction.amount,
      categoryId: categoryIdByName.get(transaction.categoryName) as string,
      createdAt: new Date(transaction.createdAt),
      title: transaction.title,
      type: transaction.type,
    })),
  });
}

async function main() {
  await seedCategories();
  await seedTransactions();
}

main()
  .catch((error) => {
    process.exitCode = 1;
    throw error;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
