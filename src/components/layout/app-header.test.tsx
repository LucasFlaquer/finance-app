import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/server/transactions/create-transaction", () => ({
  createTransaction: vi.fn(),
}));

const { AppHeader } = await import("./app-header");

const SWITCH_THEME_PATTERN = /switch .*theme/i;
const CATEGORIES = [{ id: "category-1", name: "Groceries" }];

describe("AppHeader", () => {
  it("renders the navigation links", () => {
    render(<AppHeader categories={CATEGORIES} current="dashboard" />);

    expect(screen.getByRole("link", { name: "Dashboard" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Transactions" })
    ).toBeInTheDocument();
  });

  it("renders the theme toggle", () => {
    render(<AppHeader categories={CATEGORIES} current="dashboard" />);

    expect(
      screen.getByRole("button", { name: SWITCH_THEME_PATTERN })
    ).toBeInTheDocument();
  });

  it("renders the new transaction button", () => {
    render(<AppHeader categories={CATEGORIES} current="dashboard" />);

    expect(
      screen.getByRole("button", { name: "New transaction" })
    ).toBeInTheDocument();
  });

  it("renders the page specific slot", () => {
    render(
      <AppHeader categories={CATEGORIES} current="dashboard">
        <p>Slot content</p>
      </AppHeader>
    );

    expect(screen.getByText("Slot content")).toBeInTheDocument();
  });

  it("does not render a page heading", () => {
    render(<AppHeader categories={CATEGORIES} current="transactions" />);

    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
  });
});
