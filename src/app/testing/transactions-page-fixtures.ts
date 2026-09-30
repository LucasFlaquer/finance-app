export const SALARY_ROW = {
  amount: { toString: () => "3000.00" },
  category: { name: "Salary" },
  createdAt: new Date("2026-08-05T19:20:00Z"),
  id: "transaction-1",
  title: "Monthly salary",
  type: "INCOME",
};

export const GROCERIES_ROW = {
  amount: { toString: () => "120.50" },
  category: { name: "Groceries" },
  createdAt: new Date("2026-08-06T19:20:00Z"),
  id: "transaction-2",
  title: "Weekly groceries",
  type: "OUTCOME",
};
