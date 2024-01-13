import "server-only";

import { dbGoalsToGoals } from "@/lib/conversion/goals";
import { SupabaseClient } from "@supabase/supabase-js";

export async function getGoals(supabase: SupabaseClient): Promise<Goal[]> {
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
