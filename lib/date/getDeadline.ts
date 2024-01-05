export function getNextDayDeadline(): number {
  const now = new Date();
  const nextDay = new Date(now);
  nextDay.setDate(now.getDate() + 1);
  nextDay.setHours(0, 0, 0, 0);
  return nextDay.getTime();
}

export function getNextWeekDeadline(): number {
  const now = new Date();
  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + ((7 - now.getDay() + 1) % 7));
  nextMonday.setHours(0, 0, 0, 0);
  return nextMonday.getTime();
}

export function getNextMonthDeadline(): number {
  const now = new Date();
  const nextMonth = new Date(now);
  nextMonth.setMonth(now.getMonth() + 1, 1);
  nextMonth.setHours(0, 0, 0, 0);
  return nextMonth.getTime();
}

export function getNextYearDeadline(): number {
  const now = new Date();
  const nextYear = new Date(now);
  nextYear.setFullYear(now.getFullYear() + 1, 0, 1);
  nextYear.setHours(0, 0, 0, 0);
  return nextYear.getTime();
}

export function getDeadline(key: string): number | undefined {
  if (key === "day") return getNextDayDeadline();
  if (key === "week") return getNextWeekDeadline();
  if (key === "month") return getNextMonthDeadline();
  if (key === "year") return getNextYearDeadline();
  return undefined;
}
