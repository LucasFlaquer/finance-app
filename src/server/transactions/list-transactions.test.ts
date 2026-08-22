import { beforeEach, describe, expect, it, vi } from "vitest";

const findMany = vi.fn();

vi.mock("@/lib/prisma", () => ({
  default: {
    transaction: { findMany: (...args: unknown[]) => findMany(...args) },
  },
}));

const { listTransactions } = await import("./list-transactions");

describe("listTransactions", () => {
  beforeEach(() => {
    findMany.mockReset();
  });

  it("maps a database row to a serializable list item", async () => {
    findMany.mockResolvedValue([
      {
        amount: { toString: () => "120.50" },
        category: { name: "Groceries" },
        createdAt: new Date("2026-08-05T19:20:00Z"),
        id: "transaction-1",
        title: "Weekly groceries",
        type: "OUTCOME",
      },
    ]);

    const transactions = await listTransactions();

    expect(transactions).toEqual([
      {
        amount: 120.5,
        categoryName: "Groceries",
        createdAt: new Date("2026-08-05T19:20:00Z"),
        id: "transaction-1",
        title: "Weekly groceries",
        type: "OUTCOME",
      },
    ]);
  });

  it("requests the newest transactions first, capped at 100", async () => {
    findMany.mockResolvedValue([]);

    await listTransactions();

    expect(findMany).toHaveBeenCalledWith({
      include: { category: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  });

  it("returns an empty list when there are no transactions", async () => {
    findMany.mockResolvedValue([]);

    await expect(listTransactions()).resolves.toEqual([]);
  });
});
