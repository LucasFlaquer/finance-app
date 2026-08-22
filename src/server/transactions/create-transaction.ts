"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import type { CreateTransactionState } from "@/lib/transactions/create-transaction-state";
import { parseTransactionInput } from "@/lib/transactions/parse-transaction-input";

export async function createTransaction(
  _previousState: CreateTransactionState,
  formData: FormData
): Promise<CreateTransactionState> {
  try {
    const input = parseTransactionInput(formData);
    await prisma.transaction.create({ data: input });
    revalidatePath("/");
    return { error: null, status: "success" };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to save",
      status: "error",
    };
  }
}
