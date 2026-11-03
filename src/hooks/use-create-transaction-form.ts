"use client";

import { useState, useTransition } from "react";
import { INITIAL_CREATE_TRANSACTION_STATE } from "@/lib/transactions/create-transaction-state";
import { createTransaction } from "@/server/transactions/create-transaction";

export function useCreateTransactionForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState(INITIAL_CREATE_TRANSACTION_STATE);
  const [isPending, startTransition] = useTransition();
  const openChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setState(INITIAL_CREATE_TRANSACTION_STATE);
    }
  };
  const close = () => openChange(false);
  const submit = (formData: FormData) => {
    startTransition(async () => {
      const result = await createTransaction(state, formData);
      setState(result);
      if (result.status === "success") {
        setIsOpen(false);
      }
    });
  };
  return {
    close,
    error: state.error,
    isOpen,
    isPending,
    openChange,
    submit,
  };
}
