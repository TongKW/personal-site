"use client";

// contexts/SupabaseContext.ts
import { createContext } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";

const SupabaseContext = createContext<SupabaseClient>(supabase);

export default SupabaseContext;
