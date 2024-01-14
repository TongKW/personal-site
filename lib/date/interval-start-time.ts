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
  randomTime?: boolean;
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

export function intervalStartToEndFormatString(args: {
  n: number;
  interval: "day" | "week" | "month" | "year";
  timeZone?: string;
}): string {
  const { n, interval, timeZone = "Asia/Hong_Kong" } = args;
  console.log(args);

  // Get the start date of the current interval
  const startDate = pastIntervalStartTime({ n: 0, interval, timeZone });

  // If n is 0, we are looking at the current interval
  if (n === 0) {
    if (interval === "day") {
      // If the interval is "day", return just the start date as a string
      return startDate.toDateString();
    } else {
      // For longer intervals, calculate the end date of the interval
      let endDate = new Date(startDate);
      switch (interval) {
        case "week":
          endDate.setDate(endDate.getDate() + 6);
          break;
        case "month":
          endDate.setMonth(endDate.getMonth() + 1);
          endDate.setDate(0); // Last day of the previous month
          break;
        case "year":
          endDate.setFullYear(endDate.getFullYear() + 1);
          endDate.setMonth(0);
          endDate.setDate(0); // Last day of the previous year
          break;
      }
      // Return the formatted string with both dates
      return `${startDate.toDateString()} to ${endDate.toDateString()}`;
    }
  } else {
    // If n is not 0, we are looking at past intervals
    // Calculate the past start date for the given interval
    const pastStartDate = pastIntervalStartTime({ n, interval, timeZone });
    let pastEndDate = new Date(pastStartDate);

    if (interval === "day") {
      // If the interval is "day", return just the start date as a string
      return pastStartDate.toDateString();
    }

    // Calculate the end date for the past interval
    switch (interval) {
      case "week":
        pastEndDate.setDate(pastEndDate.getDate() + 6);
        break;
      case "month":
        pastEndDate.setMonth(pastEndDate.getMonth() + 1);
        pastEndDate.setDate(0); // Last day of the previous month
        break;
      case "year":
        pastEndDate.setFullYear(pastEndDate.getFullYear() + 1);
        pastEndDate.setMonth(0);
        pastEndDate.setDate(0); // Last day of the previous year
        break;
    }

    // Return the formatted string with both dates
    return `${pastStartDate.toDateString()} to ${pastEndDate.toDateString()}`;
  }
}
