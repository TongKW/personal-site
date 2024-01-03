import { SupabaseClient } from "@supabase/supabase-js";

export async function signInWithEmail(args: {
  supabase: SupabaseClient;
  email: string;
  password: string;
}) {
  const { supabase, email, password } = args;

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  return { data, error };
}
