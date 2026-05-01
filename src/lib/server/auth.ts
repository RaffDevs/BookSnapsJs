import { redirect } from "next/navigation";
import { DEMO_USER_ID } from "@/lib/mock/data";
import { isDemoMode } from "@/lib/server/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ViewerContext = {
  userId: string;
  isDemoMode: boolean;
  isAuthenticated: boolean;
};

export async function getViewerContext(): Promise<ViewerContext> {
  if (isDemoMode) {
    return {
      userId: DEMO_USER_ID,
      isDemoMode: true,
      isAuthenticated: true,
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase!.auth.getUser();

  if (!user) {
    return {
      userId: "",
      isDemoMode: false,
      isAuthenticated: false,
    };
  }

  return {
    userId: user.id,
    isDemoMode: false,
    isAuthenticated: true,
  };
}

export async function requireAuthenticatedViewer() {
  const viewer = await getViewerContext();

  if (!viewer.isAuthenticated && !viewer.isDemoMode) {
    redirect("/login");
  }

  return viewer;
}
