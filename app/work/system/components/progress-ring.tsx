"use client";

import { Ring } from "@/components/ui/ring";
import { progressItemsToProgress } from "@/lib/conversion/target";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { AddWorkDialog } from "./add-work-dialog";
import { FinishWorkDialog } from "./finish-work-dialog";
import { useRouter } from "next/navigation";
import { addWork } from "@/lib/db/work";
import { finishGoalItem } from "@/lib/db/goals";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface IntermediateWork {
  duration: number;
  title: string;
  itemId: string;
  itemTitle?: string;
  userId: string;
}

/**
 *
 * if mode is "progress": Show a progress ring
 *   - show percentage (progress%) inside the ring
 *   - when hover, the progress part become <add new work>
 *   - when click, trigger an <add new work dialog>. After a new work is added, turn "timer" mode
 *
 * if mode is "timer": Show a timer ring, with XX:XX inside (MM:SS)
 *   - different color for timer ring
 *   - when time is up: trigger a <finish work dialog>
 *   - the user can tick []finished and the corresponding Goal.finished will be set to true. A new Work will also be added
 *   - otherwise, just add a new Work only
 *   - router.refresh to update WorkProgress and WorkHistory
 *
 */
export function WorkProgressRing(props: {
  userId?: string;
  progressItems: ProgressItem[];
  goalItems: GoalItem[];
  currentN: number;
}) {
  const { userId, progressItems: items, goalItems, currentN } = props;
  const router = useRouter();

  const progress = progressItemsToProgress(items);

  const [mode, setMode] = useState<"progress" | "timer">("progress");
  const [duration, setDuration] = useState<number>(30); // in minutes

  const lastWork = useRef<IntermediateWork | null>(null);
  const [lastWorkTitle, setLastWorkTitle] = useState("");

  const [addWorkDialogOpen, setAddWorkDialogOpen] = useState(false);
  const [finishWorkDialogOpen, setFinishWorkDialogOpen] = useState(false);

  const onAddWork = (args: { work: IntermediateWork; startClock: boolean }) => {
    if (!userId) return;
    const { work, startClock } = args;
    lastWork.current = work;

    setLastWorkTitle(work.itemTitle ?? "");

    if (startClock) {
      setDuration(work.duration);
      setMode("timer");
    } else {
      setFinishWorkDialogOpen(true);
    }
  };

  const onFinishTimer = () => {
    setMode("progress");
    setFinishWorkDialogOpen(true);
  };

  const onFinishWork = async (itemFinished: boolean) => {
    const work = lastWork.current;
    if (!work || !userId) return;

    const itemId = work.itemId;

    const addWorkArgs = {
      duration: work.duration,
      itemId,
      userId,
      isFinished: itemFinished,
      title: work.title,
      createdAt: currentN
        ? new Date(new Date().getTime() - currentN * 86400000).toISOString()
        : undefined, // TODO: disabled this option after all previous work is updated
    };

    if (itemFinished) {
      await Promise.all([addWork(addWorkArgs), finishGoalItem(itemId)]);
    } else {
      await addWork(addWorkArgs);
    }
    lastWork.current = null;
    setLastWorkTitle("");
    router.refresh();
  };

  return (
    <>
      <AddWorkDialog
        open={addWorkDialogOpen}
        setOpen={setAddWorkDialogOpen}
        items={goalItems}
        userId={userId}
        onAddWork={onAddWork}
      />
      <FinishWorkDialog
        open={finishWorkDialogOpen}
        setOpen={setFinishWorkDialogOpen}
        userId={userId}
        onFinishWork={onFinishWork}
        itemTitle={lastWorkTitle}
      />
      <RingArea />
    </>
  );

  function RingArea() {
    if (mode === "progress") {
      return (
        <ProgressRing
          userId={userId}
          progress={progress}
          onClick={() => setAddWorkDialogOpen(true)}
          items={items}
        />
      );
    }
    return (
      <div className="flex flex-col gap-4">
        <TimerRing duration={duration} onFinish={onFinishTimer} />
        <p className="font-medium text-gray-500">{`In progress: ${lastWorkTitle}`}</p>
      </div>
    );
  }
}

export function ProgressRing(props: {
  userId?: string;
  progress: number;
  onClick: () => void;
  items: ProgressItem[];
}) {
  const { userId, progress, onClick, items } = props;

  const [hover, setHover] = useState(false);
  const ringColor = "text-green-500";

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={userId ? onClick : undefined}
      className={clsx("relative", { "cursor-pointer": userId })}
    >
      <Ring progress={progress * 100} color={ringColor} shimmer />

      <div className="absolute inset-0 flex justify-center items-center">
        <ProgressTooltip>
          {userId && hover ? (
            <span className="select-none cursor-pointer">Add new work</span>
          ) : (
            <span className="cursor-pointer">
              {Math.round(progress * 100)}%
            </span>
          )}
        </ProgressTooltip>
      </div>
    </div>
  );

  function ProgressTooltip(props: { children: React.ReactNode }) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{props.children}</TooltipTrigger>
          <TooltipContent>
            <ProgressTooltipContent items={items} />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  function ProgressTooltipContent(props: { items: ProgressItem[] }) {
    /*
    interface ProgressItem {
      title: string; // Title of the goal attached to a target
      target: number; // the target score of the target
      current: number; // current score to the target
    }

    Goal: return 
    */
    return (
      <div className="flex flex-col gap-2 w-full text-gray-500">
        {props.items.map((item) => {
          const { title, current, target } = item;
          return (
            <div key={title}>
              <span className="font-medium">{`${title}: `}</span>
              <span>{`current = `}</span>
              <span
                className={clsx("font-medium", {
                  "text-red-500": current === 0,
                  "text-orange-500": current < target,
                  "text-green-500": current >= target,
                })}
              >
                {item.current}
              </span>
              <span>{`, `}</span>

              <span>{`target = `}</span>
              <span className="text-black font-medium">{item.target}</span>
            </div>
          );
        })}
      </div>
    );
  }
}

export function TimerRing(props: {
  duration: number; // in minutes
  onFinish: () => void; // triggered once it drops to 0
}) {
  const { duration, onFinish } = props;

  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert minutes to seconds

  const ringColor = "text-orange-500";

  useEffect(() => {
    // Only run the timer if there's time left
    if (timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      // Clear the timeout if the component is unmounted
      return () => clearTimeout(timerId);
    } else {
      onFinish();
    }
  }, [timeLeft, onFinish]);

  // Convert time left into minutes and seconds
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Calculate the progress percentage
  const initialTotalSeconds = duration * 60;
  const timerProgress = timeLeft / initialTotalSeconds;

  return (
    <div className="relative">
      <Ring progress={Math.round(timerProgress * 100)} color={ringColor} />

      <div className="absolute inset-0 flex justify-center items-center">
        <span>{`${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`}</span>
      </div>
    </div>
  );
}
