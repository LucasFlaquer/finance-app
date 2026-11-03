import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/ssr";
import { Button } from "@/components/ui/button";
import { formatMonthLabel } from "@/lib/months/format-month";
import {
  compareYearMonth,
  shiftMonth,
  type YearMonth,
} from "@/lib/months/year-month";
import { MonthLink } from "./month-link";

type MonthNavigationProps = {
  month: YearMonth;
  currentMonth: YearMonth;
};

const PREVIOUS_MONTH_DELTA = -1;
const NEXT_MONTH_DELTA = 1;

type NextMonthControlProps = {
  next: YearMonth;
  isDisabled: boolean;
};

function NextMonthControl({ next, isDisabled }: NextMonthControlProps) {
  if (!isDisabled) {
    return (
      <MonthLink target={next}>
        <CaretRightIcon aria-hidden="true" />
      </MonthLink>
    );
  }
  return (
    <Button
      aria-label={`Go to ${formatMonthLabel(next)}`}
      disabled
      size="icon"
      variant="outline"
    >
      <CaretRightIcon aria-hidden="true" />
    </Button>
  );
}

function MonthNavigation({ month, currentMonth }: MonthNavigationProps) {
  const previous = shiftMonth(month, PREVIOUS_MONTH_DELTA);
  const next = shiftMonth(month, NEXT_MONTH_DELTA);
  return (
    <div className="flex items-center gap-2">
      <MonthLink target={previous}>
        <CaretLeftIcon aria-hidden="true" />
      </MonthLink>
      <span className="min-w-36 text-center font-medium text-sm tabular-nums">
        {formatMonthLabel(month)}
      </span>
      <NextMonthControl
        isDisabled={compareYearMonth(month, currentMonth) >= 0}
        next={next}
      />
    </div>
  );
}

export { MonthNavigation };
