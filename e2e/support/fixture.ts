import type { SeedTransaction } from "../../prisma/seed-data";
import type { YearMonth } from "../../src/lib/months/year-month";
import { fixtureMonths } from "./fixture-months";

export type FixtureTransaction = Omit<SeedTransaction, "createdAt"> & {
  createdAt: Date;
};

type FixtureRow = [
  SeedTransaction["type"],
  SeedTransaction["categoryName"],
  number,
];

const FIRST_MINUTE_OF_MONTH = 1;

const CURRENT_MONTH_ROWS: FixtureRow[] = [
  ["OUTCOME", "Housing", 1000],
  ["OUTCOME", "Groceries", 350],
  ["OUTCOME", "Groceries", 250],
  ["OUTCOME", "Transport", 400],
  ["INCOME", "Salary", 3000],
];

const PREVIOUS_MONTH_ROWS: FixtureRow[] = [
  ["OUTCOME", "Housing", 800],
  ["OUTCOME", "Groceries", 300],
  ["OUTCOME", "Health", 100],
  ["INCOME", "Salary", 2500],
];

const TWO_MONTHS_BACK_ROWS: FixtureRow[] = [["INCOME", "Salary", 2000]];

function startOfMonth({ year, month }: YearMonth): Date {
  return new Date(Date.UTC(year, month - 1, 1, 0, FIRST_MINUTE_OF_MONTH));
}

function entriesFor(month: YearMonth, rows: FixtureRow[]) {
  return rows.map(
    ([type, categoryName, amount]): FixtureTransaction => ({
      amount,
      categoryName,
      createdAt: startOfMonth(month),
      title: `${type} ${categoryName} ${amount}`,
      type,
    })
  );
}

export function buildFixtureTransactions(now: Date = new Date()) {
  const months = fixtureMonths(now);
  return [
    ...entriesFor(months.current.value, CURRENT_MONTH_ROWS),
    ...entriesFor(months.previous.value, PREVIOUS_MONTH_ROWS),
    ...entriesFor(months.twoBack.value, TWO_MONTHS_BACK_ROWS),
  ];
}
