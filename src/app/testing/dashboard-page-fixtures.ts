type Fixture = {
  amountCents: number;
  categoryId: string;
  createdAt: Date;
  type: "INCOME" | "OUTCOME";
};

export const NOW = new Date("2026-09-24T12:00:00Z");

export const CATEGORIES = [
  { id: "groceries", name: "Groceries" },
  { id: "salary", name: "Salary" },
];

const FIXTURES: Fixture[] = [
  {
    amountCents: 300_000,
    categoryId: "salary",
    createdAt: new Date("2026-08-05T10:00:00Z"),
    type: "INCOME",
  },
  {
    amountCents: 20_000,
    categoryId: "groceries",
    createdAt: new Date("2026-08-06T10:00:00Z"),
    type: "OUTCOME",
  },
  {
    amountCents: 500_000,
    categoryId: "salary",
    createdAt: new Date("2026-09-02T10:00:00Z"),
    type: "INCOME",
  },
  {
    amountCents: 12_050,
    categoryId: "groceries",
    createdAt: new Date("2026-09-03T10:00:00Z"),
    type: "OUTCOME",
  },
  {
    amountCents: 7950,
    categoryId: "groceries",
    createdAt: new Date("2026-09-04T10:00:00Z"),
    type: "OUTCOME",
  },
];

const CENTS_PER_UNIT = 100;

export type DateRange = { gte: Date; lt: Date };

function groupFixturesByCategoryAndType(range: DateRange) {
  const groups = new Map<string, Fixture[]>();
  for (const row of FIXTURES) {
    if (row.createdAt < range.gte || row.createdAt >= range.lt) {
      continue;
    }
    const key = `${row.categoryId}:${row.type}`;
    groups.set(key, [...(groups.get(key) ?? []), row]);
  }
  return [...groups.values()];
}

export function groupInRange(range: DateRange) {
  return groupFixturesByCategoryAndType(range).map((rows) => {
    const cents = rows.reduce((sum, row) => sum + row.amountCents, 0);
    return {
      _count: { _all: rows.length },
      _sum: { amount: { toString: () => (cents / CENTS_PER_UNIT).toFixed(2) } },
      categoryId: rows[0].categoryId,
      type: rows[0].type,
    };
  });
}
