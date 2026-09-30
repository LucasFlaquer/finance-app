import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type AppPage = "dashboard" | "transactions";

export type AppNavProps = {
  current: AppPage;
};

const NAV_LINKS = [
  { href: "/", label: "Dashboard", page: "dashboard" },
  { href: "/transactions", label: "Transactions", page: "transactions" },
] as const;

export function AppNav({ current }: AppNavProps) {
  return (
    <nav aria-label="Main" className="flex items-center gap-1">
      {NAV_LINKS.map(({ href, label, page }) => {
        const isCurrent = page === current;
        return (
          <Link
            aria-current={isCurrent ? "page" : undefined}
            className={cn(
              buttonVariants({ variant: isCurrent ? "secondary" : "ghost" }),
              isCurrent
                ? "underline decoration-2 underline-offset-8"
                : "text-muted-foreground"
            )}
            href={href}
            key={page}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
