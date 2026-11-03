import { expect, type Locator, type Page } from "@playwright/test";

const NO_RELOAD_MARK = "e2e-no-reload";

export const BREAKDOWN_LIST_NAME = /by category/;

export type NewTransactionInput = {
  amount: string;
  category: string;
  title: string;
};

export function summaryCard(page: Page, label: string): Locator {
  return page.locator('[data-slot="card"]').filter({ hasText: label });
}

export function breakdownRow(page: Page, categoryName: string): Locator {
  return page
    .getByRole("list", { name: BREAKDOWN_LIST_NAME })
    .getByRole("listitem")
    .filter({ hasText: categoryName });
}

export async function markPageLoad(page: Page): Promise<void> {
  await page.evaluate((mark) => performance.mark(mark), NO_RELOAD_MARK);
}

export async function expectNoReload(page: Page): Promise<void> {
  const marks = await page.evaluate(
    (mark) => performance.getEntriesByName(mark).length,
    NO_RELOAD_MARK
  );
  expect(marks).toBe(1);
}

export async function createOutcome(
  page: Page,
  { amount, category, title }: NewTransactionInput
): Promise<void> {
  await page.getByRole("button", { name: "New transaction" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Title").fill(title);
  await dialog.getByLabel("Amount").fill(amount);
  await dialog.getByRole("combobox", { name: "Category" }).click();
  await page.getByRole("option", { name: category }).click();
  await dialog.getByRole("button", { name: "Save transaction" }).click();
  await expect(dialog).toBeHidden();
}
