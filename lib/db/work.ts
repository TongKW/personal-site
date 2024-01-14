"use server";

import { getSupabaseUser } from "../supabase/server";

export async function addWork(args: {
  duration: number;
  itemId: string;
  isFinished: boolean;
  title: string;
}) {
  const { supabase, userId } = await getSupabaseUser();
  if (!userId) return;

  await supabase.from("work").insert({
    duration: args.duration,
    item_id: args.itemId,
    title: args.title,
    user_id: userId,
    is_finished: args.isFinished,
  });
}
