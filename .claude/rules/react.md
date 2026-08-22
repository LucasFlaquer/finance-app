# React Rules

These rules take precedence over any conflicting guidance elsewhere. They apply to every `.tsx` file in this repo (Next.js 16 App Router + React 19 + Tailwind CSS v4).

## Prefer functional components

No class components. Function components only, typed props, no `React.FC`.

```tsx
// Bad
class TransactionRow extends React.Component<TransactionRowProps> {
  render() {
    return <tr>{this.props.transaction.description}</tr>;
  }
}

// Good
type TransactionRowProps = {
  transaction: Transaction;
};

function TransactionRow({ transaction }: TransactionRowProps) {
  return <tr>{transaction.description}</tr>;
}
```

React 19: pass `ref` as a normal prop, never `React.forwardRef`.

## Create small and reusable components

One component, one responsibility. If a component renders several unrelated visual blocks, split it. Combined with the 100-line file limit, this means most components live in their own file.

```tsx
// Bad — one component doing header + filters + list + empty state
function TransactionsPage({ transactions }: TransactionsPageProps) {
  return (
    <section>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-2xl">Transactions</h1>
        <button className="rounded-md bg-primary px-3 py-2" type="button">New</button>
      </div>
      <div className="flex gap-2">{/* ...filters... */}</div>
      {transactions.length === 0 ? (
        <p className="text-muted-foreground">No transactions yet</p>
      ) : (
        <ul>{/* ...rows... */}</ul>
      )}
    </section>
  );
}

// Good — composable pieces, each reusable and testable on its own
function TransactionsPage({ transactions }: TransactionsPageProps) {
  return (
    <section className="flex flex-col gap-4">
      <TransactionsHeader />
      <TransactionFilters />
      <TransactionList transactions={transactions} />
    </section>
  );
}
```

Reusable means: no knowledge of where it is rendered, no reaching into global state it does not own, props as the only input.

## Avoid spreading props

Never write `<Element {...props} />`. Spreading hides the component's real contract, leaks unintended attributes into the DOM, and makes renames invisible to TypeScript. List props explicitly.

```tsx
// Bad — what does Card actually accept? Nobody knows
function TransactionCard(props: TransactionCardProps) {
  return <Card {...props} />;
}

// Good — explicit contract
type TransactionCardProps = {
  title: string;
  amount: number;
  onSelect: () => void;
};

function TransactionCard({ title, amount, onSelect }: TransactionCardProps) {
  return (
    <Card onClick={onSelect} title={title}>
      <CurrencyAmount value={amount} />
    </Card>
  );
}
```

Exception: shadcn/ui primitives under `src/components/ui/` are generated wrappers around native elements and may keep their `...props` passthrough. Don't introduce the pattern in application code.

## Avoid unnecessary `useEffect`

`useEffect` is for synchronizing with something outside React (subscriptions, browser APIs, non-React widgets). It is not for deriving data, transforming props, or fetching in a Server Component tree.

```tsx
// Bad — derived state in an effect: extra render, stale window
function TransactionTotal({ transactions }: TransactionTotalProps) {
  const [total, setTotal] = useState(0);
  useEffect(() => {
    setTotal(transactions.reduce((sum, tx) => sum + tx.amount, 0));
  }, [transactions]);
  return <CurrencyAmount value={total} />;
}

// Good — compute during render
function TransactionTotal({ transactions }: TransactionTotalProps) {
  const total = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  return <CurrencyAmount value={total} />;
}
```

```tsx
// Bad — fetching in a Client Component effect
function AccountBalance({ accountId }: AccountBalanceProps) {
  const [balance, setBalance] = useState<number | null>(null);
  useEffect(() => {
    fetch(`/api/accounts/${accountId}`)
      .then((response) => response.json())
      .then((data) => setBalance(data.balance));
  }, [accountId]);
  return <CurrencyAmount value={balance ?? 0} />;
}

// Good — async Server Component, data fetched on the server
async function AccountBalance({ accountId }: AccountBalanceProps) {
  const account = await getAccountBalance(accountId);
  return <CurrencyAmount value={account.balance} />;
}
```

An effect is justified for: event listeners, `IntersectionObserver`, `localStorage` sync, timers, and third-party imperative libraries. Always return a cleanup function.

## Use `useMemo` for heavy calculations only

`useMemo` exists to skip expensive work across re-renders. Memoizing a string concat or a cheap comparison costs more than it saves.

```tsx
// Bad — memoizing trivial work
const label = useMemo(() => `${account.name} (${account.currency})`, [account]);

// Good — expensive aggregation over a large list
function MonthlyReport({ transactions }: MonthlyReportProps) {
  const monthlyTotals = useMemo(
    () => aggregateByMonth(transactions),
    [transactions]
  );
  return <BarChart data={monthlyTotals} />;
}
```

Also valid: stabilizing a reference passed to a memoized child or used in a dependency array.

```tsx
// Good — stable reference keeps the memoized chart from re-rendering
const chartOptions = useMemo(() => ({ currency, locale }), [currency, locale]);
return <MemoizedChart options={chartOptions} />;
```

## Split data-access responsibilities out of components

Components render. They do not build SQL, call `db` inline, or hold fetch URLs. Data access lives in server-side modules; the component consumes the returned data.

```tsx
// Bad — query logic embedded in the component
async function TransactionList({ accountId }: TransactionListProps) {
  const transactions = await db.transaction.findMany({
    where: { accountId, deletedAt: null },
    orderBy: { date: "desc" },
    take: 50,
  });
  return <ul>{transactions.map((tx) => <TransactionRow key={tx.id} transaction={tx} />)}</ul>;
}
```

```ts
// Good — src/server/transactions/list-transactions.ts
const RECENT_TRANSACTIONS_LIMIT = 50;

export async function listRecentTransactions(accountId: string): Promise<Transaction[]> {
  return db.transaction.findMany({
    where: { accountId, deletedAt: null },
    orderBy: { date: "desc" },
    take: RECENT_TRANSACTIONS_LIMIT,
  });
}
```

```tsx
// Good — src/components/transactions/transaction-list.tsx
async function TransactionList({ accountId }: TransactionListProps) {
  const transactions = await listRecentTransactions(accountId);
  return (
    <ul>
      {transactions.map((transaction) => (
        <TransactionRow key={transaction.id} transaction={transaction} />
      ))}
    </ul>
  );
}
```

The payoff: the query is unit-testable without rendering, and the component is testable without a database.

## Extract logic into `use`-prefixed hooks

Stateful logic that is not JSX belongs in a custom hook named `use*`, in its own file. The component keeps markup and wiring only.

```tsx
// Bad — form state, validation and submission tangled with markup
function TransactionForm() {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // ...30 more lines of handlers and validation...
  return <form>{/* ... */}</form>;
}
```

```ts
// Good — src/hooks/use-transaction-form.ts
export function useTransactionForm() {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submit = async () => {
    setIsSubmitting(true);
    try {
      await createTransaction({ amount: Number(amount) });
      setError(null);
    } catch (submitError) {
      setError((submitError as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return { amount, setAmount, error, isSubmitting, submit };
}
```

```tsx
// Good — src/components/transactions/transaction-form.tsx
function TransactionForm() {
  const { amount, setAmount, error, isSubmitting, submit } = useTransactionForm();
  return (
    <form onSubmit={submit}>
      <label className="text-sm" htmlFor="amount">Amount</label>
      <input
        aria-describedby={error ? "amount-error" : undefined}
        aria-invalid={Boolean(error)}
        id="amount"
        onChange={(event) => setAmount(event.target.value)}
        value={amount}
      />
      {error ? <p className="text-destructive text-sm" id="amount-error" role="alert">{error}</p> : null}
      <button disabled={isSubmitting} type="submit">Save</button>
    </form>
  );
}
```

Hooks are called at the top level only, never conditionally or inside loops.

## Always use accessibility attributes

Semantic elements first (`<button>`, `<nav>`, `<main>`, `<label>`); ARIA fills the gaps semantics cannot express. Every interactive element must be reachable and announceable.

```tsx
// Bad — no name, no semantics, no keyboard support
<div className="cursor-pointer" onClick={remove}>
  <TrashIcon />
</div>

// Good
<button
  aria-label="Delete transaction"
  className="rounded-md p-2 hover:bg-muted"
  onClick={remove}
  type="button"
>
  <TrashIcon aria-hidden="true" />
</button>
```

Checklist for every component:

- Icon-only controls get `aria-label`; decorative icons get `aria-hidden="true"`.
- Inputs get a `<label htmlFor>`; errors get `aria-invalid` + `aria-describedby` + `role="alert"`.
- Toggles get `aria-pressed` / `aria-expanded` and `aria-controls`.
- Async regions get `aria-busy` or `aria-live="polite"`.
- Images get meaningful `alt` (empty `alt=""` when decorative).
- Heading levels descend without skipping.
- Mouse handlers on non-native elements need keyboard equivalents — or use a `<button>`.

```tsx
// Good — live region announces the loaded balance
<output aria-busy={isLoading} aria-live="polite" className="font-medium tabular-nums">
  {isLoading ? "Loading balance" : formatCurrency(balance)}
</output>
```

## Style with Tailwind CSS

Tailwind v4 utility classes are the styling mechanism. No CSS Modules, no styled-components, no inline `style` objects for static styling.

```tsx
// Bad
<div style={{ display: "flex", gap: 8, padding: 16 }}>

// Good
<div className="flex gap-2 p-4">
```

- Compose conditional classes with the `cn` helper from `@/lib/utils`, never string concatenation.
- Use design tokens from `globals.css` (`bg-background`, `text-muted-foreground`, `border-border`) instead of raw hex or arbitrary values.
- `style` is acceptable only for genuinely dynamic values (a computed bar width, a CSS variable).

```tsx
// Good — conditional classes via cn, tokens over raw colors
<span
  className={cn(
    "rounded-full px-2 py-0.5 text-xs",
    isIncome ? "bg-emerald-500/10 text-emerald-600" : "bg-destructive/10 text-destructive"
  )}
>
  {label}
</span>
```

```tsx
// Good — dynamic value, not static styling
<div className="h-2 rounded bg-primary" style={{ width: `${percentage}%` }} />
```
