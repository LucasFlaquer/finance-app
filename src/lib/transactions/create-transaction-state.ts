export type CreateTransactionState = {
  error: string | null;
  status: "idle" | "success" | "error";
};

export const INITIAL_CREATE_TRANSACTION_STATE: CreateTransactionState = {
  error: null,
  status: "idle",
};
