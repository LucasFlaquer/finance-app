import Link from "next/link";
import type { ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import { formatMonthLabel } from "@/lib/months/format-month";
import { formatMonthParam, MONTH_PARAM } from "@/lib/months/month-param";
import type { YearMonth } from "@/lib/months/year-month";

type MonthLinkProps = {
  target: YearMonth;
  children: ReactNode;
};

function MonthLink({ target, children }: MonthLinkProps) {
  return (
    <Link
      aria-label={`Go to ${formatMonthLabel(target)}`}
      className={buttonVariants({ size: "icon", variant: "outline" })}
      href={`/?${MONTH_PARAM}=${formatMonthParam(target)}`}
    >
      {children}
    </Link>
  );
}

export { MonthLink };
