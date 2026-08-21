import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const requestedNext = url.searchParams.get("next") || "/dashboard";
  const next = requestedNext.startsWith("/") && !requestedNext.startsWith("//") ? requestedNext : "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data, error } = supabase
      ? await supabase.auth.exchangeCodeForSession(code)
      : { data: null, error: new Error("A belépési szolgáltatás nincs beállítva.") };
    if (!error && data.user) {
      const isRecovery = next === "/auth/update-password";
      const destination = isRecovery ? "/auth/update-password" : next;
      const response = NextResponse.redirect(new URL(destination, url.origin));
      if (isRecovery) {
        response.cookies.set("e-nevjegy-recovery", data.user.id, {
          httpOnly: true,
          secure: url.protocol === "https:",
          sameSite: "lax",
          path: "/",
          maxAge: 15 * 60
        });
      }
      return response;
    }
  }

  return NextResponse.redirect(new URL("/auth/sign-in?error=callback", url.origin));
}
