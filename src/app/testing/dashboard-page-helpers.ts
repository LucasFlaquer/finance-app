import { screen, within } from "@testing-library/react";
import type { Mock } from "vitest";
import Home from "../page";
import {
  CATEGORIES,
  type DateRange,
  groupInRange,
} from "./dashboard-page-fixtures";

const SUMMARY_CARD_SELECTOR = '[data-slot="card"]';

export function renderHome(month?: string | string[]) {
  return Home({ searchParams: Promise.resolve({ month }) });
}

export function getSummaryCard(label: string) {
  const card = screen.getByText(label).closest(SUMMARY_CARD_SELECTOR);
  if (!card) {
    throw new Error(`Card not found: ${label}`);
  }
  return within(card as HTMLElement);
}

const REDIRECT_SIGNAL = "NEXT_REDIRECT";

export { REDIRECT_SIGNAL };

type ResetDashboardMocksParams = {
  categoryFindMany: Mock;
  redirect: Mock;
  transactionGroupBy: Mock;
};

export function resetDashboardMocks({
  categoryFindMany,
  redirect,
  transactionGroupBy,
}: ResetDashboardMocksParams) {
  redirect.mockReset();
  redirect.mockImplementation(() => {
    throw new Error(REDIRECT_SIGNAL);
  });
  categoryFindMany.mockReset();
  categoryFindMany.mockResolvedValue(CATEGORIES);
  transactionGroupBy.mockReset();
  transactionGroupBy.mockImplementation(
    async ({ where }: { where: { createdAt: DateRange } }) =>
      groupInRange(where.createdAt)
  );
}
