import { GoalNode } from "../conversion/goals";
import { targetsToProgressItems } from "../conversion/target";
import { getSupabaseUser } from "../supabase/server";

export async function getWorkProgressItems(args: {
  startTime: Date;
  endTime?: Date;
  goalTree: GoalNode[];
  targets: Target[];
}): Promise<{ progressItems: ProgressItem[]; works: Work[] }> {
  const { startTime, endTime, goalTree, targets } = args;
  const { supabase } = await getSupabaseUser();

  // 1. Get the target-rule and all works first
  const [rule, works] = await Promise.all([getRule(), getWorks()]);

  return {
    progressItems: targetsToProgressItems({
      targets,
      rule,
      goalTree,
      works,
    }),
    works: works,
  };

  async function getRule(): Promise<TargetRule> {
    const { data, error } = await supabase
      .from("target-rules")
      .select("*")
      .eq("user_id", process.env.NEXT_PUBLIC_ADMIN_ID);

    if (error) throw `getRules error: ${error}`;

    return {
      finishItem: data[0].finish_item,
      hourWork: data[0].hr_work,
    };
  }

  async function getWorks(): Promise<Work[]> {
    let query = supabase
      .from("work")
      .select(
        `id, duration, created_at, title, is_finished, items ( id, title, goal_id, finished, deadline )`
      )
      .eq("user_id", process.env.NEXT_PUBLIC_ADMIN_ID)
      .gte("created_at", startTime.toISOString()); // Using ISO string for the date comparison

    if (endTime) {
      query = query.lt("created_at", endTime.toISOString());
    }

    const { data, error } = await query;

    if (error) throw `getWork error: ${error}`;

    return data.map((d) => {
      const item = d.items as any;
      return {
        id: d.id,
        createdAt: new Date(d.created_at).getTime(),
        duration: d.duration,
        isFinished: d.is_finished,
        item: {
          type: "GoalItem",
          id: item.id,
          parentGoalId: item.goal_id,
          finished: item.finished,
          deadline: new Date(item.deadline).getTime(),
          title: item.title,
        },
        title: d.title,
      };
    });
  }
}
