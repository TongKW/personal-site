"use client";

import { WorkProgressRing } from "./components/Ring";
import { useEffect, useRef, useState } from "react";
import { WorkProgressLoading } from "../LoadingSkeleton";
import { fetchWorkProgressArgs, fetchWorkProgressType } from "../page";

export function WorkProgress(props: {
  fetchWorkProgress: fetchWorkProgressType;
  fetchCallback: () => void;
  args: fetchWorkProgressArgs;
  active: boolean;
}) {
  const [progressItems, setProgressItems] = useState<ProgressItem[]>();
  const { fetchWorkProgress, args, fetchCallback, active } = props;

  const fetched = useRef(false);

  async function refetch() {
    const items = await fetchWorkProgress(args);
    setProgressItems(items);
  }

  useEffect(() => {
    (async () => {
      if (!active || fetched.current) return;
      if (progressItems) return;

      fetched.current = true;
      const items = await fetchWorkProgress(args);
      setProgressItems(items);
      fetchCallback();
    })();
  }, [args, progressItems, fetchWorkProgress, fetchCallback, active]);

  // 2. render the UI on client side (pass progress to Ring.tsx)
  if (!progressItems) return <WorkProgressLoading />;
  return <WorkProgressRing progressItems={progressItems} refetch={refetch} />;
}
