import {
  convertGoalsToExpandableGoals,
  dbGoalsToGoals,
  dbItemsToItems,
} from "@/lib/conversion/goals";
import { SupabaseClient } from "@supabase/supabase-js";
import { AddItemDialogButton } from "./add-item-dialog";
import { GoalList } from "./goal-list";
import { getSupabaseUser } from "@/lib/supabase/server";

async function fetchGoalsAndItems(supabase: SupabaseClient) {
  // Fetch goals and items from Supabase
  const { data: dbGoals, error: goalsError } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", process.env.NEXT_PUBLIC_ADMIN_ID);

  const { data: dbItems, error: itemsError } = await supabase
    .from("items")
    .select("*")
    .eq("user_id", process.env.NEXT_PUBLIC_ADMIN_ID);

  // Handle any errors
  if (goalsError || itemsError) {
    throw new Error(`Error fetching data: ${goalsError || itemsError}`);
  }

  return {
    goals: dbGoalsToGoals(dbGoals),
    items: dbItemsToItems(dbItems),
  };
}

export default async function Goals() {
  const { supabase, userId } = await getSupabaseUser();

  const { goals, items } = await fetchGoalsAndItems(supabase);
  const isAdmin = userId === process.env.NEXT_PUBLIC_ADMIN_ID;

  return (
    <div className="flex flex-col py-4 px-10">
      <div className="flex items-start w-full items-center gap-4">
        {isAdmin && <AddItemDialogButton userId={userId} />}
      </div>
      <GoalList
        userId={userId}
        goals={convertGoalsToExpandableGoals(goals, items)}
        readOnly={!isAdmin}
      />
    </div>
  );
}
