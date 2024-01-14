import { getSupabaseUser } from "@/lib/supabase/server";
import { WorkSystemContent } from "./page-content";
import { AddTargetDialog } from "./add-target-dialog";
import { MinGoalNode, getMinGoalTree } from "@/lib/conversion/goals";
import { fetchProgressItems } from "./db/fetch-progress-item";
import { getGoals } from "./db/get-goals";
import { getTargetRule } from "./db/get-target-rule";
import { getTargets } from "./db/get-targets";

export interface fetchWorkProgressArgs {
  interval: TimeInterval;
  n: number;
  goalTree: MinGoalNode[];
  targets: Target[];
}
export type fetchWorkProgressType = (
  props: fetchWorkProgressArgs
) => Promise<ProgressItem[]>;

export default async function WorkSystem({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const n = getN();
  const interval = getInterval();

  const { supabase, userId } = await getSupabaseUser();

  const [goals, targetRule, targets] = await Promise.all([
    getGoals(supabase),
    getTargetRule(supabase),
    getTargets(supabase),
  ]);

  const goalTree = getMinGoalTree(goals);

  const progressItems = await fetchProgressItems({
    interval,
    n,
    goalTree,
    targets,
  });

  return (
    <div className="flex flex-col w-full">
      {!targets.length && userId && (
        <AddTargetDialog userId={userId} goals={goals} />
      )}
      <WorkSystemContent
        userId={userId}
        rule={targetRule}
        targets={targets}
        goals={goals}
        progressItems={progressItems}
      />
    </div>
  );

  function getN(): number {
    try {
      const temp = parseInt((searchParams?.n ?? "0") as string);
      if (Number.isNaN(temp)) return 0;
      return temp;
    } catch (error) {
      return 0;
    }
  }

  function getInterval(): TimeInterval {
    return (searchParams?.interval ?? "day") as TimeInterval;
  }
}
