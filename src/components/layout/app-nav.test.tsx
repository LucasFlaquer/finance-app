import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AppNav } from "./app-nav";

describe("AppNav", () => {
  it("links to the dashboard and transactions pages", () => {
    render(<AppNav current="dashboard" />);

    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
      "href",
      "/"
    );
    expect(screen.getByRole("link", { name: "Transactions" })).toHaveAttribute(
      "href",
      "/transactions"
    );
  });

  it("exposes a main navigation landmark", () => {
    render(<AppNav current="dashboard" />);

    expect(
      screen.getByRole("navigation", { name: "Main" })
    ).toBeInTheDocument();
  });

  it("marks the dashboard as the current page", () => {
    render(<AppNav current="dashboard" />);

    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(
      screen.getByRole("link", { name: "Transactions" })
    ).not.toHaveAttribute("aria-current");
  });

  it("marks transactions as the current page", () => {
    render(<AppNav current="transactions" />);

    expect(screen.getByRole("link", { name: "Transactions" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(screen.getByRole("link", { name: "Dashboard" })).not.toHaveAttribute(
      "aria-current"
    );
  });

  it("underlines the current page so the state does not rely on the low-contrast background", () => {
    render(<AppNav current="transactions" />);

    expect(screen.getByRole("link", { name: "Transactions" })).toHaveClass(
      "underline"
    );
    expect(screen.getByRole("link", { name: "Dashboard" })).not.toHaveClass(
      "underline"
    );
  });
});
