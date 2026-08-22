import { ReceiptXIcon } from "@phosphor-icons/react/dist/ssr";

export function TransactionsEmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-border border-dashed px-6 py-16 text-center">
      <ReceiptXIcon
        aria-hidden="true"
        className="size-8 text-muted-foreground"
      />
      <h3 className="font-medium text-base">No transactions yet</h3>
      <p className="max-w-sm text-muted-foreground text-sm">
        Add your first income or outcome to start tracking your balance.
      </p>
    </div>
  );
}
