import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const DEFAULT_CATEGORIES = [
  "Salary",
  "Investments",
  "Housing",
  "Groceries",
  "Transport",
  "Health",
  "Education",
  "Entertainment",
  "Subscriptions",
  "Other",
] as const;

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function seedCategories() {
  await prisma.category.createMany({
    data: DEFAULT_CATEGORIES.map((name) => ({ name })),
    skipDuplicates: true,
  });
}

async function main() {
  await seedCategories();
}

main()
  .catch((error) => {
    process.exitCode = 1;
    throw error;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
