import "dotenv/config";

export const E2E_PORT = 3100;
export const E2E_BASE_URL = `http://localhost:${E2E_PORT}`;

const E2E_DATABASE_SUFFIX = "_e2e";

export function readE2eDatabaseUrl(): string {
  const url = process.env.E2E_DATABASE_URL;
  if (!url) {
    throw new Error("E2E_DATABASE_URL is not set");
  }
  const databaseName = new URL(url).pathname.slice(1);
  if (!databaseName.endsWith(E2E_DATABASE_SUFFIX)) {
    throw new Error(
      `E2E database name must end with "${E2E_DATABASE_SUFFIX}", got "${databaseName}"`
    );
  }
  return url;
}
