const MONTHS_PER_YEAR = 12;

export type YearMonth = {
  year: number;
  month: number;
};

export function currentYearMonth(now: Date): YearMonth {
  return { month: now.getUTCMonth() + 1, year: now.getUTCFullYear() };
}

export function shiftMonth(value: YearMonth, delta: number): YearMonth {
  const monthIndex = value.year * MONTHS_PER_YEAR + (value.month - 1) + delta;
  return {
    month: (monthIndex % MONTHS_PER_YEAR) + 1,
    year: Math.floor(monthIndex / MONTHS_PER_YEAR),
  };
}

export function compareYearMonth(a: YearMonth, b: YearMonth): number {
  if (a.year !== b.year) {
    return a.year - b.year;
  }
  return a.month - b.month;
}

export function monthRange(value: YearMonth): { start: Date; end: Date } {
  const next = shiftMonth(value, 1);
  return {
    end: new Date(Date.UTC(next.year, next.month - 1, 1)),
    start: new Date(Date.UTC(value.year, value.month - 1, 1)),
  };
}
