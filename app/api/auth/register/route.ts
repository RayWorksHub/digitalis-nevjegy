import { createClient as createSupabaseClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import { createMemoryRateLimiter, isSameOrigin } from "@/lib/auth-request";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { registrationSchema, toFieldErrors } from "@/lib/validation";

export const runtime = "nodejs";

const PRIVACY_VERSION = "2026-08-20";
const checkRateLimit = createMemoryRateLimiter(30, 60 * 60 * 1000);

async function findUserByEmail(admin: SupabaseClient, email: string): Promise<User | null> {
  for (let page = 1; page <= 20; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    const user = data.users.find((item) => item.email?.toLowerCase() === email);
    if (user) return user;
    if (data.users.length < 1000) return null;
  }
  return null;
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: "A kérés nem engedélyezett." }, { status: 403 });
  }

  const rateLimit = checkRateLimit(request);
  if (!rateLimit.allowed) {
    return Response.json(
      { error: "Túl sok regisztrációs próbálkozás. Próbáld újra később." },
      { status: 429, headers: { "retry-after": String(rateLimit.retryAfter) } }
    );
  }

  try {
    const parsed = registrationSchema.safeParse(await request.json());
    if (!parsed.success) {
      return Response.json(
        { error: "Ellenőrizd a megadott adatokat.", fieldErrors: toFieldErrors(parsed.error) },
        { status: 400 }
      );
    }

    const admin = createAdminClient();
    const serverClient = await createServerClient();
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const publicKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    if (!admin || !serverClient || !url || !publicKey) {
      console.error("[api/auth/register] missing Supabase server configuration");
      return Response.json({ error: "A regisztrációs szolgáltatás nincs beállítva." }, { status: 503 });
    }

    const { name, email, password } = parsed.data;
    const publicClient = createSupabaseClient(url, publicKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const { data: signInData, error: signInError } = await publicClient.auth.signInWithPassword({ email, password });
    if (signInData.user) {
      console.info("[api/auth/register] existing account rejected");
      return Response.json(
        {
          error: "Ezzel az e-mail-címmel már van fiók. Lépj be, vagy kérj jelszó-helyreállítást.",
          fieldErrors: { email: "Ehhez az e-mail-címhez már tartozik fiók." }
        },
        { status: 409 }
      );
    }

    if (signInError?.code === "email_not_confirmed") {
      const existingUser = await findUserByEmail(admin, email);
      if (!existingUser) {
        console.error("[api/auth/register] unconfirmed account could not be resolved");
        return Response.json({ error: "A korábbi regisztráció nem állítható helyre." }, { status: 409 });
      }

      const { error: updateError } = await admin.auth.admin.updateUserById(existingUser.id, {
        email_confirm: true,
        user_metadata: {
          ...existingUser.user_metadata,
          full_name: name,
          privacy_version: PRIVACY_VERSION,
          registration_mode: "instant"
        }
      });
      if (updateError) throw updateError;

      const { error: recoveredSignInError } = await serverClient.auth.signInWithPassword({ email, password });
      if (recoveredSignInError) throw recoveredSignInError;
      console.info("[api/auth/register] unconfirmed account activated");
      return Response.json({ success: true, recovered: true }, { headers: { "cache-control": "no-store" } });
    }

    const { error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: name,
        privacy_version: PRIVACY_VERSION,
        registration_mode: "instant"
      }
    });

    if (createError) {
      console.warn("[api/auth/register] account creation rejected", { code: createError.code });
      if (["email_exists", "user_already_exists"].includes(createError.code || "")) {
        return Response.json(
          {
            error: "Ezzel az e-mail-címmel már van fiók. Lépj be, vagy kérj jelszó-helyreállítást.",
            fieldErrors: { email: "Ehhez az e-mail-címhez már tartozik fiók." }
          },
          { status: 409 }
        );
      }
      if (createError.code === "weak_password") {
        return Response.json(
          { error: "Válassz erősebb jelszót.", fieldErrors: { password: "A megadott jelszó nem elég biztonságos." } },
          { status: 400 }
        );
      }
      throw createError;
    }

    const { error: newSignInError } = await serverClient.auth.signInWithPassword({ email, password });
    if (newSignInError) throw newSignInError;
    console.info("[api/auth/register] account created");
    return Response.json({ success: true }, { status: 201, headers: { "cache-control": "no-store" } });
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error ? String(error.code) : "unknown";
    console.error("[api/auth/register] failed", { code });
    return Response.json({ error: "A fiók most nem hozható létre. Próbáld újra." }, { status: 500 });
  }
}
