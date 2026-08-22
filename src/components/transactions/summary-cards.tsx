import {
  ArrowCircleDownIcon,
  ArrowCircleUpIcon,
  WalletIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { TransactionsSummary } from "@/lib/transactions/transaction-types";
import { SummaryCard } from "./summary-card";

export type SummaryCardsProps = {
  summary: TransactionsSummary;
};

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <SummaryCard
        icon={ArrowCircleUpIcon}
        label="Total income"
        tone="income"
        value={summary.income}
      />
      <SummaryCard
        icon={ArrowCircleDownIcon}
        label="Total outcome"
        tone="outcome"
        value={summary.outcome}
      />
      <SummaryCard
        icon={WalletIcon}
        label="Total balance"
        tone="neutral"
        value={summary.total}
      />
    </div>
  );
}
