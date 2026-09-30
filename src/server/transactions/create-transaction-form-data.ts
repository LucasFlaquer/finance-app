export function buildFormData(
  overrides: Record<string, string> = {}
): FormData {
  const fields = {
    amount: "120.50",
    categoryId: "category-1",
    title: "Grocery shopping",
    type: "OUTCOME",
    ...overrides,
  };
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    formData.set(key, value);
  }
  return formData;
}
