"use client";

import { PlusIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateTransactionForm } from "@/hooks/use-create-transaction-form";
import type { CategoryOption } from "@/lib/transactions/transaction-types";
import { NewTransactionForm } from "./new-transaction-form";

export type NewTransactionDialogProps = {
  categories: CategoryOption[];
};

export function NewTransactionDialog({
  categories,
}: NewTransactionDialogProps) {
  const { close, error, isOpen, isPending, openChange, submit } =
    useCreateTransactionForm();
  return (
    <Dialog onOpenChange={openChange} open={isOpen}>
      <DialogTrigger render={<Button type="button" />}>
        <PlusIcon aria-hidden="true" weight="bold" />
        New transaction
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New transaction</DialogTitle>
          <DialogDescription>
            Record an income or an outcome to keep your balance up to date.
          </DialogDescription>
        </DialogHeader>
        <NewTransactionForm
          categories={categories}
          error={error}
          isPending={isPending}
          onCancel={close}
          onSubmit={submit}
        />
      </DialogContent>
    </Dialog>
  );
}
