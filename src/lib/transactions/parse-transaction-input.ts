import type { TransactionType } from "./transaction-types";

export type ParsedTransactionInput = {
  title: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
};

const MAX_TITLE_LENGTH = 80;
const MAX_AMOUNT = 1_000_000_000;
const CENTS_PER_UNIT = 100;

function parseTitle(value: FormDataEntryValue | null): string {
  const title = typeof value === "string" ? value.trim() : "";
  if (title.length === 0) {
    throw new Error("Title is required");
  }
  if (title.length > MAX_TITLE_LENGTH) {
    throw new Error(`Title must be at most ${MAX_TITLE_LENGTH} characters`);
  }
  return title;
}

function parseAmount(value: FormDataEntryValue | null): number {
  const amount = Number(typeof value === "string" ? value.trim() : Number.NaN);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Amount must be a positive number");
  }
  if (amount >= MAX_AMOUNT) {
    throw new Error("Amount is too large");
  }
  return Math.round(amount * CENTS_PER_UNIT) / CENTS_PER_UNIT;
}

function parseType(value: FormDataEntryValue | null): TransactionType {
  if (value === "INCOME" || value === "OUTCOME") {
    return value;
  }
  throw new Error("Type must be INCOME or OUTCOME");
}

function parseCategoryId(value: FormDataEntryValue | null): string {
  const categoryId = typeof value === "string" ? value.trim() : "";
  if (categoryId.length === 0) {
    throw new Error("Category is required");
  }
  return categoryId;
}

export function parseTransactionInput(
  formData: FormData
): ParsedTransactionInput {
  return {
    amount: parseAmount(formData.get("amount")),
    categoryId: parseCategoryId(formData.get("categoryId")),
    title: parseTitle(formData.get("title")),
    type: parseType(formData.get("type")),
  };
}
