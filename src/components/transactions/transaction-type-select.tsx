"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TYPE_ITEMS = [
  { label: "Outcome", value: "OUTCOME" },
  { label: "Income", value: "INCOME" },
];

export function TransactionTypeSelect() {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="transaction-type">Type</Label>
      <Select defaultValue="OUTCOME" items={TYPE_ITEMS} name="type" required>
        <SelectTrigger className="w-full" id="transaction-type">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {TYPE_ITEMS.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
