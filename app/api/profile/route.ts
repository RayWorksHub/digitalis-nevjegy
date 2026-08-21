import type { Profile } from "@/lib/types";
import { normalizeSlug } from "@/lib/utils";
import { profileSchema } from "@/lib/validation";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  if (!supabase) return Response.json({ error: "A szolgáltatás nincs beállítva." }, { status: 503 });
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return Response.json({ error: "Nincs bejelentkezve." }, { status: 401 });

  const { data, error } = await supabase.from("profiles").select("*, social_links(*)").eq("owner_id", auth.user.id).maybeSingle();
  if (error) return Response.json({ error: "A profil nem tölthető be." }, { status: 500 });
  return Response.json({ profile: data as Profile | null });
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    if (!supabase) return Response.json({ error: "A szolgáltatás nincs beállítva." }, { status: 503 });
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return Response.json({ error: "Nincs bejelentkezve." }, { status: 401 });

    const raw = await request.json();
    raw.slug = normalizeSlug(String(raw.slug || ""));
    const parsed = profileSchema.safeParse(raw);
    if (!parsed.success) return Response.json({ error: parsed.error.issues[0]?.message || "Érvénytelen adatok." }, { status: 400 });

    const { social_links, ...values } = parsed.data;
    const { data: profile, error } = await supabase
      .from("profiles")
      .upsert({ ...values, owner_id: auth.user.id, updated_at: new Date().toISOString() }, { onConflict: "owner_id" })
      .select()
      .single();

    if (error) {
      const message = error.code === "23505" ? "Ez a profilcím már foglalt. Válassz másikat." : "A profil nem menthető.";
      return Response.json({ error: message }, { status: 409 });
    }

    const { error: deleteError } = await supabase.from("social_links").delete().eq("profile_id", profile.id);
    if (deleteError) return Response.json({ error: "A hivatkozások nem frissíthetők." }, { status: 500 });

    if (social_links.length) {
      const { error: linkError } = await supabase.from("social_links").insert(social_links.map((link, index) => ({ ...link, id: undefined, profile_id: profile.id, sort_order: index })));
      if (linkError) return Response.json({ error: "A hivatkozások nem menthetők." }, { status: 500 });
    }

    const { data: complete } = await supabase.from("profiles").select("*, social_links(*)").eq("id", profile.id).single();
    return Response.json({ profile: complete });
  } catch {
    return Response.json({ error: "Hibás kérés." }, { status: 400 });
  }
}
