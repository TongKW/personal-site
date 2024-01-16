"use server";

import { SupabaseClient } from "@supabase/supabase-js";
import { dbItemsToItems } from "../conversion/goals";
import { getSupabaseUser } from "../supabase/server";

export async function finishGoalItem(itemId: string) {
  const { userId, supabase } = await getSupabaseUser();

  if (!userId) return;

  await supabase.from("items").update({ finished: true }).eq("id", itemId);
}

export async function getItemsWithGoalTitle(
  supabase: SupabaseClient,
  goals: Goal[],
  option?: { showFinished: boolean }
) {
  // 1. Create map of goal.id -> goal.title
  const goalMap = new Map();
  for (const goal of goals) goalMap.set(goal.id, goal.title);

  let query = supabase
    .from("items")
    .select("*")
    .eq("user_id", process.env.NEXT_PUBLIC_ADMIN_ID);

  if (option && !option.showFinished) {
    query = query.eq("finished", false);
  }

  // 2. Query items from db
  const { data: dbItems, error: itemsError } = await query;

  // Handle any errors
  if (itemsError) {
    throw new Error(`Error fetching data: ${JSON.stringify(itemsError)}`);
  }

  return dbItemsToItems(dbItems).map((item) => {
    return { ...item, parentGoalTitle: goalMap.get(item.parentGoalId) };
  });
}
