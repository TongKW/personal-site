// Eg: intervalStartTime({timeZone: "Asia/Hong_Kong", interval: "day"})
export function intervalStartTime(args: {
  interval: "day" | "week" | "month" | "year";
  timeZone: string;
  date?: Date;
}) {
  const {
    interval,
    timeZone,
    date = new Date(new Intl.DateTimeFormat("en-US", { timeZone }).format()),
  } = args;

  // Reset hours, minutes, seconds, and milliseconds to get the start of the day
  date.setHours(0, 0, 0, 0);

  switch (interval) {
    case "day":
      // Start of the day is already computed above
      break;
    case "week":
      // Set to the start of the week (Sunday)
      const day = date.getDay(); // 0 (Sunday) to 6 (Saturday)
      date.setDate(date.getDate() - day);
      break;
    case "month":
      // Set to the first day of the month
      date.setDate(1);
      break;
    case "year":
      // Set to January 1st
      date.setMonth(0, 1);
      break;
    default:
      throw new Error("Invalid interval specified");
  }

  return date;
}

export function pastIntervalStartTime(args: {
  n: number;
  interval: "day" | "week" | "month" | "year";
  timeZone: string;
  date?: Date;
}) {
  const {
    n,
    interval,
    timeZone,
    date = new Date(new Intl.DateTimeFormat("en-US", { timeZone }).format()),
  } = args;

  const startDate = intervalStartTime({ interval, timeZone, date });

  if (n == 0) return startDate;
  const newDate = new Date(startDate.getTime() - 100);
  return pastIntervalStartTime({ n: n - 1, interval, timeZone, date: newDate });
}
