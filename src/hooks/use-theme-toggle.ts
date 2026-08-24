"use client";

import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { originFromElement, startThemeReveal } from "@/lib/theme/theme-reveal";

export function useThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const isDark = resolvedTheme === "dark";
  const nextTheme = isDark ? "light" : "dark";
  const toggleTheme = useCallback(
    (origin: Element) => {
      startThemeReveal({
        applyTheme: () => {
          flushSync(() => setTheme(nextTheme));
        },
        origin: originFromElement(origin),
      });
    },
    [nextTheme, setTheme]
  );
  return { isDark, isMounted, nextTheme, toggleTheme };
}
