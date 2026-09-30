import { defineConfig, devices } from "@playwright/test";
import {
  E2E_BASE_URL,
  E2E_PORT,
  readE2eDatabaseUrl,
} from "./e2e/support/config";

const WEB_SERVER_TIMEOUT_MS = 180_000;

export default defineConfig({
  forbidOnly: Boolean(process.env.CI),
  fullyParallel: false,
  globalSetup: "./e2e/global-setup.ts",
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  reporter: "list",
  testDir: "./e2e",
  testMatch: "**/*.spec.ts",
  use: { baseURL: E2E_BASE_URL, trace: "retain-on-failure" },
  webServer: {
    command: "pnpm build && pnpm start",
    env: { DATABASE_URL: readE2eDatabaseUrl(), PORT: String(E2E_PORT) },
    reuseExistingServer: false,
    timeout: WEB_SERVER_TIMEOUT_MS,
    url: `${E2E_BASE_URL}/favicon.ico`,
  },
  workers: 1,
});
