import "server-only";

import { GoalNode } from "@/lib/conversion/goals";
import { pastIntervalStartTime } from "@/lib/date/interval-start-time";
import { getWorkProgressItems } from "@/lib/db/progress";

export async function fetchProgressItems(props: {
  interval: TimeInterval;
  n: number;
  goalTree: GoalNode[];
  targets: Target[];
}) {
  const timeZone = "Asia/Hong_Kong"; // TODO: change this to global context
  const { interval, goalTree, targets, n } = props;

  // 1. get startDate and endDate from interval and n
  let startTime = pastIntervalStartTime({
    interval,
    timeZone,
    n,
  });
  let endTime: Date | undefined;
  if (n > 0) {
    endTime = pastIntervalStartTime({
      interval,
      timeZone,
      n: n - 1,
    });
  }

  // 2. query work within the above interval
  const progressItems = await getWorkProgressItems({
    startTime,
    endTime,
    goalTree,
    targets,
  });

  return progressItems;
}
