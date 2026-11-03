import { expect, test } from "@playwright/test";
import { fixtureMonths } from "./support/fixture-months";
import { summaryCard } from "./support/page-helpers";

const months = fixtureMonths();
const THEME_TOGGLE_NAME = /Switch/;
const INVALID_MONTH_PARAMS = ["abc", "2026-13", "2026-00", months.next.param];

test("shows the header on both pages and highlights the current link", async ({
  page,
}) => {
  await page.goto("/");
  const dashboardLink = page.getByRole("link", { name: "Dashboard" });
  await expect(dashboardLink).toHaveAttribute("aria-current", "page");
  await expect(
    page.getByRole("button", { name: THEME_TOGGLE_NAME })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "New transaction" })
  ).toBeVisible();

  await page.getByRole("link", { name: "Transactions" }).click();

  await expect(page).toHaveURL("/transactions");
  await expect(
    page.getByRole("link", { name: "Transactions" })
  ).toHaveAttribute("aria-current", "page");
  await expect(
    page.getByRole("button", { name: "New transaction" })
  ).toBeVisible();
});

test("opens the dashboard on the current month with Outcome selected", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByText(months.current.label, { exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Outcome", pressed: true })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: `Go to ${months.next.label}` })
  ).toBeDisabled();
});

test("navigates between months, keeps the month on reload and returns", async ({
  page,
}) => {
  await page.goto("/");

  await page
    .getByRole("link", { name: `Go to ${months.previous.label}` })
    .click();

  await expect(page).toHaveURL(`/?month=${months.previous.param}`);
  await expect(summaryCard(page, "Total outcome")).toContainText("$1,200.00");
  await expect(summaryCard(page, "Total income")).toContainText("$2,500.00");
  await page.reload();
  await expect(
    page.getByText(months.previous.label, { exact: true })
  ).toBeVisible();
  await page
    .getByRole("link", { name: `Go to ${months.current.label}` })
    .click();
  await expect(page).toHaveURL(`/?month=${months.current.param}`);
  await expect(summaryCard(page, "Total outcome")).toContainText("$2,000.00");
});

for (const param of INVALID_MONTH_PARAMS) {
  test(`redirects the month param "${param}" to the current month`, async ({
    page,
  }) => {
    await page.goto(`/?month=${param}`);

    await expect(page).toHaveURL(`/?month=${months.current.param}`);
    await expect(
      page.getByText(months.current.label, { exact: true })
    ).toBeVisible();
  });
}
