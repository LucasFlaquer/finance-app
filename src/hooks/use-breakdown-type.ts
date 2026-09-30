import { useState } from "react";
import type { TransactionType } from "@/lib/transactions/transaction-types";

const DEFAULT_BREAKDOWN_TYPE: TransactionType = "OUTCOME";

export function useBreakdownType() {
  const [type, setType] = useState<TransactionType>(DEFAULT_BREAKDOWN_TYPE);
  return { setType, type };
}
