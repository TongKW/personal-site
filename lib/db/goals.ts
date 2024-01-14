"use server";

import { SupabaseClient } from "@supabase/supabase-js";
import { dbItemsToItems } from "../conversion/goals";
import { getSupabaseUser } from "../supabase/server";

export async function finishGoalItem(goalId: string) {
  const { userId, supabase } = await getSupabaseUser();

  if (userId) return;
  await supabase
    .from("items")
    .update({ finished: true })
    .eq("goal_id", goalId)
    .eq("user_id", userId);
}

export async function getItemsWithGoalTitle(
  supabase: SupabaseClient,
  goals: Goal[]
) {
  // 1. Create map of goal.id -> goal.title
  const goalMap = new Map();
  for (const goal of goals) goalMap.set(goal.id, goal.title);

  // 2. Query items from db
  const { data: dbItems, error: itemsError } = await supabase
    .from("items")
    .select("*")
    .eq("user_id", process.env.NEXT_PUBLIC_ADMIN_ID);

  // Handle any errors
  if (itemsError) {
    throw new Error(`Error fetching data: ${itemsError}`);
  }

  return dbItemsToItems(dbItems).map((item) => {
    return { ...item, parentGoalTitle: goalMap.get(item.parentGoalId) };
  });
}
