import { createClient } from "@/lib/supabase/server";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
  const supabase = await createClient();
  if (!supabase) return Response.json({ error: "A szolgáltatás nincs beállítva." }, { status: 503 });
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return Response.json({ error: "Nincs bejelentkezve." }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return Response.json({ error: "Nem érkezett kép." }, { status: 400 });
  if (!allowedTypes.has(file.type)) return Response.json({ error: "Csak JPG, PNG vagy WebP tölthető fel." }, { status: 400 });
  if (file.size > 3 * 1024 * 1024) return Response.json({ error: "A kép legfeljebb 3 MB lehet." }, { status: 400 });

  const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `${auth.user.id}/avatar-${Date.now()}.${extension}`;
  const { error } = await supabase.storage.from("avatars").upload(path, file, { contentType: file.type, upsert: false, cacheControl: "3600" });
  if (error) return Response.json({ error: "A kép nem tölthető fel." }, { status: 500 });
  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  return Response.json({ url: data.publicUrl });
}
