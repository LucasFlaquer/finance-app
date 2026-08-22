"use client";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CategoryOption } from "@/lib/transactions/transaction-types";
import { TransactionCategorySelect } from "./transaction-category-select";
import { TransactionTypeSelect } from "./transaction-type-select";

export type NewTransactionFormProps = {
  categories: CategoryOption[];
  error: string | null;
  isPending: boolean;
  onCancel: () => void;
  onSubmit: (formData: FormData) => void;
};

export function NewTransactionForm({
  categories,
  error,
  isPending,
  onCancel,
  onSubmit,
}: NewTransactionFormProps) {
  return (
    <form action={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="transaction-title">Title</Label>
        <Input
          autoComplete="off"
          id="transaction-title"
          name="title"
          placeholder="Grocery shopping"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="transaction-amount">Amount</Label>
        <Input
          id="transaction-amount"
          inputMode="decimal"
          min="0.01"
          name="amount"
          placeholder="0.00"
          required
          step="0.01"
          type="number"
        />
      </div>
      <TransactionTypeSelect />
      <TransactionCategorySelect categories={categories} />
      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}
      <DialogFooter>
        <Button onClick={onCancel} type="button" variant="outline">
          Cancel
        </Button>
        <Button aria-busy={isPending} disabled={isPending} type="submit">
          {isPending ? "Saving..." : "Save transaction"}
        </Button>
      </DialogFooter>
    </form>
  );
}
