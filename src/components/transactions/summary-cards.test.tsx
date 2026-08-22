import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SummaryCards } from "./summary-cards";

const SUMMARY = { income: 5400, outcome: 1450.5, total: 3949.5 };

describe("SummaryCards", () => {
  it("renders the total income", () => {
    render(<SummaryCards summary={SUMMARY} />);

    expect(screen.getByText("Total income")).toBeInTheDocument();
    expect(screen.getByText("$5,400.00")).toBeInTheDocument();
  });

  it("renders the total outcome", () => {
    render(<SummaryCards summary={SUMMARY} />);

    expect(screen.getByText("Total outcome")).toBeInTheDocument();
    expect(screen.getByText("$1,450.50")).toBeInTheDocument();
  });

  it("renders the total balance", () => {
    render(<SummaryCards summary={SUMMARY} />);

    expect(screen.getByText("Total balance")).toBeInTheDocument();
    expect(screen.getByText("$3,949.50")).toBeInTheDocument();
  });

  it("renders a negative balance", () => {
    render(
      <SummaryCards summary={{ income: 100, outcome: 250, total: -150 }} />
    );

    expect(screen.getByText("-$150.00")).toBeInTheDocument();
  });

  it("renders zeroed cards when there is no data", () => {
    render(<SummaryCards summary={{ income: 0, outcome: 0, total: 0 }} />);

    expect(screen.getAllByText("$0.00")).toHaveLength(3);
  });
});
