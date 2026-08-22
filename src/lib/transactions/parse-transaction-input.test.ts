import { describe, expect, it } from "vitest";
import { parseTransactionInput } from "./parse-transaction-input";

type FormFields = Record<string, string>;

function buildFormData(overrides: FormFields = {}): FormData {
  const fields: FormFields = {
    amount: "120.50",
    categoryId: "category-1",
    title: "Grocery shopping",
    type: "OUTCOME",
    ...overrides,
  };
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    formData.set(key, value);
  }
  return formData;
}

describe("parseTransactionInput", () => {
  it("parses a valid transaction form", () => {
    const input = parseTransactionInput(buildFormData());

    expect(input).toEqual({
      amount: 120.5,
      categoryId: "category-1",
      title: "Grocery shopping",
      type: "OUTCOME",
    });
  });

  it("trims surrounding whitespace from the title", () => {
    const input = parseTransactionInput(buildFormData({ title: "  Rent  " }));

    expect(input.title).toBe("Rent");
  });

  it("rounds the amount to two decimals", () => {
    const input = parseTransactionInput(buildFormData({ amount: "10.005" }));

    expect(input.amount).toBe(10.01);
  });

  it("accepts the smallest positive amount", () => {
    const input = parseTransactionInput(buildFormData({ amount: "0.01" }));

    expect(input.amount).toBe(0.01);
  });

  it("rejects an empty title", () => {
    expect(() =>
      parseTransactionInput(buildFormData({ title: "   " }))
    ).toThrowError("Title is required");
  });

  it("rejects a title longer than 80 characters", () => {
    const longTitle = "a".repeat(81);

    expect(() =>
      parseTransactionInput(buildFormData({ title: longTitle }))
    ).toThrowError("Title must be at most 80 characters");
  });

  it("rejects a zero amount", () => {
    expect(() =>
      parseTransactionInput(buildFormData({ amount: "0" }))
    ).toThrowError("Amount must be a positive number");
  });

  it("rejects a negative amount", () => {
    expect(() =>
      parseTransactionInput(buildFormData({ amount: "-5" }))
    ).toThrowError("Amount must be a positive number");
  });

  it("rejects a non-numeric amount", () => {
    expect(() =>
      parseTransactionInput(buildFormData({ amount: "abc" }))
    ).toThrowError("Amount must be a positive number");
  });

  it("rejects an amount at or above one billion", () => {
    expect(() =>
      parseTransactionInput(buildFormData({ amount: "1000000000" }))
    ).toThrowError("Amount is too large");
  });

  it("rejects an unknown transaction type", () => {
    expect(() =>
      parseTransactionInput(buildFormData({ type: "TRANSFER" }))
    ).toThrowError("Type must be INCOME or OUTCOME");
  });

  it("rejects a missing category", () => {
    expect(() =>
      parseTransactionInput(buildFormData({ categoryId: "" }))
    ).toThrowError("Category is required");
  });
});
