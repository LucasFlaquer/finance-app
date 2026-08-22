"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CategoryOption } from "@/lib/transactions/transaction-types";

export type TransactionCategorySelectProps = {
  categories: CategoryOption[];
};

export function TransactionCategorySelect({
  categories,
}: TransactionCategorySelectProps) {
  const items = categories.map((category) => ({
    label: category.name,
    value: category.id,
  }));
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="transaction-category">Category</Label>
      <Select items={items} name="categoryId" required>
        <SelectTrigger className="w-full" id="transaction-category">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
