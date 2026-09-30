import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const THEMES = ["light", "dark"] as const;
const PAGES = ["/", "/transactions"] as const;

for (const colorScheme of THEMES) {
  for (const path of PAGES) {
    test(`has no accessibility violations on ${path} in the ${colorScheme} theme`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

      const results = await new AxeBuilder({ page }).analyze();

      expect(results.violations).toEqual([]);
    });
  }
}
