import { expect, test } from "@playwright/test";
import { fixtureMonths } from "./support/fixture-months";
import { breakdownRow } from "./support/page-helpers";

const months = fixtureMonths();

test("shows income categories after switching to Income", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Income" }).click();

  await expect(breakdownRow(page, "Salary")).toContainText("$3,000.00");
  await expect(breakdownRow(page, "Salary")).toContainText("100.0%");
  await expect(breakdownRow(page, "Groceries")).toContainText("0.0%");
});

test("announces the slice details when a slice receives keyboard focus", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Income" }).focus();

  await page.keyboard.press("Tab");

  await expect(page.getByRole("status")).toHaveText(
    "Housing: $1,000.00, 50.0%"
  );
});

test("shows the empty state and zeroed list for a month without outcome", async ({
  page,
}) => {
  await page.goto(`/?month=${months.twoBack.param}`);

  await expect(
    page.getByText(`No outcome recorded in ${months.twoBack.label}`)
  ).toBeVisible();
  await expect(breakdownRow(page, "Housing")).toContainText("$0.00");
  await expect(breakdownRow(page, "Housing")).toContainText("0.0%");
});
