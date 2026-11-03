import { formatMonthLabel } from "../../src/lib/months/format-month";
import { formatMonthParam } from "../../src/lib/months/month-param";
import {
  currentYearMonth,
  shiftMonth,
  type YearMonth,
} from "../../src/lib/months/year-month";

export type FixtureMonth = {
  label: string;
  param: string;
  value: YearMonth;
};

const NEXT_MONTH_DELTA = 1;
const PREVIOUS_MONTH_DELTA = -1;
const TWO_MONTHS_BACK_DELTA = -2;

function describeMonth(value: YearMonth): FixtureMonth {
  return {
    label: formatMonthLabel(value),
    param: formatMonthParam(value),
    value,
  };
}

export function fixtureMonths(now: Date = new Date()) {
  const current = currentYearMonth(now);
  return {
    current: describeMonth(current),
    next: describeMonth(shiftMonth(current, NEXT_MONTH_DELTA)),
    previous: describeMonth(shiftMonth(current, PREVIOUS_MONTH_DELTA)),
    twoBack: describeMonth(shiftMonth(current, TWO_MONTHS_BACK_DELTA)),
  };
}
