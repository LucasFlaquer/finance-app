import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { NewTransactionForm } from "./new-transaction-form";

const CATEGORIES = [
  { id: "category-1", name: "Groceries" },
  { id: "category-2", name: "Salary" },
];

function renderForm(
  overrides: Partial<
    Omit<Parameters<typeof NewTransactionForm>[0], "onCancel" | "onSubmit">
  > = {}
) {
  const onSubmit = vi.fn();
  const onCancel = vi.fn();
  render(
    <NewTransactionForm
      categories={overrides.categories ?? CATEGORIES}
      error={overrides.error ?? null}
      isPending={overrides.isPending ?? false}
      onCancel={onCancel}
      onSubmit={onSubmit}
    />
  );
  return { onCancel, onSubmit };
}

describe("NewTransactionForm", () => {
  it("submits the filled fields as form data", async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderForm();

    await user.type(screen.getByLabelText("Title"), "Weekly groceries");
    await user.type(screen.getByLabelText("Amount"), "120.50");
    await user.click(screen.getByLabelText("Category"));
    await user.click(await screen.findByRole("option", { name: "Groceries" }));
    await user.click(screen.getByRole("button", { name: "Save transaction" }));

    const formData = onSubmit.mock.calls[0][0] as FormData;
    expect(formData.get("title")).toBe("Weekly groceries");
    expect(formData.get("amount")).toBe("120.5");
    expect(formData.get("categoryId")).toBe("category-1");
    expect(formData.get("type")).toBe("OUTCOME");
  });

  it("defaults the transaction type to outcome", () => {
    renderForm();

    expect(screen.getByLabelText("Type")).toHaveTextContent("Outcome");
  });

  it("renders every category as an option", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByLabelText("Category"));

    expect(
      await screen.findByRole("option", { name: "Groceries" })
    ).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Salary" })).toBeInTheDocument();
  });

  it("announces a submission error", () => {
    renderForm({ error: "Amount must be a positive number" });

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Amount must be a positive number"
    );
  });

  it("calls onCancel when the cancel button is pressed", async () => {
    const user = userEvent.setup();
    const { onCancel } = renderForm();

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("disables the submit button while pending", () => {
    renderForm({ isPending: true });

    expect(screen.getByRole("button", { name: "Saving..." })).toBeDisabled();
  });
});
