import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { env, hasSupabaseConfig } from "@/lib/server/env";

export async function createSupabaseServerClient(options?: { writable?: boolean }) {
  if (!hasSupabaseConfig) {
    return null;
  }

  const cookieStore = await cookies();
  const writable = options?.writable ?? false;

  return createServerClient(env.supabaseUrl!, env.supabaseAnonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        if (!writable) {
          return;
        }

        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });
}
