const SINGULAR_COUNT = 1;

export function formatTransactionCount(count: number): string {
  const noun = count === SINGULAR_COUNT ? "transaction" : "transactions";
  return `${count} ${noun}`;
}
