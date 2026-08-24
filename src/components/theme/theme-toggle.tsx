"use client";

import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { type MouseEvent, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useThemeToggle } from "@/hooks/use-theme-toggle";
import { cn } from "@/lib/utils";

const ICON_CLASS = "absolute size-4";
const ICON_MOTION_CLASS =
  "transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none";
const SUN_CLASS =
  "rotate-0 scale-100 opacity-100 dark:-rotate-90 dark:scale-50 dark:opacity-0";
const MOON_CLASS =
  "rotate-90 scale-50 opacity-0 dark:rotate-0 dark:scale-100 dark:opacity-100";

export function ThemeToggle() {
  const { isDark, isMounted, nextTheme, toggleTheme } = useThemeToggle();
  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      toggleTheme(event.currentTarget);
    },
    [toggleTheme]
  );
  const motionClass = isMounted ? ICON_MOTION_CLASS : undefined;
  return (
    <Button
      aria-label={isMounted ? `Switch to ${nextTheme} theme` : "Switch theme"}
      aria-pressed={isMounted ? isDark : undefined}
      className="relative text-muted-foreground hover:text-foreground"
      onClick={handleClick}
      size="icon"
      variant="ghost"
    >
      <SunIcon
        aria-hidden="true"
        className={cn(ICON_CLASS, motionClass, SUN_CLASS)}
        weight="bold"
      />
      <MoonIcon
        aria-hidden="true"
        className={cn(ICON_CLASS, motionClass, MOON_CLASS)}
        weight="bold"
      />
    </Button>
  );
}
