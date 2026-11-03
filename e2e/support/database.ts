import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import pg from "pg";
import { DEFAULT_CATEGORIES } from "../../prisma/seed-data";
import { readE2eDatabaseUrl } from "./config";
import { buildFixtureTransactions } from "./fixture";

const ADMIN_DATABASE = "postgres";

function adminUrl(url: string): string {
  const admin = new URL(url);
  admin.pathname = `/${ADMIN_DATABASE}`;
  return admin.toString();
}

async function withPool<T>(
  url: string,
  work: (pool: pg.Pool) => Promise<T>
): Promise<T> {
  const pool = new pg.Pool({ connectionString: url });
  try {
    return await work(pool);
  } finally {
    await pool.end();
  }
}

export async function ensureDatabase(): Promise<void> {
  const url = readE2eDatabaseUrl();
  const name = new URL(url).pathname.slice(1);
  await withPool(adminUrl(url), async (pool) => {
    const existing = await pool.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [name]
    );
    if (existing.rowCount === 0) {
      await pool.query(`CREATE DATABASE "${name}"`);
    }
  });
}

export function migrateDatabase(): void {
  execFileSync("pnpm", ["exec", "prisma", "migrate", "deploy"], {
    env: { ...process.env, DATABASE_URL: readE2eDatabaseUrl() },
    stdio: "inherit",
  });
}

async function insertCategories(pool: pg.Pool): Promise<void> {
  await Promise.all(
    DEFAULT_CATEGORIES.map((name) =>
      pool.query(
        `INSERT INTO "Category" (id, name, "updatedAt") VALUES ($1, $2, now()) ON CONFLICT (name) DO NOTHING`,
        [randomUUID(), name]
      )
    )
  );
}

async function insertTransactions(pool: pg.Pool): Promise<void> {
  await Promise.all(
    buildFixtureTransactions().map((transaction) =>
      pool.query(
        `INSERT INTO "Transaction" (id, title, amount, type, "categoryId", "createdAt", "updatedAt")
       SELECT $1, $2, $3, $4::"TransactionType", id, $5, now() FROM "Category" WHERE name = $6`,
        [
          randomUUID(),
          transaction.title,
          transaction.amount,
          transaction.type,
          transaction.createdAt.toISOString(),
          transaction.categoryName,
        ]
      )
    )
  );
}

export async function reseedDatabase(): Promise<void> {
  await withPool(readE2eDatabaseUrl(), async (pool) => {
    await insertCategories(pool);
    await pool.query(`DELETE FROM "Transaction"`);
    await insertTransactions(pool);
  });
}
