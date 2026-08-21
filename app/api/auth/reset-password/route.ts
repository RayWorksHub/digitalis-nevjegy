import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createMemoryRateLimiter, isSameOrigin, waitForMinimumDuration } from "@/lib/auth-request";
import { resetPasswordSchema, toFieldErrors } from "@/lib/validation";

export const runtime = "nodejs";

const checkRateLimit = createMemoryRateLimiter(8, 60 * 60 * 1000);
const genericMessage = "Ha az e-mail-címhez tartozik fiók, néhány percen belül elküldjük a helyreállító hivatkozást. Ellenőrizd a levélszemét mappát is.";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: "A kérés nem engedélyezett." }, { status: 403 });
  }

  const rateLimit = checkRateLimit(request);
  if (!rateLimit.allowed) {
    return Response.json(
      { error: "Túl sok helyreállítási kérés érkezett. Próbáld újra később." },
      { status: 429, headers: { "retry-after": String(rateLimit.retryAfter) } }
    );
  }

  try {
    const parsed = resetPasswordSchema.safeParse(await request.json());
    if (!parsed.success) {
      return Response.json(
        { error: "Ellenőrizd az e-mail-címet.", fieldErrors: toFieldErrors(parsed.error) },
        { status: 400 }
      );
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const publicKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    if (!url || !publicKey) {
      console.error("[api/auth/reset-password] missing Supabase configuration");
      return Response.json({ error: "A jelszó-helyreállítás nincs beállítva." }, { status: 503 });
    }

    const startedAt = Date.now();
    const supabase = createSupabaseClient(url, publicKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });
    const redirectTo = new URL("/auth/callback?next=/auth/update-password", request.url).toString();
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, { redirectTo });
    await waitForMinimumDuration(startedAt, 650);

    if (error) {
      console.warn("[api/auth/reset-password] rejected", { code: error.code });
      if (["over_email_send_rate_limit", "over_request_rate_limit"].includes(error.code || "")) {
        return Response.json({ error: "Túl sok levélküldési kérés érkezett. Próbáld újra később." }, { status: 429 });
      }
      return Response.json({ error: "A helyreállító levél most nem küldhető el. Próbáld újra később." }, { status: 503 });
    }

    console.info("[api/auth/reset-password] request accepted");
    return Response.json({ success: true, message: genericMessage }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    console.error("[api/auth/reset-password] failed", { code: error && typeof error === "object" && "code" in error ? String(error.code) : "unknown" });
    return Response.json({ error: "A jelszó-helyreállítás most nem indítható el." }, { status: 500 });
  }
}
