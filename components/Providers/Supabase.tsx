// components/SupabaseProvider.tsx
import React, { FC, ReactNode } from "react";
import SupabaseContext from "@/contexts/Supabase";
import { supabase } from "@/lib/supabase/client";

type SupabaseProviderProps = {
  children: ReactNode;
};

const SupabaseProvider: FC<SupabaseProviderProps> = ({ children }) => {
  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
};

export default SupabaseProvider;
