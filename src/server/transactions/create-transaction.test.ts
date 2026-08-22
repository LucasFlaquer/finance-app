import { beforeEach, describe, expect, it, vi } from "vitest";

const create = vi.fn();
const revalidatePath = vi.fn();

vi.mock("@/lib/prisma", () => ({
  default: { transaction: { create: (...args: unknown[]) => create(...args) } },
}));

vi.mock("next/cache", () => ({
  revalidatePath: (...args: unknown[]) => revalidatePath(...args),
}));

const { INITIAL_CREATE_TRANSACTION_STATE } = await import(
  "@/lib/transactions/create-transaction-state"
);
const { createTransaction } = await import("./create-transaction");

function buildFormData(overrides: Record<string, string> = {}): FormData {
  const fields = {
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

describe("createTransaction", () => {
  beforeEach(() => {
    create.mockReset();
    revalidatePath.mockReset();
    create.mockResolvedValue({ id: "transaction-1" });
  });

  it("persists a valid transaction and reports success", async () => {
    const state = await createTransaction(
      INITIAL_CREATE_TRANSACTION_STATE,
      buildFormData()
    );

    expect(state).toEqual({ error: null, status: "success" });
  });

  it("writes the parsed input to the database", async () => {
    await createTransaction(INITIAL_CREATE_TRANSACTION_STATE, buildFormData());

    expect(create).toHaveBeenCalledWith({
      data: {
        amount: 120.5,
        categoryId: "category-1",
        title: "Grocery shopping",
        type: "OUTCOME",
      },
    });
  });

  it("revalidates the index page after a successful write", async () => {
    await createTransaction(INITIAL_CREATE_TRANSACTION_STATE, buildFormData());

    expect(revalidatePath).toHaveBeenCalledWith("/");
  });

  it("returns a validation error without touching the database", async () => {
    const state = await createTransaction(
      INITIAL_CREATE_TRANSACTION_STATE,
      buildFormData({ amount: "-1" })
    );

    expect(state).toEqual({
      error: "Amount must be a positive number",
      status: "error",
    });
    expect(create).not.toHaveBeenCalled();
  });

  it("returns the database error message when the write fails", async () => {
    create.mockRejectedValue(new Error("Foreign key constraint failed"));

    const state = await createTransaction(
      INITIAL_CREATE_TRANSACTION_STATE,
      buildFormData()
    );

    expect(state).toEqual({
      error: "Foreign key constraint failed",
      status: "error",
    });
  });

  it("does not revalidate when the write fails", async () => {
    create.mockRejectedValue(new Error("connection lost"));

    await createTransaction(INITIAL_CREATE_TRANSACTION_STATE, buildFormData());

    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
