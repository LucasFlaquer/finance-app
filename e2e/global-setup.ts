import {
  ensureDatabase,
  migrateDatabase,
  reseedDatabase,
} from "./support/database";

export default async function globalSetup(): Promise<void> {
  await ensureDatabase();
  migrateDatabase();
  await reseedDatabase();
}
