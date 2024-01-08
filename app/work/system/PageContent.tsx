"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import WorkSystemLoading, { WorkProgressLoading } from "./LoadingSkeleton";
import { useCenterSnap } from "@/lib/hooks/useCenterSnap";
import { MinGoalNode, getMinGoalTree } from "@/lib/conversion/goals";
import { WorkProgress } from "./WorkProgress";
import { WorkProgressRing } from "./WorkProgress/components/Ring";
import { fetchWorkProgressType } from "./page";
import sleep from "@/lib/time/sleep";

export function WorkSystemContent(props: {
  userId?: string;
  rule: TargetRule;
  targets: Target[];
  goals: Goal[];
  fetchWorkProgress: fetchWorkProgressType;
}) {
  const { userId, rule, targets, goals, fetchWorkProgress } = props;

  const interval = "day"; // TODO: change with dropdown menu choice

  const scrollRef = useRef<HTMLDivElement>(null);
  const [centerIndex] = useCenterSnap(scrollRef);

  const [items, setItems] = useState<Array<"pending" | "ready">>(["pending"]);

  const minGoalTree = useMemo(() => getMinGoalTree(goals), [goals]);

  const fetchWorkProgressCallback = (index: number) => {
    if (items[index] === "pending") {
      setItems([...items.slice(0, index + 1), "pending"]);
    }
  };

  if (!targets.length) {
    return <WorkSystemLoading />;
  }

  // outline
  // Array of PendingProgress | Progress
  // 1. PendingProgress: just a placeholder UI for user to swipe
  //   - when IdleProgress is at the center of the screen:
  //     - increment n
  //     - trigger fetching -> router refresh

  // const n = 0; // TODO: change with swipe left/right
  // const timeZone = "Asia/Hong_Kong";
  // const startDate =

  return (
    <>
      <p>Centered item: {centerIndex}</p>
      <div
        ref={scrollRef}
        className="snap-x rtl-container w-full flex flex-row gap-40 snap-mandatory overflow-scroll"
      >
        <div className="shrink-0">
          <div className="shrink-0 w-4 sm:w-48"></div>
        </div>
        {items.map((item, index) => {
          const key = `work-progress-${index}`;
          return (
            <div className="snap-center h-60 w-60 shrink-0" key={key}>
              <WorkProgress
                fetchWorkProgress={fetchWorkProgress}
                fetchCallback={() => fetchWorkProgressCallback(index)}
                active={centerIndex - 1 === index}
                args={{
                  interval,
                  n: index,
                  goalTree: minGoalTree,
                  targets,
                }}
              />
            </div>
          );
        })}
        <div className="shrink-0">
          <div className="shrink-0 w-4 sm:w-48"></div>
        </div>
      </div>
    </>
  );
}
