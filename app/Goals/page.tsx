import { GoalList } from "@/app/goals/GoalList";
import {
  convertGoalsToExpandableGoals,
  dbGoalsToGoals,
} from "@/lib/conversion/goals";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SupabaseClient } from "@supabase/supabase-js";

async function fetchData(supabase: SupabaseClient) {
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
    items: [],
  };
}

export default async function Goals() {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
  const session = (await supabase.auth.getSession()).data.session;

  const { goals, items } = await fetchData(supabase);
  const isAdmin = session?.user.id === process.env.NEXT_PUBLIC_ADMIN_ID;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center w-full flex-1 px-20 text-center">
        <h1 className="text-4xl font-bold my-6">{`Goals`}</h1>
        <GoalList
          goals={convertGoalsToExpandableGoals(goals, items)}
          readOnly={!isAdmin}
        />
      </main>
    </div>
  );
}
