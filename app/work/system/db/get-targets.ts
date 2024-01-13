import "server-only";

import { SupabaseClient } from "@supabase/supabase-js";

export async function getTargets(supabase: SupabaseClient): Promise<Target[]> {
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
