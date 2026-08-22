import type { Icon } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format-currency";
import { cn } from "@/lib/utils";

export type SummaryCardProps = {
  label: string;
  value: number;
  icon: Icon;
  tone: "neutral" | "income" | "outcome";
};

const TONE_ICON_CLASS = {
  income: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  neutral: "bg-primary/10 text-primary",
  outcome: "bg-destructive/10 text-destructive",
} as const;

const TONE_VALUE_CLASS = {
  income: "text-emerald-600 dark:text-emerald-400",
  neutral: "text-foreground",
  outcome: "text-destructive",
} as const;

export function SummaryCard({
  label,
  value,
  icon: IconComponent,
  tone,
}: SummaryCardProps) {
  return (
    <Card className="gap-3">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="font-medium text-muted-foreground text-sm">
          {label}
        </CardTitle>
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-full",
            TONE_ICON_CLASS[tone]
          )}
        >
          <IconComponent aria-hidden="true" className="size-5" weight="bold" />
        </span>
      </CardHeader>
      <CardContent>
        <p
          className={cn(
            "font-semibold text-2xl tabular-nums tracking-tight",
            TONE_VALUE_CLASS[tone]
          )}
        >
          {formatCurrency(value)}
        </p>
      </CardContent>
    </Card>
  );
}
