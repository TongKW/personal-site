"use client";

import { Ring } from "@/components/ui/ring";
import { progressItemsToProgress } from "@/lib/conversion/target";
import clsx from "clsx";
import { useEffect, useState } from "react";

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
}) {
  const { userId, progressItems: items } = props;
  const progress = progressItemsToProgress(items);

  const [mode, setMode] = useState<"progress" | "timer">("progress");
  const [duration, setDuration] = useState<number>(30);

  const onAddWork = () => {
    return;
  };

  const onFinishWork = () => {
    // TODO: pop a dialog for finished work info
    return;
  };

  if (mode === "progress") {
    return (
      <ProgressRing userId={userId} progress={progress} onClick={onAddWork} />
    );
  }
  return <TimerRing duration={duration} onFinish={onFinishWork} />;
}

export function ProgressRing(props: {
  userId?: string;
  progress: number;
  onClick: () => void;
}) {
  const { userId, progress, onClick } = props;

  const [hover, setHover] = useState(false);
  const ringColor = "text-green-500";

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={userId ? onClick : undefined}
      className={clsx("relative", { "cursor-pointer": userId })}
    >
      <Ring progress={progress} color={ringColor} />
      <div className="absolute inset-0 flex justify-center items-center">
        {userId && hover ? (
          <span className="select-none">Add new work</span>
        ) : (
          <span>{Math.round(progress * 100)}%</span>
        )}
      </div>
    </div>
  );
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
      <Ring progress={timerProgress} color={ringColor} />
      <div className="absolute inset-0 flex justify-center items-center">
        <span>{`${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`}</span>
      </div>
    </div>
  );
}
