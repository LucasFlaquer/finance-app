export const DEFAULT_CATEGORIES = [
  "Salary",
  "Investments",
  "Housing",
  "Groceries",
  "Transport",
  "Health",
  "Education",
  "Entertainment",
  "Subscriptions",
  "Other",
] as const;

export type SeedTransaction = {
  title: string;
  amount: number;
  type: "INCOME" | "OUTCOME";
  categoryName: (typeof DEFAULT_CATEGORIES)[number];
  createdAt: string;
};

export const SEED_TRANSACTIONS: SeedTransaction[] = [
  {
    amount: 5400,
    categoryName: "Salary",
    createdAt: "2026-08-01T09:00:00Z",
    title: "August salary",
    type: "INCOME",
  },
  {
    amount: 820.5,
    categoryName: "Investments",
    createdAt: "2026-08-02T10:30:00Z",
    title: "Dividend payout",
    type: "INCOME",
  },
  {
    amount: 1450,
    categoryName: "Housing",
    createdAt: "2026-08-03T08:15:00Z",
    title: "Rent",
    type: "OUTCOME",
  },
  {
    amount: 132.4,
    categoryName: "Housing",
    createdAt: "2026-08-04T18:45:00Z",
    title: "Electricity bill",
    type: "OUTCOME",
  },
  {
    amount: 289.9,
    categoryName: "Groceries",
    createdAt: "2026-08-05T19:20:00Z",
    title: "Weekly groceries",
    type: "OUTCOME",
  },
  {
    amount: 64.3,
    categoryName: "Transport",
    createdAt: "2026-08-06T07:50:00Z",
    title: "Fuel",
    type: "OUTCOME",
  },
  {
    amount: 45,
    categoryName: "Subscriptions",
    createdAt: "2026-08-07T12:00:00Z",
    title: "Streaming plans",
    type: "OUTCOME",
  },
  {
    amount: 1200,
    categoryName: "Other",
    createdAt: "2026-08-08T14:10:00Z",
    title: "Freelance project",
    type: "INCOME",
  },
  {
    amount: 78.2,
    categoryName: "Health",
    createdAt: "2026-08-09T16:35:00Z",
    title: "Pharmacy",
    type: "OUTCOME",
  },
  {
    amount: 210,
    categoryName: "Education",
    createdAt: "2026-08-10T09:05:00Z",
    title: "Online course",
    type: "OUTCOME",
  },
  {
    amount: 96.75,
    categoryName: "Entertainment",
    createdAt: "2026-08-11T21:15:00Z",
    title: "Concert tickets",
    type: "OUTCOME",
  },
  {
    amount: 310.6,
    categoryName: "Groceries",
    createdAt: "2026-08-12T19:00:00Z",
    title: "Weekly groceries",
    type: "OUTCOME",
  },
  {
    amount: 150,
    categoryName: "Investments",
    createdAt: "2026-08-13T11:25:00Z",
    title: "Cashback rewards",
    type: "INCOME",
  },
  {
    amount: 58.9,
    categoryName: "Transport",
    createdAt: "2026-08-14T08:40:00Z",
    title: "Ride share",
    type: "OUTCOME",
  },
  {
    amount: 420,
    categoryName: "Health",
    createdAt: "2026-08-15T15:30:00Z",
    title: "Dentist appointment",
    type: "OUTCOME",
  },
  {
    amount: 275.15,
    categoryName: "Groceries",
    createdAt: "2026-08-16T18:05:00Z",
    title: "Weekly groceries",
    type: "OUTCOME",
  },
  {
    amount: 89.99,
    categoryName: "Subscriptions",
    createdAt: "2026-08-17T10:45:00Z",
    title: "Cloud storage",
    type: "OUTCOME",
  },
  {
    amount: 640,
    categoryName: "Other",
    createdAt: "2026-08-18T13:20:00Z",
    title: "Sold old laptop",
    type: "INCOME",
  },
  {
    amount: 132.8,
    categoryName: "Entertainment",
    createdAt: "2026-08-19T20:10:00Z",
    title: "Dinner out",
    type: "OUTCOME",
  },
  {
    amount: 199.99,
    categoryName: "Education",
    createdAt: "2026-08-20T09:55:00Z",
    title: "Technical books",
    type: "OUTCOME",
  },
  {
    amount: 74.5,
    categoryName: "Transport",
    createdAt: "2026-08-21T07:35:00Z",
    title: "Monthly transit pass",
    type: "OUTCOME",
  },
  {
    amount: 300,
    categoryName: "Investments",
    createdAt: "2026-08-22T11:00:00Z",
    title: "Interest income",
    type: "INCOME",
  },
];
