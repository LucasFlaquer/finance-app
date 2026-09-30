import type { Metadata } from "next";
import { AppHeader } from "@/components/layout/app-header";
import { SummaryCards } from "@/components/transactions/summary-cards";
import { TransactionsTable } from "@/components/transactions/transactions-table";
import { listCategories } from "@/server/categories/list-categories";
import { getTransactionsSummary } from "@/server/transactions/get-transactions-summary";
import { listTransactions } from "@/server/transactions/list-transactions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Transactions",
};

export default async function TransactionsPage() {
  const [transactions, summary, categories] = await Promise.all([
    listTransactions(),
    getTransactionsSummary(),
    listCategories(),
  ]);
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-10">
      <AppHeader categories={categories} current="transactions" />
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-2xl tracking-tight">Transactions</h1>
        <p className="text-muted-foreground text-sm">
          Track your income and outcome in one place.
        </p>
      </div>
      <SummaryCards summary={summary} />
      <section className="flex flex-col gap-4">
        <h2 className="font-medium text-lg tracking-tight">History</h2>
        <TransactionsTable transactions={transactions} />
      </section>
    </main>
  );
}
