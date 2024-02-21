"use client";

import { Ring } from "@/components/ui/ring";
import { progressItemsToProgress } from "@/lib/conversion/target";
import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const [endTime, setEndTime] = useState<number>(); // in milliseconds
  const [duration, setDuration] = useState<number>(30);

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
      setEndTime(new Date().getTime() + work.duration * 60000);
      setDuration(work.duration);
      setMode("timer");
    } else {
      setFinishWorkDialogOpen(true);
    }
  };

  const onFinishTimer = () => {
    setMode("progress");
    setEndTime(undefined);
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
        <TimerRing
          endTime={endTime}
          duration={duration}
          onFinish={onFinishTimer}
        />
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
          <TooltipContent className="bg-white">
            <ProgressTooltipContent items={items} />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  function ProgressTooltipContent(props: { items: ProgressItem[] }) {
    return (
      <div className="flex flex-col gap-2 w-full text-gray-500">
        {props.items.map((item) => {
          const { title, current, target } = item;
          return (
            <div key={title}>
              <span className="font-medium">{`${title}: `}</span>
              <span>{`current = `}</span>
              <span
                className={clsx("font-bold", {
                  "text-red-500": current === 0,
                  "text-orange-500": current < target,
                  "text-green-500": current >= target,
                })}
              >
                {parseFloat(item.current.toFixed(2))}
              </span>
              <span>{`, `}</span>

              <span>{`target = `}</span>
              <span className="text-black font-bold">{item.target}</span>
            </div>
          );
        })}
      </div>
    );
  }
}

export function TimerRing(props: {
  endTime?: number; // a timestamp in the future as the end time
  duration: number;
  onFinish: () => void; // triggered once it drops to 0
}) {
  const { endTime = 0, duration, onFinish } = props;

  // Calculate initial time left in seconds
  const calculateTimeLeft = useCallback(() => {
    const currentTime = Date.now();
    return Math.floor((endTime - currentTime) / 1000);
  }, [endTime]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  const ringColor = "text-orange-500";

  useEffect(() => {
    // Update timeLeft immediately to avoid initial delay
    setTimeLeft(calculateTimeLeft());

    const updateTimer = () => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // Update document title
      const minutes = Math.floor(newTimeLeft / 60);
      const seconds = newTimeLeft % 60;
      document.title = `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;

      if (newTimeLeft <= 0) {
        onFinish();
        document.title = "Timer Finished"; // Reset the document title or set a new one
      }
    };

    // Run the timer every second
    const timerId = setInterval(updateTimer, 1000);

    // Clear the interval if the component is unmounted or the timeLeft is 0
    return () => clearInterval(timerId);
  }, [calculateTimeLeft, endTime, onFinish]);

  // Convert time left into minutes and seconds
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Calculate the initial total seconds and progress percentage
  const progress = Math.floor((endTime - Date.now()) / 1000) / (duration * 60);

  return (
    <div className="relative">
      <Ring progress={Math.round(progress * 100)} color={ringColor} />

      <div className="absolute inset-0 flex justify-center items-center">
        <span>{`${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`}</span>
      </div>
    </div>
  );
}
