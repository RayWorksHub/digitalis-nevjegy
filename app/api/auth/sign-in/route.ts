import { createMemoryRateLimiter, isSameOrigin } from "@/lib/auth-request";
import { createClient } from "@/lib/supabase/server";
import { signInSchema, toFieldErrors } from "@/lib/validation";

export const runtime = "nodejs";

const checkRateLimit = createMemoryRateLimiter(20, 15 * 60 * 1000);

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: "A kérés nem engedélyezett." }, { status: 403 });
  }

  const rateLimit = checkRateLimit(request);
  if (!rateLimit.allowed) {
    return Response.json(
      { error: "Túl sok belépési próbálkozás. Próbáld újra később." },
      { status: 429, headers: { "retry-after": String(rateLimit.retryAfter) } }
    );
  }

  try {
    const parsed = signInSchema.safeParse(await request.json());
    if (!parsed.success) {
      return Response.json(
        { error: "Ellenőrizd a belépési adatokat.", fieldErrors: toFieldErrors(parsed.error) },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    if (!supabase) {
      console.error("[api/auth/sign-in] missing Supabase configuration");
      return Response.json({ error: "A belépési szolgáltatás nincs beállítva." }, { status: 503 });
    }

    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    if (error) {
      console.warn("[api/auth/sign-in] rejected", { code: error.code });
      if (error.code === "email_not_confirmed") {
        return Response.json(
          { error: "A fiók aktiválása nem fejeződött be. Regisztrálj újra ugyanazzal az e-mail-címmel és jelszóval." },
          { status: 403 }
        );
      }
      if (["over_request_rate_limit", "over_email_send_rate_limit"].includes(error.code || "")) {
        return Response.json({ error: "Túl sok próbálkozás. Próbáld újra később." }, { status: 429 });
      }
      return Response.json({ error: "Hibás e-mail-cím vagy jelszó." }, { status: 401 });
    }

    console.info("[api/auth/sign-in] success");
    return Response.json({ success: true }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    console.error("[api/auth/sign-in] failed", { code: error && typeof error === "object" && "code" in error ? String(error.code) : "unknown" });
    return Response.json({ error: "A belépés most nem sikerült. Próbáld újra." }, { status: 500 });
  }
}
