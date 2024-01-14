import { SupabaseClient } from "@supabase/supabase-js";
import "server-only";

async function finishGoal(
  supabase: SupabaseClient,
  args: {
    userId: string;
    goalId: string;
  }
) {
  // TODO: finish logic
}

async function deleteGoal(
  supabase: SupabaseClient,
  args: {
    goalId: string;
  }
) {
  // TODO: finish logic
}
