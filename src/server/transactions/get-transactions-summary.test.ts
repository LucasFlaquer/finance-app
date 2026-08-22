import { beforeEach, describe, expect, it, vi } from "vitest";

const groupBy = vi.fn();

vi.mock("@/lib/prisma", () => ({
  default: {
    transaction: { groupBy: (...args: unknown[]) => groupBy(...args) },
  },
}));

const { getTransactionsSummary } = await import("./get-transactions-summary");

describe("getTransactionsSummary", () => {
  beforeEach(() => {
    groupBy.mockReset();
  });

  it("builds a summary from the grouped database sums", async () => {
    groupBy.mockResolvedValue([
      { _sum: { amount: "5400" }, type: "INCOME" },
      { _sum: { amount: "1450.5" }, type: "OUTCOME" },
    ]);

    const summary = await getTransactionsSummary();

    expect(summary).toEqual({ income: 5400, outcome: 1450.5, total: 3949.5 });
  });

  it("treats a null sum as zero", async () => {
    groupBy.mockResolvedValue([{ _sum: { amount: null }, type: "INCOME" }]);

    const summary = await getTransactionsSummary();

    expect(summary).toEqual({ income: 0, outcome: 0, total: 0 });
  });

  it("returns zeroed totals when there are no transactions", async () => {
    groupBy.mockResolvedValue([]);

    await expect(getTransactionsSummary()).resolves.toEqual({
      income: 0,
      outcome: 0,
      total: 0,
    });
  });
});
