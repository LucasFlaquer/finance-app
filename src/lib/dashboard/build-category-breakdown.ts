import { fromCents } from "../money/cents";
import type {
  CategoryOption,
  TransactionType,
} from "../transactions/transaction-types";
import { categoryColor } from "./category-colors";
import type {
  CategoryBreakdown,
  CategoryBreakdownRow,
  CategoryTypeTotal,
} from "./dashboard-types";
import {
  type CategorySum,
  EMPTY_SUM,
  sumTotalsByCategory,
} from "./sum-totals-by-category";

const PERCENTAGE_SCALE = 1000;
const PERCENTAGE_DIVISOR = 10;

export type BuildCategoryBreakdownParams = {
  categories: CategoryOption[];
  totals: CategoryTypeTotal[];
  type: TransactionType;
};

type CentsRow = CategorySum & {
  categoryId: string;
  color: string;
  name: string;
};

function percentageOf(amountCents: number, totalCents: number): number {
  if (totalCents === 0) {
    return 0;
  }
  return (
    Math.round((amountCents * PERCENTAGE_SCALE) / totalCents) /
    PERCENTAGE_DIVISOR
  );
}

function compareRows(a: CentsRow, b: CentsRow): number {
  if ((a.amountCents === 0) !== (b.amountCents === 0)) {
    return a.amountCents === 0 ? 1 : -1;
  }
  if (a.amountCents !== b.amountCents) {
    return b.amountCents - a.amountCents;
  }
  return a.name.localeCompare(b.name);
}

function toBreakdownRow(
  row: CentsRow,
  totalCents: number
): CategoryBreakdownRow {
  return {
    amount: fromCents(row.amountCents),
    categoryId: row.categoryId,
    color: row.color,
    count: row.count,
    name: row.name,
    percentage: percentageOf(row.amountCents, totalCents),
  };
}

export function buildCategoryBreakdown({
  categories,
  totals,
  type,
}: BuildCategoryBreakdownParams): CategoryBreakdown {
  const sums = sumTotalsByCategory(totals, type);
  const centsRows = categories.map(
    (category, index): CentsRow => ({
      ...(sums.get(category.id) ?? EMPTY_SUM),
      categoryId: category.id,
      color: categoryColor(index),
      name: category.name,
    })
  );
  const totalCents = centsRows.reduce((sum, row) => sum + row.amountCents, 0);
  const rows = centsRows
    .sort(compareRows)
    .map((row) => toBreakdownRow(row, totalCents));
  return { rows, total: fromCents(totalCents), type };
}
