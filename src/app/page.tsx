import { SummaryCards } from "@/components/transactions/summary-cards";
import { TransactionsHeader } from "@/components/transactions/transactions-header";
import { TransactionsTable } from "@/components/transactions/transactions-table";
import { listCategories } from "@/server/categories/list-categories";
import { getTransactionsSummary } from "@/server/transactions/get-transactions-summary";
import { listTransactions } from "@/server/transactions/list-transactions";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [transactions, summary, categories] = await Promise.all([
    listTransactions(),
    getTransactionsSummary(),
    listCategories(),
  ]);
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-10">
      <TransactionsHeader categories={categories} />
      <SummaryCards summary={summary} />
      <section className="flex flex-col gap-4">
        <h2 className="font-medium text-lg tracking-tight">History</h2>
        <TransactionsTable transactions={transactions} />
      </section>
    </main>
  );
}
