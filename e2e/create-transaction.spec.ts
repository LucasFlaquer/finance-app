import { expect, test } from "@playwright/test";
import { reseedDatabase } from "./support/database";
import {
  breakdownRow,
  createOutcome,
  expectNoReload,
  markPageLoad,
  summaryCard,
} from "./support/page-helpers";

const NEW_OUTCOME = {
  amount: "50",
  category: "Groceries",
  title: "Coffee beans",
};

test.beforeEach(async () => {
  await reseedDatabase();
});

test.afterAll(async () => {
  await reseedDatabase();
});

test("updates the breakdown after creating an outcome on the dashboard", async ({
  page,
}) => {
  await page.goto("/");
  await markPageLoad(page);
  await expect(breakdownRow(page, "Groceries")).toContainText("2 transactions");

  await createOutcome(page, NEW_OUTCOME);

  const groceries = breakdownRow(page, "Groceries");
  await expect(groceries).toContainText("$650.00");
  await expect(groceries).toContainText("3 transactions");
  await expect(summaryCard(page, "Total outcome")).toContainText("$2,050.00");
  await expectNoReload(page);
});

test("shows the new transaction first in the history and updates the cards", async ({
  page,
}) => {
  await page.goto("/transactions");

  await createOutcome(page, NEW_OUTCOME);

  await expect(page.getByRole("row").nth(1)).toContainText(NEW_OUTCOME.title);
  await expect(summaryCard(page, "Total outcome")).toContainText("$3,250.00");
});
