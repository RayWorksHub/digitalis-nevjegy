import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  if (!supabase) return Response.json({ error: "A szolgáltatás nincs beállítva." }, { status: 503 });
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return Response.json({ error: "Nincs bejelentkezve." }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("*, social_links(*), profile_events(*)").eq("owner_id", auth.user.id).maybeSingle();
  const payload = { exported_at: new Date().toISOString(), account: { id: auth.user.id, email: auth.user.email, created_at: auth.user.created_at }, profile };
  return new Response(JSON.stringify(payload, null, 2), { headers: { "content-type": "application/json; charset=utf-8", "content-disposition": "attachment; filename=e-nevjegy-adataim.json" } });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const admin = createAdminClient();
  if (!supabase || !admin) return Response.json({ error: "A biztonságos törlési szolgáltatás nincs beállítva." }, { status: 503 });
  const authorization = request.headers.get("authorization");
  const bearerToken = authorization?.startsWith("Bearer ") ? authorization.slice(7) : "";
  const { data: auth } = bearerToken ? await admin.auth.getUser(bearerToken) : await supabase.auth.getUser();
  if (!auth.user) return Response.json({ error: "Nincs bejelentkezve." }, { status: 401 });

  const { data: files } = await admin.storage.from("avatars").list(auth.user.id);
  if (files?.length) await admin.storage.from("avatars").remove(files.map((file) => `${auth.user.id}/${file.name}`));
  const { error } = await admin.auth.admin.deleteUser(auth.user.id);
  if (error) return Response.json({ error: "A fiók most nem törölhető." }, { status: 500 });
  return Response.json({ success: true });
}
