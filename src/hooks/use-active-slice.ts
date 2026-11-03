import { useCallback, useState } from "react";

export function useActiveSlice() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activate = useCallback(
    (categoryId: string) => setActiveId(categoryId),
    []
  );
  const clear = useCallback(() => setActiveId(null), []);
  return { activate, activeId, clear };
}
