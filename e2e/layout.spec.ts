import { expect, test } from "@playwright/test";
import { fixtureMonths } from "./support/fixture-months";
import { BREAKDOWN_LIST_NAME } from "./support/page-helpers";

const DESKTOP_VIEWPORT = { height: 800, width: 1280 };
const MOBILE_VIEWPORT = { height: 740, width: 360 };
const PAGES = ["/", "/transactions"] as const;
const months = fixtureMonths();

test("keeps the dashboard key content above the fold at 1280x800", async ({
  page,
}) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);

  await page.goto("/");

  const visibleParts = [
    page.getByText(months.current.label, { exact: true }),
    page.getByRole("button", { name: "Outcome", pressed: true }),
    page.locator("figure"),
    page
      .getByRole("list", { name: BREAKDOWN_LIST_NAME })
      .getByRole("listitem")
      .first(),
  ];
  await Promise.all(
    visibleParts.map((part) => expect(part).toBeInViewport({ ratio: 1 }))
  );
});

for (const path of PAGES) {
  test(`does not scroll horizontally on ${path} at 360px`, async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);

    await page.goto(path);

    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}
