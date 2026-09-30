import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const createTransaction = vi.fn();

vi.mock("@/server/transactions/create-transaction", () => ({
  createTransaction: (...args: unknown[]) => createTransaction(...args),
}));

const { useCreateTransactionForm } = await import(
  "./use-create-transaction-form"
);

function buildFormData(): FormData {
  const formData = new FormData();
  formData.set("title", "Rent");
  return formData;
}

describe("useCreateTransactionForm", () => {
  beforeEach(() => {
    createTransaction.mockReset();
  });

  it("starts closed with no error", () => {
    const { result } = renderHook(() => useCreateTransactionForm());

    expect(result.current.isOpen).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("opens the dialog", () => {
    const { result } = renderHook(() => useCreateTransactionForm());

    act(() => result.current.openChange(true));

    expect(result.current.isOpen).toBe(true);
  });

  it("closes the dialog after a successful submission", async () => {
    createTransaction.mockResolvedValue({ error: null, status: "success" });
    const { result } = renderHook(() => useCreateTransactionForm());
    act(() => result.current.openChange(true));

    act(() => result.current.submit(buildFormData()));

    await waitFor(() => expect(result.current.isOpen).toBe(false));
  });

  it("keeps the dialog open and exposes the error when submission fails", async () => {
    createTransaction.mockResolvedValue({
      error: "Amount must be a positive number",
      status: "error",
    });
    const { result } = renderHook(() => useCreateTransactionForm());
    act(() => result.current.openChange(true));

    act(() => result.current.submit(buildFormData()));

    await waitFor(() =>
      expect(result.current.error).toBe("Amount must be a positive number")
    );
    expect(result.current.isOpen).toBe(true);
  });

  it("clears a previous error when the dialog is closed", async () => {
    createTransaction.mockResolvedValue({
      error: "Title is required",
      status: "error",
    });
    const { result } = renderHook(() => useCreateTransactionForm());
    act(() => result.current.openChange(true));
    act(() => result.current.submit(buildFormData()));
    await waitFor(() => expect(result.current.error).toBe("Title is required"));

    act(() => result.current.openChange(false));

    expect(result.current.error).toBeNull();
  });

  it("closes the dialog through close", () => {
    const { result } = renderHook(() => useCreateTransactionForm());
    act(() => result.current.openChange(true));

    act(() => result.current.close());

    expect(result.current.isOpen).toBe(false);
  });
});
