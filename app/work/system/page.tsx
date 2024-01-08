import { dbTargetRuleToLocal } from "@/lib/conversion/target";
import { getSupabaseUser } from "@/lib/supabase/server";
import { WorkSystemContent } from "./PageContent";
import { AddTargetDialog } from "./AddTargetDialog";
import { MinGoalNode, dbGoalsToGoals } from "@/lib/conversion/goals";
import { getWorkProgressItems } from "@/lib/db/progress";
import { pastIntervalStartTime } from "@/lib/date/intervalStartTime";

export interface fetchWorkProgressArgs {
  interval: TimeInterval;
  n: number;
  goalTree: MinGoalNode[];
  targets: Target[];
}
export type fetchWorkProgressType = (
  props: fetchWorkProgressArgs
) => Promise<ProgressItem[]>;

export default async function WorkSystem() {
  const { supabase, userId } = await getSupabaseUser();

  const [goals, targetRule, targets] = await Promise.all([
    getGoals(),
    getTargetRule(),
    getTargets(),
  ]);

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
        fetchWorkProgress={fetchWorkProgress}
      />
    </div>
  );

  async function getGoals(): Promise<Goal[]> {
    const { data: dbGoals, error } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", process.env.NEXT_PUBLIC_ADMIN_ID);

    // Handle any errors
    if (error) {
      throw new Error(`Error fetching data: ${error}`);
    }

    return dbGoalsToGoals(dbGoals);
  }

  async function getTargetRule(): Promise<TargetRule> {
    const { data, error } = await supabase
      .from("target-rules")
      .select("*")
      .eq("user_id", process.env.NEXT_PUBLIC_ADMIN_ID);

    if (error) {
      throw new Error(`Error fetching data: ${error}`);
    }

    return dbTargetRuleToLocal(data[0]);
  }

  async function getTargets(): Promise<Target[]> {
    const { data, error } = await supabase
      .from("targets")
      .select(
        `id, target, interval, goals ( id, title, is_root, parent_goal_id )`
      )
      .eq("user_id", process.env.NEXT_PUBLIC_ADMIN_ID);

    if (error) throw `getTargets error: ${error}`;

    return data.map((d) => {
      const goal = d.goals as any;
      return {
        id: d.id,
        interval: d.interval,
        target: d.target,
        goal: {
          type: "Goal",
          id: goal.id,
          title: goal.title,
          isRoot: goal.is_root,
          parentGoalId: goal.parent_goal_id,
        },
      };
    });
  }

  async function fetchWorkProgress(props: {
    interval: TimeInterval;
    n: number;
    goalTree: MinGoalNode[];
    targets: Target[];
  }) {
    "use server";

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

    console.log(`server side: Work progress for index ${n}: `);
    console.log(startTime);
    console.log(endTime);

    // 2. query work within the above interval
    const progressItems = await getWorkProgressItems({
      startTime,
      endTime,
      goalTree,
      targets,
    });

    console.log("server side: progressItems: ");
    console.log(progressItems);

    return progressItems;
  }
}
