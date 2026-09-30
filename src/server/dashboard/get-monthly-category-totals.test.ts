import { beforeEach, describe, expect, it, vi } from "vitest";

const groupBy = vi.fn();

vi.mock("@/lib/prisma", () => ({
  default: {
    transaction: { groupBy: (...args: unknown[]) => groupBy(...args) },
  },
}));

const { getMonthlyCategoryTotals } = await import(
  "./get-monthly-category-totals"
);

const RANGE = {
  end: new Date("2026-09-01T00:00:00.000Z"),
  start: new Date("2026-08-01T00:00:00.000Z"),
};

describe("getMonthlyCategoryTotals", () => {
  beforeEach(() => {
    groupBy.mockReset();
  });

  it("maps grouped rows to cents totals", async () => {
    groupBy.mockResolvedValue([
      {
        _count: { _all: 3 },
        _sum: { amount: "1450.55" },
        categoryId: "food",
        type: "OUTCOME",
      },
      {
        _count: { _all: 1 },
        _sum: { amount: "5400" },
        categoryId: "salary",
        type: "INCOME",
      },
    ]);

    const totals = await getMonthlyCategoryTotals(RANGE);

    expect(totals).toEqual([
      { amountCents: 145_055, categoryId: "food", count: 3, type: "OUTCOME" },
      { amountCents: 540_000, categoryId: "salary", count: 1, type: "INCOME" },
    ]);
  });

  it("queries one grouped read restricted to the half-open month range", async () => {
    groupBy.mockResolvedValue([]);

    await getMonthlyCategoryTotals(RANGE);

    expect(groupBy).toHaveBeenCalledTimes(1);
    expect(groupBy).toHaveBeenCalledWith({
      _count: { _all: true },
      _sum: { amount: true },
      by: ["categoryId", "type"],
      where: { createdAt: { gte: RANGE.start, lt: RANGE.end } },
    });
  });

  it("maps a null sum to zero cents", async () => {
    groupBy.mockResolvedValue([
      {
        _count: { _all: 0 },
        _sum: { amount: null },
        categoryId: "food",
        type: "OUTCOME",
      },
    ]);

    const totals = await getMonthlyCategoryTotals(RANGE);

    expect(totals).toEqual([
      { amountCents: 0, categoryId: "food", count: 0, type: "OUTCOME" },
    ]);
  });

  it("returns an empty list when the month has no transactions", async () => {
    groupBy.mockResolvedValue([]);

    await expect(getMonthlyCategoryTotals(RANGE)).resolves.toEqual([]);
  });
});
