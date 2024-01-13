import "server-only";

import { SupabaseClient } from "@supabase/supabase-js";
import { dbTargetRuleToLocal } from "@/lib/conversion/target";

export async function getTargetRule(
  supabase: SupabaseClient
): Promise<TargetRule> {
  const { data, error } = await supabase
    .from("target-rules")
    .select("*")
    .eq("user_id", process.env.NEXT_PUBLIC_ADMIN_ID);

  if (error) {
    throw new Error(`Error fetching data: ${error}`);
  }

  return dbTargetRuleToLocal(data[0]);
}
