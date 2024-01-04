"use client";

import { Button } from "@/components/ui/button";
import SupabaseContext from "@/contexts/Supabase";
import { User } from "@supabase/gotrue-js";
import { useContext, useEffect, useState } from "react";

export default function AuthTestArea() {
  const supabase = useContext(SupabaseContext);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const onSignOut = () => {
    supabase.auth.signOut();
  };

  useEffect(() => {
    (async () => {
      // Check active sessions and set the user
      const session = (await supabase.auth.getSession()).data.session;
      setUser(session?.user ?? null);
      setLoading(false);

      // Listen for changes to authentication state (login, logout)
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setUser(session?.user ?? null);
        }
      );
    })();
  }, [supabase.auth]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user is currently logged in.</div>;
  }

  return (
    <div>
      <h2>Authenticated User</h2>
      <Button onClick={onSignOut}>Sign out</Button>

      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
