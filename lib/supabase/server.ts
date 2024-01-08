"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function getSupabaseUser() {
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
  const userId = session?.user.id;

  return { supabase, userId };
}
