import { cookies } from "next/headers";
import { createMemoryRateLimiter, isSameOrigin } from "@/lib/auth-request";
import { createClient } from "@/lib/supabase/server";
import { toFieldErrors, updatePasswordSchema } from "@/lib/validation";

export const runtime = "nodejs";

const checkRateLimit = createMemoryRateLimiter(10, 60 * 60 * 1000);
const recoveryCookie = "e-nevjegy-recovery";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: "A kérés nem engedélyezett." }, { status: 403 });
  }

  const rateLimit = checkRateLimit(request);
  if (!rateLimit.allowed) {
    return Response.json({ error: "Túl sok próbálkozás. Kérj új helyreállító hivatkozást." }, { status: 429 });
  }

  try {
    const parsed = updatePasswordSchema.safeParse(await request.json());
    if (!parsed.success) {
      return Response.json(
        { error: "Ellenőrizd az új jelszót.", fieldErrors: toFieldErrors(parsed.error) },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    if (!supabase) return Response.json({ error: "A jelszókezelés nincs beállítva." }, { status: 503 });
    const { data: auth } = await supabase.auth.getUser();
    const cookieStore = await cookies();
    const recoveryUserId = cookieStore.get(recoveryCookie)?.value;

    if (!auth.user || recoveryUserId !== auth.user.id) {
      console.warn("[api/auth/update-password] invalid recovery session");
      return Response.json({ error: "A helyreállító hivatkozás érvénytelen vagy lejárt. Kérj újat." }, { status: 401 });
    }

    const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
    if (error) {
      console.warn("[api/auth/update-password] rejected", { code: error.code });
      if (error.code === "weak_password") {
        return Response.json(
          { error: "Válassz erősebb jelszót.", fieldErrors: { password: "A megadott jelszó nem elég biztonságos." } },
          { status: 400 }
        );
      }
      return Response.json({ error: "A jelszó most nem módosítható. Kérj új helyreállító hivatkozást." }, { status: 400 });
    }

    await supabase.auth.signOut({ scope: "global" });
    cookieStore.delete(recoveryCookie);
    console.info("[api/auth/update-password] success");
    return Response.json({ success: true }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    console.error("[api/auth/update-password] failed", { code: error && typeof error === "object" && "code" in error ? String(error.code) : "unknown" });
    return Response.json({ error: "A jelszó most nem módosítható." }, { status: 500 });
  }
}
