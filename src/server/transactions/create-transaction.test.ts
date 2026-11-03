import { beforeEach, describe, expect, it, vi } from "vitest";
import { buildFormData } from "./create-transaction-form-data";

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

  it("revalidates the root layout after a successful write", async () => {
    await createTransaction(INITIAL_CREATE_TRANSACTION_STATE, buildFormData());

    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
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
