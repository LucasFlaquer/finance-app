import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { NewTransactionDialog } from "@/components/transactions/new-transaction-dialog";
import type { CategoryOption } from "@/lib/transactions/transaction-types";
import { AppNav, type AppPage } from "./app-nav";

export type AppHeaderProps = {
  categories: CategoryOption[];
  current: AppPage;
  children?: ReactNode;
};

export function AppHeader({ categories, current, children }: AppHeaderProps) {
  return (
    <header className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <AppNav current={current} />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <NewTransactionDialog categories={categories} />
        </div>
      </div>
      {children}
    </header>
  );
}
