import { createClient } from "@supabase/supabase-js";
import { env, hasSupabaseConfig } from "@/lib/server/env";

export function createSupabaseAdminClient() {
  if (!hasSupabaseConfig) {
    return null;
  }

  return createClient(env.supabaseUrl!, env.supabaseServiceRoleKey!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
