import { describe, expect, it } from "vitest";
import { summarizeTransactions } from "./summarize-transactions";

describe("summarizeTransactions", () => {
  it("sums income and outcome into a balance", () => {
    const amountsByType = [
      { amount: 5400, type: "INCOME" as const },
      { amount: 1450, type: "OUTCOME" as const },
    ];

    const summary = summarizeTransactions(amountsByType);

    expect(summary).toEqual({ income: 5400, outcome: 1450, total: 3950 });
  });

  it("returns a negative total when outcome exceeds income", () => {
    const summary = summarizeTransactions([
      { amount: 100, type: "INCOME" },
      { amount: 250, type: "OUTCOME" },
    ]);

    expect(summary.total).toBe(-150);
  });

  it("returns zeroed totals for an empty list", () => {
    const summary = summarizeTransactions([]);

    expect(summary).toEqual({ income: 0, outcome: 0, total: 0 });
  });

  it("keeps cent precision when summing floating point amounts", () => {
    const summary = summarizeTransactions([
      { amount: 0.1, type: "INCOME" },
      { amount: 0.2, type: "INCOME" },
      { amount: 0.3, type: "OUTCOME" },
    ]);

    expect(summary).toEqual({ income: 0.3, outcome: 0.3, total: 0 });
  });

  it("aggregates repeated entries of the same type", () => {
    const summary = summarizeTransactions([
      { amount: 10.5, type: "OUTCOME" },
      { amount: 4.5, type: "OUTCOME" },
    ]);

    expect(summary.outcome).toBe(15);
  });
});
